const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
    category_name: {
        type: String,
        required: true,
        default: ""
    },
    category_image_url: {
        type: String,
        default:""
    }
},
    { timestamps: true }
)
const CategoryModel = mongoose.model('Category', CategorySchema)
module.exports = CategoryModel