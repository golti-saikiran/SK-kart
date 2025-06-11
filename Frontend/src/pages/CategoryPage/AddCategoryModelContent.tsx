import { FormEvent, useEffect, useState } from 'react';
import CustomModal from '../../components/CustomModel/CustomModel';
import categoryCalls from '../../API/CategoriesCalls';
import ImageUploaderButton from './ImageUploaderButton';
import { CategoryTypes } from '../../utils/Types';
import useStore from '../../Store/store';
import { getErrorMessage } from '../../utils/getErrorMessage';
import useInvalidTokenHandler from '../../utils/useInvalidTokenHandler';
import { toast } from 'react-toastify';

type ModelContentProps = {
  isOpen: boolean;
  handleModalClose: () => void;
  editCategory?: CategoryTypes | null;
};

const AddCategoryModelContent = ({ isOpen, handleModalClose, editCategory }: ModelContentProps) => {
  const [name, setName] = useState('');
  const [image, setImage] = useState('');

  const categoryStore = useStore((state) => state.category);
  const updateCategoryStore = useStore((state) => state.updateCategory);
  const InvalidTokenHandler = useInvalidTokenHandler()

  useEffect(() => {
    if (editCategory) {
      setName(editCategory.category_name);
      setImage(editCategory.category_image_url);
    } else {
      setName('');
      setImage('');
    }
  }, [editCategory]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name || !image) {
      toast.warn('Please provide both name and image');
      return;
    }

    try {
      if (editCategory) {
        // 🛠 Edit operation
        const result = await categoryCalls.updateCategory({ name, image }, editCategory._id);
        const updated = categoryStore.map((cat) =>
          cat._id === editCategory._id ? result['updated category'] : cat
        );
        updateCategoryStore(updated);
      } else {
        // ➕ Add operation
        const result = await categoryCalls.addCategory({ name, image });
        updateCategoryStore([...categoryStore, result.category_status]); // or appropriate field name
      }

      // Reset & close
      setName('');
      setImage('');
      handleModalClose();
    } catch (err) {
      console.error('Category operation failed:', err);
      InvalidTokenHandler(getErrorMessage(err));
      toast.error('Operation failed');
    }
  };

  return (
    <CustomModal
      isOpen={isOpen}
      onClose={() => handleModalClose()}
      title={editCategory ? 'Edit Category' : 'Add New Category'}
      customStyles={{
        content: {
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        },
      }}
    >
      <form onSubmit={handleSubmit} className="category-form">
        <input
          type="text"
          value={name}
          placeholder="Enter Category Name"
          onChange={(e) => setName(e.target.value)}
          required
        />
        <ImageUploaderButton
          name={name}
          image={image}
          setImage={setImage}
        />
        <button type="submit">{editCategory ? 'Update' : 'Add'} Category</button>
      </form>
    </CustomModal>
  );
};

export default AddCategoryModelContent;
