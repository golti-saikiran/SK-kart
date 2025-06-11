const SubcategoryModel = require('../Models/subcategoryModel');
const { deleteImageCloudinaryByUrl } = require('../Utils/UploadImageCloudinary');

const subCategoryControllers = {
    getAllSubCategories: async (req, res) => {
        try {
            const allAvailableSubCategories = await SubcategoryModel.find()
                .populate("category", "category_name category_image_url")
                .sort({ createdAt: -1 });

            if (!allAvailableSubCategories) {
                return res.status(201).json({
                    message: "No subcategories available to fetch",
                });
            }
            
            return res.status(200).json({
                message: "success",
                subCategoryDetails: allAvailableSubCategories,
            });
        } catch (err) {
            return res.status(500).json({
                error: err.message,
                message:
                    "Error to fetch the subcategory details, please try again...",
            });
        }
    },
    getSubCategoryByCategoryId: async (req, res) => {
        try {
            const subCategoryByCategoryId = await SubcategoryModel.find({
                category: req.params.id,
            })
                .populate("category", "category_name category_image_url")
                .sort({ createdAt: -1 });
            if (!subCategoryByCategoryId) {
                return res.status(201).json({
                    message: "No subcategories available to fetch",
                });
            }
            return res.status(200).json({
                message: "success",
                subCategoryDetails: subCategoryByCategoryId,
            });
        } catch (err) {
            return res.status(500).json({
                error: err.message,
                message:
                    "Error to fetch the subcategory details, please try again...",
            });
        }
    },
    addNewSubCategory: async (req, res) => {
        try {
            const newSubCategory = new SubcategoryModel({
                ...req.body,
            });
            await newSubCategory.save();

            // Populate category before returning
            const populatedSubCategory = await newSubCategory.populate('category');

            return res.status(200).json({
                success: true,
                subCategory_status: populatedSubCategory,
            });
        } catch (err) {
            return res.status(500).json({
                error: err.message,
                message: "Error to add the subcategory details, please try again...",
            });
        }
    },
    deleteSubCategoryBySubCategoryId: async (req, res) => {
        try {
            const deletedSubCategory = await SubcategoryModel.findByIdAndDelete(
                req.params.id
            );
            if (!deletedSubCategory) {
                return res.status(404).json({
                    message: "Subcategory Not Found",
                });
            }
            deleteImageCloudinaryByUrl(deletedSubCategory.subcategory_image_url);
            return res.status(201).json({
                "Subcategory deleted status": "success",
                "deleted subcategory": deletedSubCategory,
            });
        } catch (err) {
            return res.status(500).json({
                error: err.message,
                message:
                    "Error to delete the subcategory details, please try again...",
            });
        }
    },
    updateSubCategoryBySubCategoryId: async (req, res) => {
        try {
            const updatedSubCategory = await SubcategoryModel.findByIdAndUpdate(
                req.params.id,
                { ...req.body },
                { new: true }
            ).populate('category'); // 👈 This is the fix

            if (!updatedSubCategory) {
                return res.status(404).json({
                    message: "Subcategory Not Found",
                });
            }

            return res.status(201).json({
                "Subcategory updated status": "success",
                "updated_subcategory": updatedSubCategory,
            });
        } catch (err) {
            return res.status(500).json({
                error: err.message,
                message: "Error to update the subcategory details, please try again...",
            });
        }
    }

}

module.exports = subCategoryControllers;