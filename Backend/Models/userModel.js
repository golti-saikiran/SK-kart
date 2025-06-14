const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  avatar: {
    type: String,
    default: ""
  },
  mobile: {
    type: Number,
    required: false,
    default: null
  },
  refresh_token: {
    type: String,
    default: ""
  },
  verify_email: {
    type: Boolean,
    default: false
  },
  verify_email_otp:{
    type:String,
    default:""
  },
  verify_email_otp_expiry:{
    type:Date,
    default:""
  },
  last_login_date: {
    type: Date,
    default: ""
  },
  status: {
    type: String,
    enum: ["Active", "Inactive", "Suspended"],
    default: "Active"
  },
  address_details: [{
    type: mongoose.Schema.ObjectId,
    ref: 'Address'
  }],
  shopping_cart: [{
    productId: {
      type: mongoose.Schema.ObjectId,
      ref: 'Product'
    },
    quantity: {
      type: Number,
      default: 1
    }
  }],
  forgot_password_otp: {
    type: String,
    default: ""
  },
  forgot_password_expiry: {
    type: Date,
    default: ""
  },
  allowed_to_update_password: {
    type: Boolean,
    default: false,
  },
  role: {
    type: String,
    enum: ["ADMIN", "USER"],
    default: "USER"
  }
}, {
  timestamps: true
})

const UserModel = mongoose.model('User', userSchema);

module.exports = UserModel


