import { useState, useEffect } from "react";
import useStore from "../../Store/store";
import "./CartPage.css";
import { CartItem, AddressDetails, ProductType } from "../../utils/Types";
import { useNavigate } from "react-router";
import cartCalls from "../../API/CartCalls";
import { toast } from "react-toastify";
import useInvalidTokenHandler from "../../utils/useInvalidTokenHandler";
import { getErrorMessage } from "../../utils/getErrorMessage";


const CartPage = () => {
  const user = useStore((state) => state.user);
  const shopping_cart = user.shopping_cart;
  const updateUserCart = useStore((state) => state.updateUserCart);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const InvalidTokenHandler = useInvalidTokenHandler()

  // 🟡 Manage selected product IDs
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const navigate = useNavigate()

  // Select all cart items by default
  useEffect(() => {
    setSelectedProductIds(shopping_cart.map(item => item.productId._id));
  }, [shopping_cart]);

  const handleIncrement = async (product: ProductType) => {
    try {
      const response = await cartCalls.incrementCartItem({
        userId: user._id,
        productId: product._id,
      });
      if (response?.data) {
        updateUserCart(response.data);
        toast.success('product incremented')
      }
    } catch (err) {
      console.error("Increment failed", err);
      InvalidTokenHandler(getErrorMessage(err));
      toast.error("Could not increase quantity.");
    }
  };

  const handleDecrement = async (product: ProductType) => {
    try {
      const response = await cartCalls.decrementCartItem({
        userId: user._id,
        productId: product._id,
      });
      if (response?.data) {
        updateUserCart(response.data);
        toast.success('product decremented')
      }
    } catch (err) {
      console.error("Decrement failed", err);
      InvalidTokenHandler(getErrorMessage(err));
      toast.error("Could not decrease quantity.");
    }
  };

  const handleRemove = async (product: ProductType) => {
    try {
      const response = await cartCalls.deleteCartItem({
        userId: user._id,
        productId: product._id,
      });
      if (response?.data) {
        updateUserCart(response.data);
        toast.success("product removed")
      }
    } catch (err) {
      console.error("Decrement failed", err);
      InvalidTokenHandler(getErrorMessage(err));
      toast.error("Could not decrease quantity.");
    }
    setSelectedProductIds((prev) => prev.filter(pid => pid !== product._id));
  };

  // 🟡 Toggle product selection
  const toggleProductSelection = (id: string) => {
    setSelectedProductIds((prev) =>
      prev.includes(id) ? prev.filter(pid => pid !== id) : [...prev, id]
    );
  };

  // 🟢 Compute price only for selected items
  const calculateTotal = () => {
    const selectedItems = user.shopping_cart.filter(item =>
      selectedProductIds.includes(item.productId._id)
    );

    let total = 0;
    let saved = 0;

    selectedItems.forEach(item => {
      const { price, discount } = item.productId;
      const discountedPrice = price - (price * discount) / 100;
      total += discountedPrice * item.quantity;
      saved += (price - discountedPrice) * item.quantity;
    });

    const discount = total > 1000 ? 100 : 0;
    const shipping = total > 500 ? 0 : 50;

    // Add discount into saved total
    const totalSaved = saved + discount;

    const grandTotal = total - discount + shipping;

    return {
      total: Math.round(total),
      discount,
      shipping,
      grandTotal: Math.round(grandTotal),
      saved: totalSaved.toFixed(2), // ⬅️ format saved to 2 decimals
    };
  };


  const { total, discount, shipping, grandTotal, saved } = calculateTotal();

  const canCheckout = selectedProductIds.length > 0 && !!selectedAddressId;

  return (
    <div className="cart-page">
      {shopping_cart.length <= 0 ? <div className="no-product-message">No products in cart</div> :
        <>
          <div className="cart-left">
            <h2 className="cart-heading">Your Cart</h2>
            {shopping_cart.map((item: CartItem) => (
              <div key={item.productId._id} className="cart-item-card">
                <input
                  type="checkbox"
                  className="cart-checkbox"
                  checked={selectedProductIds.includes(item.productId._id)}
                  onChange={() => toggleProductSelection(item.productId._id)}
                />
                <img
                  src={item.productId.product_image_url}
                  alt={item.productId.productname}
                  className="cart-img"
                />
                <div className="cart-details">
                  <h4>{item.productId.productname}</h4>
                  <p>₹ {item.productId.price - (item.productId.price * item.productId.discount) / 100}  <del>₹{item.productId.price}</del></p>
                  <div className="quantity-controls">
                    <button onClick={() => handleDecrement(item.productId)} className="inc-dec-buttons">-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => handleIncrement(item.productId)} className="inc-dec-buttons">+</button>
                    <button className="remove-btn" onClick={() => handleRemove(item.productId)}>Remove</button>
                  </div>
                </div>
              </div>
            ))}

          </div>

          <div className="cart-right">


            <div className="address-section">
              <div className="address-section-heading">
                <h3>Select Delivery Address</h3>
                <button className="cart-add-address-button" onClick={() => navigate('/dashboard/user/address')}>Add addreess</button>
              </div>
              <div className="address-section-cards">
                {user.address_details.map((addr: AddressDetails) => (
                  <div
                    key={addr._id}
                    className={`cart-address-card ${selectedAddressId === addr._id ? "selected" : ""}`}
                    onClick={() => {
                      setSelectedAddressId(addr._id)
                      toast.success("address selected")
                    }}
                  >
                    <p><strong>{addr.name}</strong></p>
                    <p>{addr.address_line}, {addr.city}</p>
                    <p>{addr.state} - {addr.pincode}</p>
                    <p>Phone: {addr.mobile}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="price-summary">
              <h3>Price Summary</h3>
              <p>Total: ₹{total}</p>
              <p>Discount: ₹{discount}</p>
              <p>Shipping: ₹{shipping}</p>
              <hr />
              <p><strong>Grand Total: ₹{grandTotal}</strong>
                <p className="amount-saved">You Saved: ₹{saved}</p></p>
              <button
                disabled={!canCheckout}
                className={`checkout-btn ${!canCheckout ? "disabled" : ""}`}
                onClick={() => {
                  if (selectedAddressId) {
                    const selectedItems = user.shopping_cart.filter(item =>
                      selectedProductIds.includes(item.productId._id)
                    );
                    navigate("/checkout", {
                      state: {
                        selectedItems,
                        selectedAddressId,
                      },
                    });
                  }
                }}
              >
                Proceed to Checkout
              </button>
            </div>

          </div>
        </>}
    </div>
  );
};

export default CartPage;
