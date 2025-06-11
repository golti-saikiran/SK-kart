import { useState, useEffect, FormEvent, useMemo } from "react";
import { useParams, useLocation } from "react-router";
import DashBoardPageLayout from "../../layout/DashBoard/DashBoardPageLayout";
import useStore from "../../Store/store";
import ImageUploaderButton from "../CategoryPage/ImageUploaderButton";
import "./AddProduct.css";
import productCalls from "../../API/ProductCalls";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getErrorMessage } from "../../utils/getErrorMessage";
import useInvalidTokenHandler from "../../utils/useInvalidTokenHandler";

const AddProducts = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const isNew = id === "new";
  const product = isNew ? null : location.state?.product;
  const navigate = useNavigate();
  const InvalidTokenHandler = useInvalidTokenHandler()


  const [productname, setProductname] = useState("");
  const [productImageUrl, setProductImageUrl] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState<number | "">("");
  const [discount, setDiscount] = useState<number | "">("");
  const [description, setDescription] = useState("Discover top-quality products crafted to meet your daily needs with reliability and style.Each item is carefully selected to ensure satisfaction, performance, and value. Shop now and experience convenience, comfort, and excellence in every purchase.");
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [rating, setRating] = useState<number>(0);
  useEffect(() => {
    if (id === "new") {
      // Reset form fields for new product
      setProductname("");
      setProductImageUrl("");
      setQuantity("");
      setPrice("");
      setDiscount("");
      setDescription("Discover top-quality products crafted to meet your daily needs with reliability and style.Each item is carefully selected to ensure satisfaction, performance, and value. Shop now and experience convenience, comfort, and excellence in every purchase.");
      setCategory("");
      setSubCategory("");
      setRating(0);
    } else if (location.state?.product) {
      const p = location.state.product;
      setProductname(p.productname || "");
      setProductImageUrl(p.product_image_url || "");
      setQuantity(p.quantity_available || "");
      setPrice(p.price || "");
      setDiscount(p.discount || "");
      setDescription(p.description || "");
      setCategory(p.category?._id || "");
      setSubCategory(p.sub_category?._id || "");
      setRating(p.rating || 0);
    }
  }, [id, location.state]);


  const categories = useStore((state) => state.category);
  const subCategories = useStore((state) => state.subCategory);

  const filteredSubCategories = useMemo(() => {
    return subCategories.filter((sub) => {
      const cat = sub.category;
      return typeof cat === "string" ? cat === category : cat._id === category;
    });
  }, [subCategories, category]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (
      !productname ||
      !productImageUrl ||
      !quantity ||
      !price ||
      !description ||
      !category ||
      !subCategory
    ) {
      toast.warn("Please fill in all required fields.");
      return;
    }

    const productPayload = {
      productname,
      product_image_url: productImageUrl,
      quantity_available: quantity,
      price: Number(price),
      discount: Number(discount) || 0,
      description,
      category,
      sub_category: subCategory,
      rating,
    };

    try {
      if (id === "new") {
        await productCalls.addNewProduct(productPayload);
        toast.success("Product added successfully");
      } else {
        await productCalls.updateProductById(product._id, productPayload);
        toast.success("Product updated successfully");
        navigate('/dashboard/admin/products');
      }

      // Clear form (optional if staying on page)
      setProductname("");
      setProductImageUrl("");
      setQuantity("");
      setPrice("");
      setDiscount("");
      setDescription("Discover top-quality products crafted to meet your daily needs with reliability and style.Each item is carefully selected to ensure satisfaction, performance, and value. Shop now and experience convenience, comfort, and excellence in every purchase.");
      setCategory("");
      setSubCategory("");
      setRating(0);
    } catch (err) {
      console.error("Product operation failed:", err);
      InvalidTokenHandler(getErrorMessage(err));
      toast.error("Operation failed");
    }
  };


  return (
    <DashBoardPageLayout title="Add Products">
      <form onSubmit={handleSubmit} className="add-product-form">
        <div className="form-field">
          <label htmlFor="name">Product Name:</label>
          <input
            id="name"
            type="text"
            placeholder="Product Name"
            value={productname}
            onChange={(e) => setProductname(e.target.value)}
            required
          />
        </div>
        <div className="form-field">
          <label htmlFor="Quantity">Quantity Available:</label>
          <input
            type="text"
            placeholder="Quantity Available"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            required
          />
        </div>
        <div className="form-field">
          <label htmlFor="Price">Price:</label>
          <input
            id="Price"
            type="number"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            required
          />
        </div>
        <div className="form-field">
          <label htmlFor="Discount">Discount:</label>
          <input
            id="Discount"
            type="number"
            placeholder="Discount (%)"
            value={discount}
            onChange={(e) => setDiscount(Number(e.target.value))}
          />
        </div>
        <div className="form-field">
          <label htmlFor="category">Select Category:</label>
          <select
            id="category"
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setSubCategory(""); // reset subcategory
            }}
            required
          >
            <option value="">-- Select Category --</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.category_name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-field">
          <label htmlFor="subcategory">Select Sub Category:</label>
          <select
            id="subcategory"
            value={subCategory}
            onChange={(e) => setSubCategory(e.target.value)}
            required
            disabled={!category}
          >
            <option value="">-- Select Sub Category --</option>
            {filteredSubCategories.map((sub) => (
              <option key={sub._id} value={sub._id}>
                {sub.subcategory_name}
              </option>
            ))}
          </select>
        </div>
        <div className="form-field">
          <label htmlFor="Description">Product Description:</label>
          <textarea
            id="Description"
            placeholder="Product Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div className="form-field">
          <label htmlFor="rating">Rating (0–5):</label>
          <input
            type="number"
            min={0}
            max={5}
            value={rating}
            step={0.1}
            id="rating"
            placeholder="Rating (0–5)"
            onChange={(e) => setRating(Number(e.target.value))}
          />
        </div>

        <span className="image-uploader">
          <ImageUploaderButton
            name={productname}
            image={productImageUrl}
            setImage={setProductImageUrl}
          />
        </span>


        <button
          type="submit"
          disabled={
            !productname ||
            !productImageUrl ||
            !quantity ||
            !price ||
            !description ||
            !category ||
            !subCategory
          }
        >
          {isNew ? "Add Product" : "Update Product"}
        </button>
      </form>
    </DashBoardPageLayout>
  );
};

export default AddProducts;
