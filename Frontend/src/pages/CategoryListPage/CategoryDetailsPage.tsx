import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useStore from "../../Store/store";
import productCalls from "../../API/ProductCalls";
import { ProductType, SubCategoryTypes, CategoryTypes } from "../../utils/Types";
import "./CategoryDetailsPage.css";
import { AiOutlineProduct } from "react-icons/ai";
import ProductCard from "../../components/ProductCard/ProductCard";
import SubCategoryCard from "../../components/SubCategoryCard/SubCategoryCard";

const CategoryDetailsPage = () => {
  const { id } = useParams();
  const categories = useStore((state) => state.category);
  const subCategories = useStore((state) => state.subCategory);
  const [selectedSubCat, setSelectedSubCat] = useState<string | null>(null);
  const [products, setProducts] = useState<ProductType[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<ProductType[]>([]);

  // Get category name from store
  const category = categories.find((cat: CategoryTypes) => cat._id === id);

  // Filter subcategories for this category
  const filteredSubCategories = subCategories.filter(
    (sub: SubCategoryTypes) => sub.category._id === id
  );

  useEffect(() => {
    const fetchProductsByCategoryId = async () => {
      try {
        const res = await productCalls.getProductsByCategoryId(id as string);
        setProducts(res.productsDetails);
      } catch (err) {
        console.error("Failed to fetch products", err);
      }
    };

    fetchProductsByCategoryId();
  }, [id]);

  useEffect(() => {
    if (!selectedSubCat) {
      setFilteredProducts(products); // Show all products if none selected
    } else {
      const subCatProducts = products.filter(
        (product: ProductType) => product.sub_category?._id === selectedSubCat
      );
      setFilteredProducts(subCatProducts);
    }
  }, [selectedSubCat, products]);

  return (
    <div className="category-details-container">
      <h3 className="category-header">
        {category?.category_name || "Category"}
      </h3>

      <div className="subcat-scroll">
        <div
          className={`subcat-container ${!selectedSubCat ? "active" : ""}`}
          onClick={() => setSelectedSubCat(null)}
        >
          <AiOutlineProduct className="subcategory-icon" />
          <p>All</p>
        </div>
        {filteredSubCategories.map((sub) => (
          <SubCategoryCard
            key={sub._id}
            subCategory={sub}
            selectedSubCat={selectedSubCat}
            setSelectedSubCat={setSelectedSubCat}
          />
        ))}
      </div>

      <div className="products-grid">
        {filteredProducts.length === 0 ? (
          <p className="no-products">No products available.</p>
        ) : (
          filteredProducts.map((product) => (
            <ProductCard product={product} key={product._id} />
          ))
        )}
      </div>
    </div>
  );
};

export default CategoryDetailsPage;
