import { Link } from 'react-router'
import { CategoryTypes } from '../../utils/Types'
import './CategoryCard.css'

const CategoryCard = (category:CategoryTypes) => {
    return (
        <Link to={`/category/${category._id}`} key={category._id} className="category-card">
            <img
                src={category.category_image_url || "https://via.placeholder.com/100"}
                alt={category.category_name}
                className="category-image"
            />
        </Link>
    )
}

export default CategoryCard
