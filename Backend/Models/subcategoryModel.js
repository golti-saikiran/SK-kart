const mongoose = require("mongoose");

const subcategorySchema = new mongoose.Schema({
    subcategory_name: {
        type: String,
        required: true,
        default: "",
    },
    subcategory_image_url: {
        type: String,
        default: "",
    },
    category: {
        type: mongoose.Schema.ObjectId,
        ref: 'Category',
        required: true,
    },
},
    { timestamps: true }
);

const SubcategoryModel = mongoose.model("Subcategory", subcategorySchema);
module.exports = SubcategoryModel;