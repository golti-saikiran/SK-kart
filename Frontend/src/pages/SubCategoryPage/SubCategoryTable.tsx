import React, { useState, useMemo } from 'react';
import './SubCategory.css';
import { SubCategoryTypes } from '../../utils/Types';
import { FiEdit } from "react-icons/fi";
import { MdDelete } from "react-icons/md";

interface SubCategoryTableProps {
  subCategories: SubCategoryTypes[];
  onEdit: (sub: SubCategoryTypes) => void;
  onDelete: (id: string) => void;
}

const SubCategoryTable: React.FC<SubCategoryTableProps> = ({ subCategories, onEdit, onDelete }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Extract unique category names for dropdown
  const categoryOptions = useMemo(() => {
    const categories = subCategories
      .map(sub => sub.category?.category_name)
      .filter((name): name is string => !!name);
    return ['All', ...Array.from(new Set(categories))];
  }, [subCategories]);

  // Filter subCategories based on selected category
  const filteredSubCategories = selectedCategory === 'All'
    ? subCategories
    : subCategories.filter(sub => sub.category?.category_name === selectedCategory);

  return (
    <div className="table-container">
      <div className="filter-dropdown">
        <select
          id="category-filter"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          {categoryOptions.map((cat, idx) => (
            <option key={idx} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      <table className="subcategory-table">
        <thead>
          <tr>
            <th>S.No</th>
            <th>Subcategory Name</th>
            <th>Image</th>
            <th>Category Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredSubCategories.map((item, index) => (
            <tr key={item._id}>
              <td>{index + 1}</td>
              <td>{item.subcategory_name}</td>
              <td>
                <img src={item.subcategory_image_url} alt={item.subcategory_name} width='20px' />
              </td>
              <td>{item.category?.category_name}</td>
              <td>
                <button className="edit-btn" onClick={() => onEdit(item)}><FiEdit /></button>
                <button className="delete-btn" onClick={() => onDelete(item._id)}><MdDelete /></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SubCategoryTable;
