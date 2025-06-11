import DashBoardPageLayout from '../../layout/DashBoard/DashBoardPageLayout'
import './AddressPage.css'
import { useState } from 'react';
import useStore from '../../Store/store';
import { AddressDetails } from '../../utils/Types';
import AddressCard from '../../components/AddressCard/AddressCard';
import AddOrEditAddressModelContent from './AddOrEditAddressModelContent';
import addressCalls from '../../API/AddressCalls';
import { getErrorMessage } from '../../utils/getErrorMessage';
import useInvalidTokenHandler from '../../utils/useInvalidTokenHandler';
import { toast } from 'react-toastify';

const AddressPage = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [editAddressDetails, setEditAddressDetails] = useState<AddressDetails | null>(null);

    const user = useStore((state) => state.user);
    const deleteUserAddressById = useStore((state) => state.deleteUserAddressById);
    const addressDetails = user.address_details || [];
      const InvalidTokenHandler = useInvalidTokenHandler()

    const button = {
        text: 'Add new Address',
        clickEvent: () => {
            setEditAddressDetails(null); // Ensure it's not edit mode
            setIsOpen(true);
        },
    };

    const handleEdit = (address: AddressDetails) => {
        setEditAddressDetails(address);
        setIsOpen(true);
    };

    const handleDelete = async (addressId: string) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this address?");
        if (confirmDelete) {
            try {
                const deletedAddress = await addressCalls.deleteAddress(addressId);
                if (deletedAddress) {
                    deleteUserAddressById(addressId);
                    toast.success('Address deleted successfully');
                }
            } catch (error) {
                console.error('Error deleting address:', error);
                InvalidTokenHandler(getErrorMessage(error));
                return;
            }
        }
    };

    return (
        <DashBoardPageLayout title='Addresses' button={button}>
            <div className="address-list">
                {addressDetails.length === 0 ? (
                    <p className="no-address">No address added.</p>
                ) : (
                    addressDetails.map((address) => (
                        <AddressCard
                            key={address._id}
                            address={address}
                            handleEdit={handleEdit}
                            handleDelete={handleDelete}
                        />
                    ))
                )}
            </div>
            <AddOrEditAddressModelContent
                isOpen={isOpen}
                onClose={() => {
                    setIsOpen(false);
                    setEditAddressDetails(null); // Clear edit mode on close
                }}
                editAddressDetails={editAddressDetails}
            />
        </DashBoardPageLayout>
    );
};

export default AddressPage;
