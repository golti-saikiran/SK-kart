import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import useStore from "../../Store/store";
import { CartItem, AddressDetails } from "../../utils/Types";
import "./CheckoutPage.css";
import { toast } from "react-toastify";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import orderCalls from "../../API/OrdersCalls";
import { base_backend_url, endpoints } from "../../utils/EndPoints";
import getAuthHeaders from "../../API/AuthHeaders";
import axios from "axios";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { selectedItems, selectedAddressId } = location.state || {};
  const user = useStore((state) => state.user);
  const clearUserCart = useStore((state) => state.clearUserCart)
  const addressList = user.address_details;

  const [address, setAddress] = useState<AddressDetails | null>(null);
  const [paymentMode, setPaymentMode] = useState<"COD" | "CARD" | "UPI">("COD");
  const [isAddressOpen, setIsAddressOpen] = useState(true);
  const [isItemsOpen, setIsItemsOpen] = useState(false);

  useEffect(() => {
    const found = addressList.find((addr) => addr._id === selectedAddressId);
    setAddress(found || null);
  }, [selectedAddressId, addressList]);

  const total = selectedItems.reduce(
    (acc: number, item: CartItem) => acc + item.productId.price * item.quantity,
    0
  );

  const handlePlaceOrder = async () => {
    if (!address) {
      toast.error("Please select a delivery address.");
      return;
    }

    const orderPayload = {
      userId: user._id,
      items_ordered: selectedItems.map((item: CartItem) => ({
        product: item.productId._id,
        quantity: item.quantity, // Optional: include if backend expects it
      })),
      payment_mode: paymentMode,
      address: address._id,
      total_amount: total,
      ordered_date: new Date().toISOString(),
      status: paymentMode === "COD" ? "Ordered" : "Pending_payment",
      deliver_date: "",
    };

    try {
      if (paymentMode === "COD") {
        const response = await orderCalls.placeOrder(orderPayload);
        if (response?.success && response?.order) {
          try {
            const url = `${base_backend_url}${endpoints.users.clearCart}/${user._id}`;
            const userresponse = await axios.delete(url, {
              headers: getAuthHeaders(),
            });
            if (userresponse.data.success) {
              clearUserCart()
              navigate(`/success/${response.order._id}`, { replace: true });
              toast.success('order placed successfully')
            }
          } catch (err) {
            toast.error('unable to delete cart')
          }
        } else {
          toast.error("Failed to place order.");
        }
      } else {
        toast.warn(`Pay ₹${total} via ${paymentMode}`);
        navigate("/order-success");
      }
    } catch (error) {
      console.error("Order placement error:", error);
      toast.error("Something went wrong while placing the order.");
    }
  };

  return (
    <div className="checkout-page">
      <div className="checkout-left">
        {/* Accordion 1: Address */}
        <div className="accordion">
          <div className="accordion-header" onClick={() => setIsAddressOpen(!isAddressOpen)}>
            <h3>Selected Delivery Address</h3>
            <span>{isAddressOpen ? <FaChevronUp /> : <FaChevronDown />}</span>
          </div>
          {isAddressOpen && (
            <div className="accordion-body">
              {address ? (
                <div className="checkout-address-card">
                  <p><strong>{address.name}</strong></p>
                  <p>{address.address_line}, {address.city}</p>
                  <p>{address.state} - {address.pincode}</p>
                  <p>Phone: {address.mobile}</p>
                </div>
              ) : (
                <p>No address selected</p>
              )}
            </div>
          )}
        </div>

        {/* Accordion 2: Cart Items */}
        <div className="accordion">
          <div className="accordion-header" onClick={() => setIsItemsOpen(!isItemsOpen)}>
            <h3>Order Summary</h3>
            <span>{isItemsOpen ? <FaChevronUp /> : <FaChevronDown />}</span>
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
          <label>
            <input
              type="radio"
              name="payment"
              value="COD"
              checked={paymentMode === "COD"}
              onChange={() => setPaymentMode("COD")}
            /> Cash On Delivery
          </label>
          <label>
            <input
              type="radio"
              name="payment"
              value="CARD"
              checked={paymentMode === "CARD"}
              onChange={() => setPaymentMode("CARD")}
            /> Card Payment
          </label>
          <label>
            <input
              type="radio"
              name="payment"
              value="UPI"
              checked={paymentMode === "UPI"}
              onChange={() => setPaymentMode("UPI")}
            /> UPI
          </label>

          <button className="pay-btn" onClick={handlePlaceOrder}>
            {paymentMode === "COD" ? "Place Order" : `Pay ₹${total}`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
