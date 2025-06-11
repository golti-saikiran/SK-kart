import { ProductType } from '../../utils/Types'
import './EditProductCard.css'
import { FiEdit } from "react-icons/fi";
import { MdDelete } from "react-icons/md";

type EditProductCardProps = {
    product: ProductType
    handleEdit: (product: ProductType) => void
    handleDelete: (productId: string) => void
}

const EditProductCard: React.FC<EditProductCardProps> = ({ product, handleDelete, handleEdit }) => {

    return (
        <div className='edit-product-card'>
            <img
                src={product.product_image_url}
                alt={product.productname}
                className="edit-product-image"
            />
            <div className="edit-product-info">
                <h3 className='product-title'>{product.productname}</h3>
                <div className='product-price-container' >
                    <strong className='product-price'>₹{product.price}</strong>{" "}
                    <span>{product.discount ?
                        <span className="discount">(-{product.discount}%)</span>
                        : null}
                    </span>
                </div>
                <div className='product-price-container'>
                    <p className='more-details'>Quantity: {product.quantity_available}</p>
                    <p className='more-details'>Rating: ⭐ {product.rating}</p>
                </div>
                {product.description && <p className='description'>{product.description}</p>}
            </div>

            <div className="product-action-buttons">
                <button onClick={() => handleEdit(product)} className="product-edit-btn">
                    <FiEdit /> Edit
                </button>
                <button onClick={() => handleDelete(product._id)} className="product-delete-btn">
                    <MdDelete /> Delete
                </button>
            </div>
        </div>
    )
}

export default EditProductCard
