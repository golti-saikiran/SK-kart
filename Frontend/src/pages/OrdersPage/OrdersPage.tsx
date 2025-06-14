import { useEffect, useState } from "react";
import DashBoardPageLayout from "../../layout/DashBoard/DashBoardPageLayout";
import orderCalls from "../../API/OrdersCalls";
import { OrderType } from "../../utils/Types";
import useStore from "../../Store/store";
import "./OrdersPage.css";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const OrdersPage = () => {
  const user = useStore((state) => state.user);
  const [orders, setOrders] = useState<OrderType[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await orderCalls.getOrdersByUserId(user._id);
        const data = response.data;
        if (data.success) {
          const sortedOrders = data.orders.sort(
            (a: OrderType, b: OrderType) =>
              new Date(b.ordered_date).getTime() -
              new Date(a.ordered_date).getTime()
          );
          setOrders(sortedOrders);
        } else {
          toast.error(data.message || "No orders found.");
        }
      } catch (err: any) {
        toast.error(err?.response?.data?.message || "Failed to fetch orders.");
      } finally {
        setLoading(false);
      }
    };

    if (user?._id) fetchOrders();
  }, [user]);

  const handleReorder = (order: OrderType) => {
    navigate("/checkout", {
      state: {
        products: order.items_ordered,
        address: order.address,
      },
    });
  };

  return (
    <DashBoardPageLayout title="Your Orders">
      {loading ? (
        <p>Loading...</p>
      ) : orders.length === 0 ? (
        <p>No orders yet.</p>
      ) : (
        <div className="orders-grid">
          {orders.map((order) => (
            <div className="order-card" key={order._id}>
              <div className="order-section">
                <h3>Order ID: {order._id}</h3>
                <p><strong>Status:</strong> {order.status}</p>
                <p><strong>Payment:</strong> {order.payment_mode}</p>
                <p><strong>Total:</strong> ₹{order.total_amount}</p>
                <p><strong>Ordered:</strong> {new Date(order.ordered_date).toLocaleDateString()}</p>
                {order.deliver_date && (
                  <p><strong>Delivery:</strong> {new Date(order.deliver_date).toLocaleDateString()}</p>
                )}
                <p><strong>Address:</strong></p>
                {typeof order.address === "object" && order.address !== null ? (
                  <div className="address-details">
                    <p><strong>Name:</strong> {order.address.name}</p>
                    <p><strong>Mobile:</strong> {order.address.mobile}</p>
                    <p>
                      {order.address.address_line}, {order.address.city}, {order.address.state} - {order.address.pincode}
                    </p>
                  </div>
                ) : (
                  <p>Address: {order.address}</p> // fallback if it's just an ID string
                )}
                <button onClick={() => handleReorder(order)} className="reorder-btn">Reorder</button>
              </div>
              <hr />
              <div className="order-section">
                <p><strong>Products:</strong></p>
                <ul className="order-items">
                  {order.items_ordered.map((item, i) => {
                    const product = item.product;
                    return (
                      <li key={i} className="order-item">
                        {typeof product === "object" ? (
                          <>
                            <img src={product.product_image_url} alt={product.productname} width={40} height={40} />
                            <span>{item.quantity} × {product.productname} - ₹{product.price}</span>
                          </>
                        ) : (
                          <span>{item.quantity} × {product}</span>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashBoardPageLayout>
  );
};

export default OrdersPage;
