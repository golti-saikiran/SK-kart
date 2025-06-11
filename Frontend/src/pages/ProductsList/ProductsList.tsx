import { useEffect, useState } from "react";
import DashBoardPageLayout from "../../layout/DashBoard/DashBoardPageLayout";
import useStore from "../../Store/store";
import productCalls from "../../API/ProductCalls";
import { ProductType, CategoryTypes, SubCategoryTypes } from "../../utils/Types";
import "./ProductsList.css";
import EditProductCard from "../../components/EditProductCard/EditProductCard";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { getErrorMessage } from "../../utils/getErrorMessage";
import useInvalidTokenHandler from "../../utils/useInvalidTokenHandler";

const ProductsList = () => {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<ProductType[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const navigate = useNavigate();
  const InvalidTokenHandler = useInvalidTokenHandler()

  const categories = useStore((state) => state.category);
  const subCategories = useStore((state) => state.subCategory);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await productCalls.getAllProducts();
        setProducts(res.productsList || []);
        setFilteredProducts(res.productsList);
        console.log("Fetched Products:", res.productsList);

      } catch (err) {
        console.error("Failed to fetch products", err);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    let filtered = products;
    if (selectedCategory) {
      filtered = filtered.filter((p) =>
        typeof p.category === "string"
          ? p.category === selectedCategory
          : p.category._id === selectedCategory
      );

    }
    if (selectedSubCategory) {
      filtered = filtered.filter((p) =>
        typeof p.sub_category === "string"
          ? p.sub_category === selectedSubCategory
          : p.sub_category._id === selectedSubCategory
      );
    }

    setFilteredProducts(filtered);
  }, [selectedCategory, selectedSubCategory, products]);

  // Handler functions
  const handleEdit = (product: ProductType) => {
    console.log("Edit product:", product);
    navigate(`/dashboard/admin/product/${product._id}`, { state: { product } });

  };

  const handleDelete = async (productId: string) => {
    const confirm = window.confirm("Are you sure you want to delete this product?");
    if (!confirm) return;
    try {
      await productCalls.deleteProductById(productId); // Assuming this API exists
      setProducts((prev) => prev.filter((p) => p._id !== productId));
    } catch (err) {
      console.error("Failed to delete product:", err);
      InvalidTokenHandler(getErrorMessage(err));
      toast.error("Failed to delete product")
    }
  };

  return (
    <DashBoardPageLayout title="Products List">
      <div className="products-list-container">
        <div className="product-filter-bar">
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setSelectedSubCategory("");
            }}
          >
            <option value="">All Categories</option>
            {categories.map((cat: CategoryTypes) => (
              <option key={cat._id} value={cat._id}>
                {cat.category_name}
              </option>
            ))}
          </select>

          <select
            value={selectedSubCategory}
            onChange={(e) => setSelectedSubCategory(e.target.value)}
            disabled={!selectedCategory}
          >
            <option value="">All Subcategories</option>
            {subCategories
              .filter((sub: SubCategoryTypes) =>
                typeof sub.category === "string"
                  ? sub.category === selectedCategory
                  : sub.category._id === selectedCategory
              )
              .map((sub: SubCategoryTypes) => (
                <option key={sub._id} value={sub._id}>
                  {sub.subcategory_name}
                </option>
              ))}
          </select>
        </div>

        <div className="product-cards-container">
          {filteredProducts.length > 0 ? filteredProducts.map((product: ProductType) => (
            <EditProductCard
              key={product._id}
              product={product}
              handleEdit={handleEdit}
              handleDelete={handleDelete}
            />
          )) : <div>No products available</div>}
        </div>
      </div>
    </DashBoardPageLayout>
  );
};

export default ProductsList;
