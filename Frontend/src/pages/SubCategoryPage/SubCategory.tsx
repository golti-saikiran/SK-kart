import React, { useState } from 'react';
import DashBoardPageLayout from '../../layout/DashBoard/DashBoardPageLayout';
import AddSubCategoryModelContent from './AddSubCategoryModelContent';
import SubCategoryTable from './SubCategoryTable';
import useStore from '../../Store/store';
import subCategoryCalls from '../../API/SubCategoriesCalls';
import { SubCategoryTypes } from '../../utils/Types';
import { toast } from 'react-toastify';
import useInvalidTokenHandler from '../../utils/useInvalidTokenHandler';
import { getErrorMessage } from '../../utils/getErrorMessage';

const SubCategory: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [editSubCategory, setEditSubCategory] = useState<SubCategoryTypes | null>(null);
  const InvalidTokenHandler = useInvalidTokenHandler()


  // Zustand store
  const subCategories = useStore((state) => state.subCategory);
  const updateSubCategoryStore = useStore((state) => state.updateSubCategory);

  const loading = subCategories.length === 0 || subCategories[0]._id === '';

  const handleDelete = async (id: string) => {
    try {
      await subCategoryCalls.deleteSubCategory(id);
      const updated = subCategories.filter((sub) => sub._id !== id);
      updateSubCategoryStore(updated);
    } catch (error) {
      console.error('Delete error:', error);
      InvalidTokenHandler(getErrorMessage(error));
      toast.error('Failed to delete sub-category');
    }
  };

  const handleEdit = (sub: SubCategoryTypes) => {
    setEditSubCategory(sub)
    setIsOpen(true);
  };


  const handleModalClose = () => {
    setIsOpen(false);
    setEditSubCategory(null);
  };

  const button = {
    text: 'Add Sub Category',
    clickEvent: setIsOpen,
  };

  return (
    <DashBoardPageLayout title='Sub Categories' button={button}>
      {loading ? (
        <p>Loading sub categories...</p>
      ) : (
        <SubCategoryTable
          subCategories={subCategories}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      <AddSubCategoryModelContent
        isOpen={isOpen}
        handleModalClose={handleModalClose}
        editSubCategory={editSubCategory}
      />
    </DashBoardPageLayout>
  );
};

export default SubCategory;
