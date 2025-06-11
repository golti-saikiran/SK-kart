const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  productname: {
    type: String,
    required: true
  },
  product_image_url: {
    type: String,
    default: ""
  },
  quantity_available: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  discount: {
    type: Number,
  },
  description: {
    type: String,
    required: true,
    default: ""
  },
  category: {
    type: mongoose.Schema.ObjectId,
    ref: 'Category',
    required: true,
  },
  sub_category: {
    type: mongoose.Schema.ObjectId,
    ref: 'Subcategory',
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    default: 5,
    min: 0,
    max: 5
  }
},
  { timestamps: true }
)

const ProductModel = mongoose.model('Product', ProductSchema)

module.exports = ProductModel


