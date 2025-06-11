import './ProductCard.css';
import { MdAccessAlarms, MdCurrencyRupee, MdAdd } from "react-icons/md";
import { FiMinus } from "react-icons/fi";
import { ProductType } from '../../utils/Types';
import { useNavigate } from 'react-router';
import useStore from '../../Store/store';
import cartCalls from '../../API/CartCalls';
import { toast } from 'react-toastify';
import useInvalidTokenHandler from '../../utils/useInvalidTokenHandler';
import { getErrorMessage } from '../../utils/getErrorMessage';

type ProductCardProps = {
    product: ProductType;
};

const ProductCard = ({ product }: ProductCardProps) => {
    const user = useStore((state) => state.user);
    const updateCart = useStore((state) => state.updateUserCart);
    const isAuthenticate = useStore((state) => state.isAuthenticate)
    const InvalidTokenHandler = useInvalidTokenHandler()
    const cart = user.shopping_cart || [];
    const navigate = useNavigate();

    const handleProductClick = () => {
        if (!isAuthenticate) {
            toast.warn("Please login to continue")
            navigate('/login')
        } else {
            navigate(`/products/${product._id}`, { state: { product } });
        }

    };

    // Safe cart item lookup: works whether productId is populated (object) or not
    const cartItem = cart.find(item => {
        const itemId = typeof item.productId === 'object' ? item.productId._id : item.productId;
        return itemId === product._id;
    });

    const quantity = cartItem?.quantity || 0;





    const handleIncrementProduct = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!isAuthenticate) {
            toast.warn("Please login to continue")
            navigate('/login')
        } else {
            try {
                const response = await cartCalls.incrementCartItem({
                    userId: user._id,
                    productId: product._id,
                });
                if (response?.data) {
                    updateCart(response.data);
                    toast.success("Product added")
                }
            } catch (err) {
                console.error("Increment failed", err);
                InvalidTokenHandler(getErrorMessage(err));
                toast.error("Could not add or increase quantity.");
            }
        }

    }

    const handleDecrementProduct = async (e: React.MouseEvent) => {
        e.stopPropagation();
        try {
            const response = await cartCalls.decrementCartItem({
                userId: user._id,
                productId: product._id,
            });
            if (response?.data) {
                updateCart(response.data);
                toast.success("Product removed")
            }
        } catch (err) {
            console.error("Decrement failed", err);
            InvalidTokenHandler(getErrorMessage(err));
            toast.error("Could not delete or decrease quantity.");
        }
    };

    return (
        <div className="product-card" key={product._id} onClick={handleProductClick}>
            <div className="product-image">
                <img src={product.product_image_url} alt={product.productname} width="180px" />
            </div>
            <div className="product-details">
                <div className='delivery-badge'><MdAccessAlarms /> 10mins</div>
                <h3 className="product-title">{product.productname}</h3>
                <div className="product-quantity">{product.quantity_available}</div>
                <div className='product-price-container'>
                    <span className="product-price"><MdCurrencyRupee />{product.price}</span>
                    {quantity > 0 ? (
                        <div className="add-to-cart-button item-added-button">
                            <button onClick={handleDecrementProduct}><FiMinus /></button>
                            <span onClick={(e) => e.stopPropagation()}>{quantity}</span>
                            <button onClick={handleIncrementProduct}><MdAdd /></button>
                        </div>
                    ) : (
                        <button className="add-to-cart-button" onClick={handleIncrementProduct}>
                            ADD
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
