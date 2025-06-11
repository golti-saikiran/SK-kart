import axios from 'axios';
import { base_backend_url, endpoints } from './EndPoints';
import getAuthHeaders from '../API/AuthHeaders';

import { toast } from 'react-toastify';

export const uploadImage = async (imageFile: File): Promise<any> => {

    try {
        const formData = new FormData();
        formData.append('image', imageFile);
        const url = `${base_backend_url}${endpoints.upload.uploadImage}`
        const response = await axios.post(url, formData, {
            headers: getAuthHeaders()
        });
        toast.success("Image uploaded successfully")
        return response.data;
    } catch (error) {
        console.error('Error uploading image:', error);
        throw error;
    }
};