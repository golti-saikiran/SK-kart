import { base_backend_url, endpoints } from '../utils/EndPoints';
import axios from 'axios';
import getAuthHeaders from './AuthHeaders';
import { OrderType } from '../utils/Types';

const ordersCalls = {

    placeOrder: async (orderData: OrderType) => {
        try {
            const url = `${base_backend_url}${endpoints.orders.placeNewOrder}`;
            const response = await axios.post(url, orderData, {
                headers: getAuthHeaders(),
            });
            return response.data;
        } catch (error) {
            console.error('Error creating new order:', error);
            throw error;
        }
    },
    getOrdersByUserId: async (userId:string) => {
        try {
            const url = `${base_backend_url}${endpoints.orders.getOrderByUserId}/${userId}`;
            const response = await axios.get(url, {
                headers: getAuthHeaders(),
            });
            return response;
        } catch (error) {
            console.error('Error creating new order:', error);
            throw error;
        }
    }

};
export default ordersCalls;
