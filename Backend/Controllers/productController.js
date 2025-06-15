const ProductModel = require('../Models/productModel')
const { deleteImageCloudinaryByUrl } = require('../Utils/UploadImageCloudinary');

productContollers = {

    getAllProducts: async (req, res) => {
        try {
            const allProducts = await ProductModel.find()
                .populate("category", "category_name category_image_url")
                .populate("sub_category", "subcategory_name subcategory_image_url")
                .sort({ createdAt: -1 });

            return res.status(201).json({
                productCount: allProducts.length,
                productsList: allProducts
            })
        } catch (err) {
            return res.status(500).json({
                error: err.message,
                message: 'Error to fetch the products data, Please try again...'
            })
        }
    },
    addNewProduct: async (req, res) => {
        const newProduct = new ProductModel({
            ...req.body,

        })
        try {
            await newProduct.save()
            return res.status(200).json({
                success: true,
                added_Product: req.body

            })
        } catch (err) {
            return res.status(500).json({
                error: err.message,
                message: 'Error to post the product data, Please try again...'
            })
        }
    },
    getProductByProductId: async (req, res) => {
        try {
            const requiredProduct = await ProductModel.findById(req.params.id)
            if (!requiredProduct) {
                return res.status(404).json({
                    message: 'Product Not Found'
                })
            }
            return res.status(201).json({
                data: requiredProduct,
                success: true,
                error: false
            })
        } catch (err) {
            return res.status(500).json({
                error: err.message,
                message: 'Error to fetch the products data, Please try again...'
            })
        }
    },
    getproductsByCategoryId: async (req, res) => {
        try {
            const productsByCategoryId = await ProductModel.find({
                category: req.params.id,
            }).populate("category", "category_name category_image_url")
                .populate("sub_category", "subcategory_name subcategory_image_url")
                .sort({ createdAt: -1 });
            if (!productsByCategoryId) {
                return res.status(201).json({
                    message: "No products available to fetch",
                });
            }
            return res.status(200).json({
                message: "success",
                productsDetails: productsByCategoryId,
            });
        } catch (err) {
            return res.status(500).json({
                error: err.message,
                message:
                    "Error to fetch the product details, please try again...",
            });
        }
    },
    deleteProductByProductId: async (req, res) => {
        try {
            const deletedProduct = await ProductModel.findByIdAndDelete(req.params.id)
            if (!deletedProduct) {
                return res.status(404).json({
                    message: 'Product Not Found'
                })
            }
            deleteImageCloudinaryByUrl(deletedProduct.product_image_url);
            return res.status(201).json({
                "product deleted status": "success",
                "deleted product": deletedProduct
            })
        } catch (err) {
            return res.status(500).json({
                error: err.message,
                message: 'Error to delete the product, Please try again...'
            })
        }
    },
    updateProductByProductId: async (req, res) => {
        try {
            const updatedproduct = await ProductModel.findByIdAndUpdate(req.params.id, req.body, { new: true })
            if (!updatedproduct) {
                return res.status(404).json({
                    message: 'Product Not Found'
                })
            }
            return res.status(201).json({
                "product updated status": "success",
                "updated product": updatedproduct
            })
        } catch (err) {
            return res.status(500).json({
                error: err.message,
                message: 'Error to update the product, Please try again...'
            })
        }
    },
    searchProduct: async (req, res) => {
        try {
            const { q } = req.query;

            if (!q) {
                return res.status(400).json({ message: "Search query missing" });
            }

            const searchedProduct = await ProductModel.find({
                productname: { $regex: q, $options: "i" }, // case-insensitive partial match
            });

            return res.status(200).json({
                products: searchedProduct, // ✅ change to 'products' to match frontend
            });
        } catch (err) {
            return res.status(500).json({
                error: err.message,
                message: "Error searching the product. Please try again...",
            });
        }
    }

}

module.exports = productContollers