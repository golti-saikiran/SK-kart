import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import useStore from "../../Store/store";
import { CartItem, AddressDetails } from "../../utils/Types";
import "./CheckoutPage.css";
import { toast } from "react-toastify";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { selectedItems, selectedAddressId } = location.state || {};
  const user = useStore((state) => state.user);
  const addressList = user.address_details;

  const [address, setAddress] = useState<AddressDetails | null>(null);
  const [paymentMode, setPaymentMode] = useState<"COD" | "CARD" | "UPI">("COD");
  const [isAddressOpen, setIsAddressOpen] = useState(true);
  const [isItemsOpen, setIsItemsOpen] = useState(false);

  useEffect(() => {
    const found = addressList.find((addr) => addr._id === selectedAddressId);
    setAddress(found || null);
  }, [selectedAddressId, addressList]);

  const total = selectedItems.reduce((acc: number, item: CartItem) => acc + item.productId.price * item.quantity, 0);

  const handlePlaceOrder = () => {
    if (paymentMode === "COD") {
      navigate("/order-success");
    } else {
      toast.warn(`Pay ₹${total} via ${paymentMode}`);
      navigate("/order-success");
    }
  };

  return (
    <div className="checkout-page">
      <div className="checkout-left">
        {/* Accordion 1: Address */}
        <div className="accordion">
          <div className="accordion-header" onClick={() => setIsAddressOpen(!isAddressOpen)}>
            <h3>1. Delivery Address</h3>
            <span>{isAddressOpen ? "▲" : "▼"}</span>
          </div>
          {isAddressOpen && (
            <div className="accordion-body">
              {address ? (
                <div className="address-card">
                  <p><strong>{address.name}</strong></p>
                  <p>{address.address_line}, {address.city}</p>
                  <p>{address.state} - {address.pincode}</p>
                  <p>Phone: {address.mobile}</p>
                </div>
              ) : (
                <p>No address selected</p>
              )}
              <button className="change-address-btn" onClick={() => navigate("/profile/addresses")}>
                Change Address
              </button>
            </div>
          )}
        </div>

        {/* Accordion 2: Cart Items */}
        <div className="accordion">
          <div className="accordion-header" onClick={() => setIsItemsOpen(!isItemsOpen)}>
            <h3>2. Order Summary</h3>
            <span>{isItemsOpen ? "▲" : "▼"}</span>
          </div>
          {isItemsOpen && (
            <div className="accordion-body">
              {selectedItems.map((item: CartItem) => (
                <div className="checkout-item" key={item.productId._id}>
                  <img src={item.productId.product_image_url} alt={item.productId.productname} />
                  <div>
                    <h4>{item.productId.productname}</h4>
                    <p>₹{item.productId.price} x {item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right Section */}
      <div className="checkout-right">
        <div className="price-box">
          <h3>Payment Summary</h3>
          <p>Total Items: {selectedItems.length}</p>
          <p><strong>Total Payable: ₹{total}</strong></p>
        </div>

        <div className="payment-section">
          <h3>Select Payment Method</h3>
          <label><input type="radio" name="payment" value="COD" checked={paymentMode === "COD"} onChange={() => setPaymentMode("COD")} /> Cash On Delivery</label>
          <label><input type="radio" name="payment" value="CARD" checked={paymentMode === "CARD"} onChange={() => setPaymentMode("CARD")} /> Card Payment</label>
          <label><input type="radio" name="payment" value="UPI" checked={paymentMode === "UPI"} onChange={() => setPaymentMode("UPI")} /> UPI</label>

          <button className="pay-btn" onClick={handlePlaceOrder}>
            {paymentMode === "COD" ? "Place Order" : `Pay ₹${total}`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
