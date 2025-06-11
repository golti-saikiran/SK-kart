import { toast } from 'react-toastify';
import { base_backend_url, endpoints } from '../utils/EndPoints';
import axios from 'axios';
import getAuthHeaders from './AuthHeaders';

export type AddressPayLoadType = {
    name: string;
    address_line: string;
    city: string;
    state: string;
    pincode: number;
    country: string;
    mobile: number;
    userId: string;
    _id?: string; // Optional for updates
};


const addressCalls = {
    addAddress: async (address: AddressPayLoadType) => {
        try {
            const url = `${base_backend_url}${endpoints.address.addAddress}`;

            const formData = {
                'name': address.name,
                'address_line': address.address_line,
                'city': address.city,
                'state': address.state,
                'pincode': address.pincode,
                'country': address.country,
                'mobile': address.mobile,
                'userId': address.userId
            };
            const response = await axios.post(url, formData, {
                headers: getAuthHeaders(),
            });
            toast.success('Address added successfully');
            return response.data;
        } catch (error) {
            console.error('Error adding address:', error);
            toast.error("Error adding address")
            throw error;
        }
    },
    updateAddress: async (address: AddressPayLoadType) => {
        try {
            const url = `${base_backend_url}${endpoints.address.updateAddressById}/${address._id}`;
            const formData = {
                'name': address.name,
                'address_line': address.address_line,
                'city': address.city,
                'state': address.state,
                'pincode': address.pincode,
                'country': address.country,
                'mobile': address.mobile,
                'userId': address.userId
            };
            const response = await axios.put(url, formData, {
                headers: getAuthHeaders(),
            });
            toast.success('Address updated successfully');
            return response.data;
        } catch (error) {
            console.error('Error updating address:', error);
            toast.error("Error updating address")
        }
    },
    deleteAddress: async (id: string) => {
        try {
            const url = `${base_backend_url}${endpoints.address.deleteAddressById}/${id}`;
            const response = await axios.delete(url, {
                headers: getAuthHeaders(),
            });
            return response.data;
        } catch (error) {
            console.error('Error deleting address:', error);
            toast.error("Error deleting address")
            throw error;
        }
    },
}

export default addressCalls