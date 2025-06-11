import { AddressDetails } from '../../utils/Types'
import './AddressCard.css'
import { MdEdit, MdDelete } from 'react-icons/md';


type AddressCardProps = {
    address: AddressDetails,
    handleEdit: (address: AddressDetails) => void,
    handleDelete: (addressId: string) => void
}

const AddressCard: React.FC<AddressCardProps> = ({ address, handleEdit, handleDelete }) => {
    return (
        <div className="address-card" key={address._id}>
            <div className="address-info">
                <p className='address-name'>{address.name}</p>
                <p className='address-line'>{address.address_line}</p>
                <p className='address-line'>{address.city}, {address.state}, {address.pincode}</p>
                <p className='address-line'>{address.country}</p>
                <p className='address-line'> {address.mobile}</p>
            </div>
            <div className="address-actions">
                <button className="address-edit-btn" onClick={() => handleEdit(address)}><MdEdit /></button>
                <button className="address-delete-btn" onClick={() => handleDelete(address._id)}><MdDelete /></button>
            </div>
        </div>
    )
}

export default AddressCard
