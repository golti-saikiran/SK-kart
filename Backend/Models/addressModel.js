const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
    },
    name: {
        type: String,
        default: "",
        required: true,
    },
    address_line: {
        type: String,
        default: "",
        required: true,
    },
    city: {
        type: String,
        default: "",
        required: true,
    },
    state: {
        type: String,
        default: "",
        required: true,
    },
    country: {
        type: String,
        default: "India",
        required: true,
    },
    mobile: {
        type: Number,
        required: true,
    },
    pincode: {
        type: Number,
        required: true,
    },
},
    { timestamps: true }
);
const AddressModel = mongoose.model("Address", addressSchema);
module.exports = AddressModel;