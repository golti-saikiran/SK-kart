const mongoose = require('mongoose')

const OrderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    total_amount: {
        type: Number,
        required: true
    },
    items_ordered: [
        {
            product: {
                type: mongoose.Schema.ObjectId,
                ref: 'Product',
                required: true
            },
            quantity: {
                type: Number,
                required: true,
                default: 1
            }
        }
    ],
    payment_mode: {
        type: String,
        enum: ['COD', 'UPI', 'CARD'],
        required: true
    },
    address: {
        type: mongoose.Schema.ObjectId,
        ref: 'Address',
        required: true
    },
    status: {
        type: String,
        enum: ['Ordered', 'Shipped', 'Delivered', 'Cancelled', 'Pending_payment'],
        default: 'Ordered',
        required: true
    },
    ordered_date: {
        type: String,
        required: true,
    },
    deliver_date: {
        type: String,
    }

},
    { timestamps: true }
)

const OrderModel = mongoose.model('Order', OrderSchema)

module.exports = OrderModel