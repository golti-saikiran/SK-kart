import { SubCategoryTypes } from '../../utils/Types'
import './SubCategoryCard.css'

type SubCategoryCardProps = {
    subCategory: SubCategoryTypes
    selectedSubCat: string | null
    setSelectedSubCat: React.Dispatch<React.SetStateAction<string | null>>
}

const SubCategoryCard: React.FC<SubCategoryCardProps> = ({ subCategory, selectedSubCat, setSelectedSubCat }) => {
    return (
        <div
            key={subCategory._id}
            className={`subcat-container ${selectedSubCat === subCategory._id ? "active" : ""}`}
            onClick={() => setSelectedSubCat(subCategory._id)}
        >
            <img
                src={subCategory.subcategory_image_url}
                alt={subCategory.subcategory_name}
                className="subcategory-image"
                width={50}
            />
            <p>{subCategory.subcategory_name}</p>
        </div>
    )
}

export default SubCategoryCard
