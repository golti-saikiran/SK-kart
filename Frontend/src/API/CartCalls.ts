import { base_backend_url, endpoints } from '../utils/EndPoints';
import axios from 'axios';
import getAuthHeaders from './AuthHeaders';


export type CartActionProps = {
    userId: string;
    productId: string;
};



const cartCalls = {
    addTocart: async (item: CartActionProps) => {
        try {
            const url = `${base_backend_url}${endpoints.users.addToCart}`;
            const response = await axios.post(url, item, {
                headers: getAuthHeaders(),
            });
            console.log(url, item, response.data);

            return response.data;
        } catch (error) {
            console.error('Error adding item to cart:', error);
            throw error;
        }
    },

    incrementCartItem: async (item: CartActionProps) => {
        try {
            const url = `${base_backend_url}${endpoints.users.incrementCartItemQuantity}`;
            const response = await axios.put(url, item, {
                headers: getAuthHeaders(),
            });
            return response.data;
        } catch (error: any) {
            console.error('Error incrementing cart item:', error);
            throw error
            // throw error;
        }
    },

    decrementCartItem: async (item: CartActionProps) => {
        try {
            const url = `${base_backend_url}${endpoints.users.decrementCartItemQuantity}`;
            const response = await axios.put(url, item, {
                headers: getAuthHeaders(),
            });
            return response.data;
        } catch (error) {
            console.error('Error decrementing cart item:', error);
            throw error;
        }
    },

    deleteCartItem: async (item: CartActionProps) => {
        try {
            const url = `${base_backend_url}${endpoints.users.deleteCartItem}`;
            const response = await axios.delete(url, {
                headers: getAuthHeaders(),
                data: item,
            });
            return response.data;
        } catch (error) {
            console.error('Error deleting cart item:', error);
            throw error;
        }
    },
};

export default cartCalls;
