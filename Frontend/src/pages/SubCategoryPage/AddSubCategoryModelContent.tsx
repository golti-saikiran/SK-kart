import { FormEvent, useEffect, useState } from 'react';
import CustomModal from '../../components/CustomModel/CustomModel';
import ImageUploaderButton from '../CategoryPage/ImageUploaderButton';
import '../CategoryPage/Category.css';
import SubCategoryCalls from '../../API/SubCategoriesCalls';
import categoryCalls from '../../API/CategoriesCalls';
import { CategoryTypes, SubCategoryTypes } from '../../utils/Types';
import useStore from '../../Store/store';
import { toast } from 'react-toastify';
import { getErrorMessage } from '../../utils/getErrorMessage';
import useInvalidTokenHandler from '../../utils/useInvalidTokenHandler';

type ModelContentProps = {
  isOpen: boolean;
  handleModalClose: () => void;
  editSubCategory?: SubCategoryTypes | null;
};

const AddSubCategoryModelContent = ({
  isOpen,
  handleModalClose,
  editSubCategory
}: ModelContentProps) => {
  const [availableCategories, setAvailableCategories] = useState<CategoryTypes[]>([]);
  const [name, setName] = useState('');
  const [image, setImage] = useState('');
  const [category, setCategory] = useState('');

  const subCategoryStore = useStore((state) => state.subCategory);
  const updateSubCategoryStore = useStore((state) => state.updateSubCategory);
  const InvalidTokenHandler = useInvalidTokenHandler()

  // Load categories for dropdown
  useEffect(() => {
    const loadCategories = async () => {
      const data = await categoryCalls.FetchCategories();
      setAvailableCategories(data);
    };
    loadCategories();
  }, []);

  // Populate fields on edit
  useEffect(() => {
    if (editSubCategory) {
      setName(editSubCategory.subcategory_name);
      setImage(editSubCategory.subcategory_image_url);
      setCategory(
        typeof editSubCategory.category === 'string'
          ? editSubCategory.category
          : editSubCategory.category._id
      );
    } else {
      setName('');
      setImage('');
      setCategory('');
    }
  }, [editSubCategory]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!name || !image || !category) {
      toast.warn('Please provide name, image, and category');
      return;
    }

    try {
      if (editSubCategory) {
        // ✏️ Update operation
        const result = await SubCategoryCalls.updateSubCategory(
          { name, image, category },
          editSubCategory._id
        );
        console.log('Update result:', result);

        const updated = subCategoryStore.map((sub) =>
          sub._id === editSubCategory._id ? result['updated_subcategory'] : sub
        );
        console.log('Updated subcategories:', updated);

        updateSubCategoryStore(updated);
      } else {
        // ➕ Add operation
        const result = await SubCategoryCalls.addSubCategory({ name, image, category });
        updateSubCategoryStore([...subCategoryStore, result.subCategory_status]);
      }

      // Reset form
      setName('');
      setImage('');
      setCategory('');
      handleModalClose();
    } catch (err) {
      console.error('Subcategory operation failed:', err);
      InvalidTokenHandler(getErrorMessage(err));
      toast.error('Subcategory operation failed');
    }
  };

  return (
    <CustomModal
      isOpen={isOpen}
      onClose={handleModalClose}
      title={editSubCategory ? 'Edit Sub Category' : 'Add New Sub Category'}
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
          placeholder="Enter Subcategory Name"
          onChange={(e) => setName(e.target.value)}
          required
        />
        <label htmlFor="category-select">Select Category:</label>
        <select
          id="category-select"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        >
          <option value="" disabled>
            -- Select --
          </option>
          {availableCategories.map((cat: CategoryTypes) => (
            <option key={cat._id} value={cat._id}>
              {cat.category_name}
            </option>
          ))}
        </select>
        <ImageUploaderButton
          name={name}
          image={image}
          setImage={setImage}
        />
        <button type="submit" disabled={!image}>{editSubCategory ? 'Update' : 'Add'} Sub Category</button>
      </form>
    </CustomModal>
  );
};

export default AddSubCategoryModelContent;
