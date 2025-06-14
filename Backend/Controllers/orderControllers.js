const OrderModel = require('../Models/orderModel')
orderController = {
    getAllOrders: async (req, res) => {
        try {
            const allAvailbleOrders = await OrderModel.find()
            if (!allAvailbleOrders) {
                return res.status(201).json({
                    message: "No orders available to fetch"
                })
            }
            return res.status(200).json({
                message: "success",
                orderDetails: allAvailbleOrders
            })
        }
        catch (err) {
            return res.status(500).json({
                error: err.message,
                message: "Error to fetch the order details, please try again..."
            })
        }
    },
    getOrderByUserId: async (req, res) => {
        const userId = req.params.userId;

        try {
            const orderByUserId = await OrderModel.find({ userId })
                .populate({
                    path: 'items_ordered.product',
                    model: 'Product', // Make sure this matches the model name used in `mongoose.model('Product', ...)`
                    select: 'productname price product_image_url category discount', // Include only fields you need
                }).populate('address', 'name address_line city pincode mobile state')

            if (!orderByUserId || orderByUserId.length === 0) {
                return res.status(404).json({
                    message: 'No Orders found with the searched query',
                    success: false,
                });
            }

            return res.status(200).json({
                success: true,
                message: 'Orders fetched successfully',
                orders: orderByUserId,
            });
        } catch (err) {
            return res.status(500).json({
                error: err.message,
                message: 'Error to search the orders, Please try again...',
                success: false,
            });
        }
    },

    placeNewOrder: async (req, res) => {
        try {
            const newOrder = new OrderModel({
                ...req.body
            })
            const neworder = await newOrder.save()
            return res.status(200).json({
                success: true,
                order: neworder,
                error: false
            })
        }
        catch (err) {
            return res.status(500).json({
                error: err.message,
                message: "Error to place the order details, please try again..."
            })
        }
    },
    deleteOrderById: async (req, res) => {
        try {
            const deletedOrder = await OrderModel.findByIdAndDelete(req.params.id)
            if (!deletedOrder) {
                return res.status(404).json({
                    message: 'Order Not Found'
                })
            }
            return res.status(201).json({
                "Order deleted status": "success",
                "deleted order": deletedOrder
            })
        }
        catch (err) {
            return res.status(500).json({
                error: err.message,
                message: "Error to delete the order details, please try again..."
            })
        }
    },
    updateOrderById: async (req, res) => {
        try {
            const updatedOrder = await OrderModel.findByIdAndUpdate(req.params.id, req.body, { new: true })
            if (!updatedOrder) {
                return res.status(404).json({
                    message: 'Order Not Found'
                })
            }
            return res.status(201).json({
                "order updated status": "success",
                "updated order": updatedOrder
            })
        }
        catch (err) {
            return res.status(500).json({
                error: err.message,
                message: "Error to update the order details, please try again..."
            })
        }
    },
    searchOrder: async (req, res) => {
        try {
            const searchedOrders = await OrderModel.find(req.query)
            if (!searchedOrders) {
                return res.status(404).json({
                    message: 'No Orders found with the searched query'
                })
            }
            return res.status(201).json({
                "order search status": "success",
                "available orders": searchedOrders
            })
        } catch (err) {
            return res.status(500).json({
                error: err.message,
                message: 'Error to search the orders, Please try again...'
            })
        }
    }

}

module.exports = orderController