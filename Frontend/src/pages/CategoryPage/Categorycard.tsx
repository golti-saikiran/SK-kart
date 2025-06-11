import React from 'react';
import { MdEdit, MdDelete } from 'react-icons/md';


export interface Category {
  id: string;
  name: string;
  imageUrl: string;
}

interface CategoryCardProps {
  category: Category;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category, onEdit, onDelete }) => {
  return (
    <div className="category-card">
      <img src={category.imageUrl} alt={category.name} className="category-image" />
      <div className="category-actions">
        <button className="edit-btn" onClick={() => onEdit(category.id)} title="Edit">
          <MdEdit /> Edit
        </button>
        <button className="delete-btn" onClick={() => onDelete(category.id)} title="Delete">
          <MdDelete /> Delete
        </button>
      </div>
    </div>
  );
};

export default CategoryCard;
