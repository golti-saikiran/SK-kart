import { base_backend_url, endpoints } from '../utils/EndPoints';
import axios from 'axios';
import getAuthHeaders from './AuthHeaders';
import { toast } from 'react-toastify';

type addCategoryProps = {
    name: string;
    image: string
}

const categoryCalls = {
    addCategory: async (props: addCategoryProps) => {
        try {
            const url = `${base_backend_url}${endpoints.category.addCategory}`
            const formData = {
                'category_name': props.name,
                'category_image_url': props.image
            }
            const response = await axios.post(url, formData, {
                headers: getAuthHeaders(),
            });
            toast.success('success')
            return response.data;
        } catch (error) {
            console.error('Error adding category:', error);
            throw error;
        }
    },
    FetchCategories: async () => {
        try {
            const url = `${base_backend_url}${endpoints.category.getAllCategories}`
            const response = await axios.get(url)
            return response.data.categoryDetails
        } catch (error) {
            console.error('Error getting categories:', error);
            throw error;
        }
    },
    updateCategory: async (props: addCategoryProps, id: string) => {
        try {
            const url = `${base_backend_url}${endpoints.category.updateCategoryById}/${id}`
            const formData = {
                'category_name': props.name,
                'category_image_url': props.image
            }
            const response = await axios.put(url, formData, {
                headers: getAuthHeaders(),
            });
            toast.success('success')
            return response.data;
        } catch (error) {
            console.error('Error updating category:', error);
            throw error;
        }
    },
    deleteCategory: async (id: string) => {
        try {
            const url = `${base_backend_url}${endpoints.category.deleteCategoryById}/${id}`
            const response = await axios.delete(url, {
                headers: getAuthHeaders(),
            });
            toast.success('success')
            return response.data;
        } catch (error) {
            console.error('Error deleting category:', error);
            throw error;
        }
    }
}

export default categoryCalls