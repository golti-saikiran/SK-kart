import { base_backend_url, endpoints } from '../utils/EndPoints';
import axios from 'axios';
import getAuthHeaders from './AuthHeaders';
import { toast } from 'react-toastify';

type addSubCategoryProps = {
    name: string;
    image: string;
    category: string;
}

const SubCategoryCalls = {
    addSubCategory: async (props: addSubCategoryProps) => {
        try {
            const url = `${base_backend_url}${endpoints.subCategory.addSubCategory}`
            const formData = {
                'subcategory_name': props.name,
                'subcategory_image_url': props.image,
                'category': props.category

            }
            const response = await axios.post(url, formData, {
                headers: getAuthHeaders(),
            });
            toast.success('success')
            return response.data;
        } catch (error) {
            console.error('Error adding sub category:', error);
            throw error;
        }
    },
    FetchSubCategories: async () => {
        try {
            const url = `${base_backend_url}${endpoints.subCategory.getAllSubCategories}`
            const response = await axios.get(url)
            return response.data.subCategoryDetails
        } catch (error) {
            console.error('Error getting sub categories:', error);
            throw error;
        }
    },
    deleteSubCategory: async (id: string) => {
        try {
            const url = `${base_backend_url}${endpoints.subCategory.deleteSubCategoryById}/${id}`;
            const response = await axios.delete(url, {
                headers: getAuthHeaders()
            });
            toast.success('success')
            return response.data;
        } catch (error) {
            console.error('Error deleting sub category:', error);
            throw error;
        }
    },
    updateSubCategory: async (props: addSubCategoryProps, id: string) => {
        try {
            const url = `${base_backend_url}${endpoints.subCategory.updateSubCategoryById}/${id}`;
            const formData = {
                'subcategory_name': props.name,
                'subcategory_image_url': props.image,
                'category': props.category
            }
            const response = await axios.put(url, formData, {
                headers: getAuthHeaders()
            });
            toast.success('update subcategory success')
            return response.data;
        } catch (error) {
            console.error('Error updating sub category:', error);
            throw error;
        }
    }
}

export default SubCategoryCalls