import React from 'react'
import { uploadImage } from '../../utils/uploadImage';
import './Category.css'
import useInvalidTokenHandler from '../../utils/useInvalidTokenHandler';
import { getErrorMessage } from '../../utils/getErrorMessage';
import { toast } from 'react-toastify';

type ImageUploderButtonProps = {
    name: string;
    image: string;
    setImage: React.Dispatch<React.SetStateAction<string>>

}

const ImageUploaderButton = (props: ImageUploderButtonProps) => {
    const { name, image, setImage } = props
    const InvalidTokenHandler = useInvalidTokenHandler()
    const handleUploadCategoryImage = async (e: React.ChangeEvent<HTMLInputElement>) => {

        const file = e.target.files?.[0];
        if (!file) {
            return;
        }
        try {
            const response = await uploadImage(file)
            const { data: ImageResponse } = response

            setImage(ImageResponse.url)
        }
        catch (err) {
            InvalidTokenHandler(getErrorMessage(err));
            toast.error("error uploading image")
        }

    }
    return (
        <div className="image-container">
            <p style={{ margin: '5px 0px' }}>Image</p>
            <div className='image-preview'>
                {
                    image ? <img src={image} alt='image preview' className='image-space' width={200} /> :
                        <p className='image-space'>No Image</p>
                }
                <label htmlFor='uploadCategoryImage'>
                    <span className='upload-image-button'>Upload Image</span>

                    <input disabled={!name} onChange={(e) => handleUploadCategoryImage(e)} type='file' id='uploadCategoryImage' className='image-uploader-input' />
                </label>
            </div>
        </div>
    )
}

export default ImageUploaderButton
