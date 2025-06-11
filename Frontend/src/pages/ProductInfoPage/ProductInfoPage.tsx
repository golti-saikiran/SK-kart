import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import productCalls from "../../API/ProductCalls";
import useStore from "../../Store/store";
import './ProductInfoPage.css';
import { ProductType } from "../../utils/Types";
import { IoStarSharp } from "react-icons/io5";
import { Coupons, offers } from "./ProductMockData";
import { MdLocalOffer } from "react-icons/md";
import { BsTicketPerforatedFill } from "react-icons/bs";
import { IoCartSharp } from "react-icons/io5";
import { AiFillThunderbolt } from "react-icons/ai";
import cartCalls from '../../API/CartCalls';
import { toast } from "react-toastify";
import { getErrorMessage } from "../../utils/getErrorMessage";
import useInvalidTokenHandler from "../../utils/useInvalidTokenHandler";

const ProductInfoPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<ProductType | null>(null);
  const [showAllOffers, setShowAllOffers] = useState(false);
  const user = useStore((state) => state.user);
  const updateCart = useStore((state) => state.updateUserCart);
  const navigate = useNavigate()
    const InvalidTokenHandler = useInvalidTokenHandler()

  useEffect(() => {
    const fetchProduct = async () => {
      if (id) {
        const res = await productCalls.getProductById(id)
        setProduct(res.data)

      }
    }
    fetchProduct()

  }, [id]);


  const handleIncrementProduct = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!product || !product._id) {
      toast.warn("Product information is missing.");
      return;
    }
    try {
      const response = await cartCalls.incrementCartItem({
        userId: user._id,
        productId: product._id,
      });
      if (response?.data) {
        updateCart(response.data);
        navigate('/cart')
      }
    } catch (err) {
      console.error("Increment failed", err);
        InvalidTokenHandler(getErrorMessage(err));
      toast.error("Could not increase quantity.");
    }
  };

  if (!product) return <div className="loading">Loading...</div>;

  return (
    <div className="product-info-page">
      {/* Left Side */}
      <div className="product-info-left">
        <img
          src={product.product_image_url}
          alt={product.productname}
          className="product-info-image"
        />
        <div className="info-page-buttons">
          <button className="product-add-to-cart buy-now-button" onClick={() => toast.warn("Not implimented  yet")}>
            <AiFillThunderbolt /> Buy Now
          </button>
          <button className="product-add-to-cart" onClick={handleIncrementProduct}>
            <IoCartSharp /> Add to Cart
          </button>
        </div>

      </div>

      {/* Right Side */}
      <div className="product-info-right">
        <h1 className="product-info-title">{product?.productname}</h1>
        <span className="rating-badge">{product?.rating} <IoStarSharp /></span>

        <label className="special-offer">Special Offer</label>
        <div className="product-info-price-section">
          <span className="product-info-price">
            ₹{product.price - (product.price * product.discount) / 100}
          </span>
          {product.discount > 0 && (
            <>
              <span className="product-info-original-price"><del>₹{product.price}</del></span>
              <span className="product-info-discount">{product.discount}% off</span>
            </>
          )}
        </div>

        <div className="offers-box">
          <p className="offer-box-heading">Coupons for you</p>
          <ul>
            {Coupons.map((coupon) => (
              <div key={coupon.key} className="offers-coupons"><BsTicketPerforatedFill className="offers-icon" /> {coupon.text}</div>
            ))}
          </ul>
        </div>

        <div className="offers-box">
          <p className="offer-box-heading">Available offers</p>
          <ul>
            {(showAllOffers ? offers : offers.slice(0, 3)).map((offer) => (
              <div key={offer.key} className="offers-coupons"><MdLocalOffer className="offers-icon" /> {offer.text}</div>
            ))}
          </ul>
          {offers.length > 3 && (
            <button className="show-more-btn" onClick={() => setShowAllOffers(!showAllOffers)}>
              {showAllOffers ? "Show Less" : "View more offers"}
            </button>
          )}
        </div>

        <div className="product-meta">
          {product?.description && (
            <p className="product-info-description">
              <strong>Description: </strong>{product.description}
            </p>
          )}
          <p>🛒 Available: {product.quantity_available} units</p>
          <p>⏱️ Delivery: 2-4 days</p>
          <p>💳 Payment: UPI, COD, Cards</p>
        </div>
      </div>
    </div>
  );
};

export default ProductInfoPage;
