const CategoryModel = require('../Models/categoryModel');
const { deleteImageCloudinaryByUrl } = require('../Utils/UploadImageCloudinary');

const categoryControllers = {
    getAllCategories: async (req, res) => {
        try {
            const allAvailableCategories = await CategoryModel.find()
            if (!allAvailableCategories) {
                return res.status(201).json({
                    message: "No categories available to fetch"
                })
            }
            return res.status(200).json({
                message: "success",
                categoryDetails: allAvailableCategories
            })
        }
        catch (err) {
            return res.status(500).json({
                error: err.message,
                message: "Error to fetch the category details, please try again..."
            })
        }
    },
    addNewCategory: async (req, res) => {
        try {            
            const newCategory = new CategoryModel({
                ...req.body,
            })
            
            await newCategory.save()
            return res.status(200).json({
                success: true,
                category_status: req.body
            })
        }
        catch (err) {
            return res.status(500).json({
                error: err.message,
                message: "Error to add the category details, please try again..."
            })
        }
    },
    deleteCategoryByCategoryId: async (req, res) => {
        try {
            const deletedCategory = await CategoryModel.findByIdAndDelete(req.params.id)
            if (!deletedCategory) {
                return res.status(404).json({
                    message: 'Category Not Found'
                })
            }
            deleteImageCloudinaryByUrl(deletedCategory.category_image_url)
            return res.status(201).json({
                "Category deleted status": "success",
                "deleted category": deletedCategory
            })
        }
        catch (err) {
            return res.status(500).json({
                error: err.message,
                message: "Error to delete the category details, please try again..."
            })
        }
    },
    updateCategoryByCategoryId: async (req, res) => {
        try {
            const updatedCategory = await CategoryModel.findByIdAndUpdate(
                req.params.id,
                {
                    ...req.body
                },
                { new: true }
            )
            if (!updatedCategory) {
                return res.status(404).json({
                    message: 'Category Not Found'
                })
            }
            return res.status(201).json({
                "Category updated status": "success",
                "updated category": updatedCategory
            })
        }
        catch (err) {
            return res.status(500).json({
                error: err.message,
                message: "Error to update the category details, please try again..."
            })
        }
    }

}

module.exports = categoryControllers
