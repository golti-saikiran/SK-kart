import React, { useState, useEffect } from 'react';
import DashBoardPageLayout from '../../layout/DashBoard/DashBoardPageLayout';
import './Category.css';
import AddCategoryModelContent from './AddCategoryModelContent';
import useStore from '../../Store/store';
import CategoryCard from './Categorycard';
import categoryCalls from '../../API/CategoriesCalls';
import { CategoryTypes } from '../../utils/Types';
import { toast } from 'react-toastify';
import { getErrorMessage } from '../../utils/getErrorMessage';
import useInvalidTokenHandler from '../../utils/useInvalidTokenHandler';


const Category: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [editCategory, setEditCategory] = useState<CategoryTypes | null>(null);
  const InvalidTokenHandler = useInvalidTokenHandler()

  // Use Zustand store
  const category = useStore((state) => state.category);
  const updateCategoryStore = useStore((state) => state.updateCategory);

  // Optional loading indicator — only while store is still empty
  const loading = category.length === 0 || category[0]._id === '';

  const handleDelete = async (id: string) => {
    try {
      await categoryCalls.deleteCategory(id);
      const updated = category.filter((cat) => cat._id !== id);
      updateCategoryStore(updated);
    } catch (error) {
      console.error('Delete error:', error);
      InvalidTokenHandler(getErrorMessage(error));
      toast.error('Failed to delete category');
    }
  };

  const handleEdit = (cat: CategoryTypes) => {
    setEditCategory(cat);
    setIsOpen(true);
  };

  const handleModalClose = () => {
    setIsOpen(false);
    setEditCategory(null);
  };

  const addButton = {
    text: 'Add category',
    clickEvent: setIsOpen
  };

  return (
    <DashBoardPageLayout
      title='Categories'
      button={addButton}
    >
      {loading ? (
        <p>Loading categories...</p>
      ) : (
        <div className="category-grid">
          {category.map((cat) => (
            <CategoryCard
              key={cat._id}
              category={{
                id: cat._id,
                name: cat.category_name,
                imageUrl: cat.category_image_url
              }}
              onEdit={() => handleEdit(cat)}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      <AddCategoryModelContent
        isOpen={isOpen}
        handleModalClose={handleModalClose}
        editCategory={editCategory} // pass category for editing
      />
    </DashBoardPageLayout>
  );
};

export default Category;
