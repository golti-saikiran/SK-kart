const AddressModel = require('../Models/addressModel');
const UserModel = require('../Models/userModel');

const addressControllers = {
    addNewAddress: async (req, res) => {
        const userId = req.body.userId;
        const newAddress = new AddressModel({
            userId: req.userId,
            ...req.body
        });
        try {
            const saveAddress = await newAddress.save();
            const addUserAddressId = await UserModel.findByIdAndUpdate(userId, {
                $push: {
                    address_details: saveAddress._id
                }
            }, { new: true }
            )

            return res.status(200).json({
                success: true,
                message: 'Address added successfully',
                address: saveAddress,
            });
        } catch (err) {
            return res.status(500).json({
                error: err.message,
                message: 'Error to post the address data, Please try again...',
            });
        }
    },
    getAllAddresses: async (req, res) => {
        try {
            const data = await AddressModel.find({ userId: userId }).sort({ createdAt: -1 })
            return res.status(201).json({
                addressCount: data.length,
                addressesList: data,
            });
        } catch (err) {
            return res.status(500).json({
                error: err.message,
                message: 'Error to fetch the addresses data, Please try again...',
            });
        }
    },
    deleteAddressById: async (req, res) => {
        try {
            const deletedAddress = await AddressModel.findByIdAndDelete(req.params.id);
            if (!deletedAddress) {
                return res.status(404).json({
                    message: 'Address Not Found',
                });
            }
            await UserModel.findByIdAndUpdate(deletedAddress.userId, {
                $pull: {
                    address_details: deletedAddress._id
                }
            })
            return res.status(200).json({
                success: true,
                message: 'Address deleted successfully',
            });
        } catch (err) {
            return res.status(500).json({
                error: err.message,
                message: 'Error to delete the address data, Please try again...',
            });
        }
    },
    updateAddressById: async (req, res) => {
        try {
            const updatedAddress = await AddressModel.findByIdAndUpdate(
                req.params.id,
                req.body,
                { new: true }
            );
            if (!updatedAddress) {
                return res.status(404).json({
                    message: 'Address Not Found',
                });
            }
            return res.status(200).json({
                success: true,
                message: 'Address updated successfully',
                updatedAddress,
            });
        } catch (err) {
            return res.status(500).json({
                error: err.message,
                message: 'Error to update the address data, Please try again...',
            });
        }
    }
};
module.exports = addressControllers;
