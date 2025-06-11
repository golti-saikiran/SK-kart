import { base_backend_url, endpoints } from '../utils/EndPoints';
import axios from 'axios';
import getAuthHeaders from './AuthHeaders';

const productCalls = {
    getAllProducts: async () => {
        try {
            const url = `${base_backend_url}${endpoints.products.getAllProducts}`;
            const response = await axios.get(url);
            return response.data;
        } catch (error) {
            console.error('Error fetching products:', error);
            throw error;
        }
    },
    addNewProduct: async (productData: any) => {
        try {
            const url = `${base_backend_url}${endpoints.products.addNewProduct}`;

            const response = await axios.post(url, productData, {
                headers: getAuthHeaders(),
            });
            return response.data;
        } catch (error) {
            console.error('Error adding new product:', error);
            throw error;
        }
    },
    getProductsByCategoryId: async (categoryId: string) => {
        try {
            const url = `${base_backend_url}${endpoints.products.getProductsByCategoryId}/${categoryId}`;
            const response = await axios.get(url);
            return response.data;
        } catch (error) {
            console.error('Error fetching products by category ID:', error);
            throw error;
        }
    },
    getProductById: async (id: string) => {
        try {
            const url = `${base_backend_url}${endpoints.products.getProductByProductId}/${id}`;
            const response = await axios.get(url);
            return response.data;
        } catch (error) {
            console.error('Error fetching product by ID:', error);
            throw error;
        }
    },
    updateProductById: async (id: string, productData: any) => {
        try {
            const url = `${base_backend_url}${endpoints.products.updateProductByProductId}/${id}`;
            const response = await axios.put(url, productData, {
                headers: getAuthHeaders(),
            });
            return response.data;
        } catch (error) {
            console.error('Error updating product by ID:', error);
            throw error;
        }
    },
    deleteProductById: async (id: string) => {
        try {
            const url = `${base_backend_url}${endpoints.products.deleteProductByProductId}/${id}`;
            const response = await axios.delete(url, {
                headers: getAuthHeaders(),
            });
            return response.data;
        } catch (error) {
            console.error('Error deleting product by ID:', error);
            throw error;
        }
    },
    searchProducts: async (query: string) => {
        try {
            const url = `${base_backend_url}${endpoints.products.searchProduct}?q=${encodeURIComponent(query)}`;
            const response = await axios.get(url);
            return response.data.products;
        } catch (error) {
            console.error('Error searching products:', error);
            throw error;
        }
    }
};
export default productCalls;
