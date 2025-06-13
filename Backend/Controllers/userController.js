const UserModel = require('../Models/userModel')
const ProductModel = require('../Models/productModel')
const bcrypt = require('bcryptjs')
const generateToken = require('../Config/Jwt_controllers.js')
const sendmail = require('../Utils/SendMail')
const verifyEmailTemplete = require('../Utils/VerifyEmailTemplete')
const generateOtp = require('../Utils/GenerateOtp')
const ResetPasswordTemplate = require('../Utils/ResetPasswordTemplate')
const { uploadImageClodinary } = require("../Utils/UploadImageCloudinary.js")

userContollers = {
    registerUserController: async (req, res) => {
        try {
            const { name, email, password } = req.body
            console.log(name, email, password);

            if (!name || !email || !password) {
                return res.status(400).json({
                    message: "Must required name, email, and password",
                    error: true,
                    success: false,
                })
            }
            const existingUser = await UserModel.findOne({ email })
            if (existingUser) {
                return res.status(400).json({
                    message: "Email already exist with different account",
                    error: true,
                    success: false,
                })
            }
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            const newUser = new UserModel({
                name,
                password: hashedPassword,
                email
            })
            const newlyaddeduser = await newUser.save()
            const VerifyEmailUrl = `${process.env.FRONTEND_URL}/verify-email?code=${newlyaddeduser?._id}`
            const otpSendResponse = await sendmail({
                sendTo: email,
                Subject: "User verification Email",
                Text: `Hi ${name},`,
                Html: verifyEmailTemplete(VerifyEmailUrl)
            })
            if (!otpSendResponse.success) {
                return res.status(400).json({
                    message: otpSendResponse.message,
                    error: true,
                    success: false
                });
            }
            return res.status(200).json({
                message: "A verification email sent to your email",
                success: true,
                error: false,
                data: {
                    newlyaddeduser,
                    otpSendResponse

                }
            })
        } catch (err) {
            return res.status(500).json({
                message: err.message || 'Error to register the user, Please try again...',
                error: true,
                success: false,
                errorData: err
            })
        }
    },
    verifyUserController: async (req, res) => {
        try {
            const { code } = req.body
            const user = await UserModel.findOne({ _id: code })
            if (!user) {
                return res.status(400).json({
                    message: "Invalid code",
                    error: true,
                    success: false,
                })
            }
            const updatedUser = await UserModel.updateOne({ _id: code }, {
                verify_email: true
            })
            return res.status(200).json({
                message: "Email verification done",
                success: true,
                error: false,
                updatedUser
            })
        }
        catch (err) {
            return res.status(500).json({
                message: 'Error to verify the user, Please try again...',
                error: true,
                success: false,
                errorData: err
            })
        }
    },
    loginUserController: async (req, res) => {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                return res.status(400).json({
                    message: "Must required email, and password",
                    error: true,
                    success: false,
                })
            }
            const requestedUser = await UserModel.findOne({ email })
            if (!requestedUser) return res.status(400).json({
                message: "User not found",
                error: true,
                success: false
            });

            const isMatch = await bcrypt.compare(password, requestedUser.password);
            if (!isMatch) return res.status(400).json({
                message: "Invalid password",
                error: true,
                success: false
            });

            const token = generateToken(requestedUser)

            const updatedUser = await UserModel.findByIdAndUpdate(requestedUser?._id, {
                last_login_date: new Date(),
                refresh_token: token

            })
                .populate("address_details", "_id name address_line city state country mobile pincode")
                .populate('shopping_cart.productId')

            return res.json({
                message: "Login successful",
                error: true,
                success: false,
                token,
                user: {
                    _id: updatedUser._id,
                    name: updatedUser.name,
                    email: updatedUser.email,
                    mobile: updatedUser.mobile,
                    avatar: updatedUser.avatar,
                    last_login_date: updatedUser.last_login_date,
                    status: updatedUser.status,
                    address_details: updatedUser.address_details,
                    shopping_cart: updatedUser.shopping_cart,
                    verify_email: updatedUser.verify_email,
                    role: updatedUser.role
                }
            });
        } catch (err) {
            return res.status(500).json({
                message: "Error verifying password, please try again...",
                error: true,
                success: false,
                errordata: err
            });
        }
    },
    forgotPasswordController: async (req, res) => {
        try {
            const { email } = req.body
            if (!email) {
                return res.status(400).json({
                    message: "Must required email",
                    error: true,
                    success: false,
                })
            }
            const requestedUser = await UserModel.findOne({ email });
            if (!requestedUser) {
                return res.status(400).json({
                    message: "User not found",
                    error: true,
                    success: false
                });
            }

            const otp = generateOtp()
            const expiry = new Date(new Date().getTime() + 5 * 60 * 1000).toISOString();
            await UserModel.findByIdAndUpdate(requestedUser._id, {
                forgot_password_otp: otp,
                forgot_password_expiry: new Date(expiry)
            })

            const otpSendResponse = await sendmail({
                sendTo: email,
                Subject: "Password reset Email - SK kart",
                Html: ResetPasswordTemplate({ name: requestedUser.name, otp })
            })
            if (otpSendResponse.success === false) {
                return res.status(400).json({
                    message: otpSendResponse.message,
                    error: true,
                    success: false
                });
            }
            return res.status(200).json({
                message: `Password reset otp mail is sent to ${email}`,
                OTP_expiry: expiry,
                success: true,
                error: false
            })

        } catch (err) {
            return res.status(500).json({
                message: "Error resetting password, please try again...",
                error: true,
                success: false,
                errordata: err
            });
        }
    },
    verifyForgotPasswordOtpController: async (req, res) => {
        try {
            const { email, otp } = req.body;
            if (!email || !otp) {
                return res.status(400).json({
                    message: "Must required email and otp",
                    error: true,
                    success: false,
                })
            }
            const requestedUser = await UserModel.findOne({ email });
            if (!requestedUser) {
                return res.status(400).json({
                    message: "User not found",
                    error: true,
                    success: false
                });
            }
            if (otp !== requestedUser.forgot_password_otp) {
                return res.status(400).json({
                    message: "Invalid Otp",
                    error: true,
                    success: false
                });
            }
            const currentTime = new Date()
            const expiryTime = new Date(requestedUser.forgot_password_expiry)
            if (!expiryTime || (expiryTime < currentTime)) {
                return res.status(400).json({
                    message: "Otp Expired, generate new one",
                    error: true,
                    success: false
                });
            }
            await UserModel.findByIdAndUpdate(requestedUser._id, {
                forgot_password_otp: "",
                forgot_password_expiry: "",
                allowed_to_update_password: true
            })
            return res.status(200).json({
                message: "Otp verification successful, please setup the new password",
                success: true,
                error: false
            })
        } catch (err) {
            return res.status(500).json({
                message: "Error resetting password, please try again...",
                error: true,
                success: false,
                errordata: err
            });
        }
    },
    resend_otp: async (req, res) => {
        try {
            const { email } = req.body
            const otp = generateOtp()
            const expiry = new Date(new Date().getTime() + 5 * 60 * 1000).toISOString();
            await UserModel.findByIdAndUpdate(requestedUser._id, {
                forgot_password_otp: otp,
                forgot_password_expiry: new Date(expiry)
            })

            const verifyOtp = await sendmail({
                sendTo: email,
                Subject: "Password reset Email - SK kart",
                Html: ResetPasswordTemplate({ name: requestedUser.name, otp })
            })
            return res.status(200).json({
                message: `Password reset otp mail is resend again to ${email}`,
                OTP_expiry: expiry,
                success: true,
                error: false
            })

        } catch (err) {
            return res.status(500).json({
                message: "Error resetting password, please try again...",
                error: true,
                success: false,
                errordata: err
            });
        }
    },
    resetPasswordController: async (req, res) => {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                return res.status(400).json({
                    message: "Must required email and password",
                    error: true,
                    success: false,
                })
            }
            const requestedUser = await UserModel.findOne({ email });
            if (!requestedUser) {
                return res.status(400).json({
                    message: "User not found",
                    error: true,
                    success: false
                });
            }
            if (!requestedUser.allowed_to_update_password) {
                return res.status(400).json({
                    message: "Before verification, Not allowed to update password.",
                    error: true,
                    success: false
                });
            } else {
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(password, salt);

                await UserModel.findByIdAndUpdate(requestedUser._id, {
                    allowed_to_update_password: false,
                    password: hashedPassword
                })
            }
            return res.status(200).json({
                message: "Password reset succesfully",
                success: true,
                error: false
            })
        } catch (err) {
            return res.status(500).json({
                message: "Error resetting password, please try again...",
                error: true,
                success: false,
                errordata: err
            });
        }
    },
    getAllUsersController: async (req, res) => {
        try {
            const allUsers = await UserModel.find()
            return res.status(201).json({
                message: "Users data fetched successfully",
                success: true,
                error: false,
                data: {
                    usersCount: allUsers.length,
                    usersList: allUsers
                }
            })
        } catch (err) {
            return res.status(500).json({
                message: 'Error to fetch the users data, Please try again...',
                error: true,
                success: false,
                errorData: err
            })
        }
    },
    getUserByUserIdController: async (req, res) => {
        try {
            const requiredUser = await UserModel.findById(req.params.id)
            if (!requiredUser) {
                return res.status(404).json({
                    message: 'User Not Found'
                })
            }
            return res.status(201).json(requiredUser)
        } catch (err) {
            return res.status(500).json({
                error: err.message,
                message: 'Error to fetch the user data, Please try again...'
            })
        }
    },
    deleteUserByUserIdController: async (req, res) => {
        try {
            const deletedUser = await UserModel.findByIdAndDelete(req.params.id)
            if (!deletedUser) {
                return res.status(404).json({
                    message: 'User Not Found'
                })
            }
            return res.status(201).json({
                "user deleted status": "success",
                "deleted user": deletedUser
            })
        } catch (err) {
            return res.status(500).json({
                error: err.message,
                message: 'Error to delete the user, Please try again...'
            })
        }
    },
    updateUserByUserIdController: async (req, res) => {
        try {
            const updatedUser = await UserModel.findByIdAndUpdate(req.params.id, req.body, { new: true })
            if (!updatedUser) {
                return res.status(404).json({
                    message: 'User Not Found'
                })
            }
            return res.status(201).json({
                "user updated status": "success",
                updatedUser
            })
        } catch (err) {
            return res.status(500).json({
                error: err.message,
                message: 'Error to update the user, Please try again...'
            })
        }
    },
    searchUserController: async (req, res) => {
        try {
            const searchedUser = await UserModel.find(req.query)
            if (!searchedUser) {
                return res.status(404).json({
                    message: 'No users found with the searched query'
                })
            }
            return res.status(201).json({
                "user search status": "success",
                "available users": searchedUser
            })
        } catch (err) {
            return res.status(500).json({
                error: err.message,
                message: 'Error to search the user, Please try again...'
            })
        }
    },
    uploadAvatar: async (req, res) => {
        try {
            const userId = req.body.userId // auth middlware
            const image = req.file  // multer middleware

            const upload = await uploadImageClodinary(image)

            const updateUser = await UserModel.findByIdAndUpdate(userId, {
                avatar: upload.url
            })

            return res.json({
                message: "upload profile",
                success: true,
                error: false,
                data: {
                    _id: userId,
                    avatar: upload.url
                },
                updateUser
            })

        } catch (error) {
            return res.status(500).json({
                message: error.message || error,
                error: true,
                success: false
            })
        }
    },
    addProductToCart: async (req, res) => {
        try {
            const { userId, productId } = req.body
            const user = await UserModel.findById(userId)
                .populate('shopping_cart.productId')
            if (!user) {
                return res.status(404).json({
                    message: "User not found",
                    error: true,
                    success: false
                })
            }

            const productIndex = user.shopping_cart.findIndex(item => item.productId._id.toString() === productId)
            if (productIndex > -1) {
                user.shopping_cart[productIndex].quantity += 1
            } else {
                user.shopping_cart.push({ productId, quantity: 1 })
            }

            await user.save()
            return res.status(200).json({
                message: "Product added to cart",
                success: true,
                error: false,
                data: user.shopping_cart
            })
        } catch (error) {
            return res.status(500).json({
                message: error.message || error,
                error: true,
                success: false
            })
        }
    },
    // Increment item quantity in cart
    incrementCartItemQuantity: async (req, res) => {
        try {
            const { userId, productId } = req.body;

            // Step 1: Fetch user WITHOUT populate for update
            const user = await UserModel.findById(userId);
            if (!user) {
                return res.status(404).json({
                    message: "User not found",
                    error: true,
                    success: false,
                });
            }

            // Step 2: Check product existence
            const product = await ProductModel.findById(productId);
            if (!product) {
                return res.status(404).json({
                    message: "Product not found",
                    error: true,
                    success: false,
                });
            }

            // Step 3: Find if product already in cart
            const productIndex = user.shopping_cart.findIndex(
                (item) => item.productId._id.toString() === productId
            );

            if (productIndex > -1) {
                // Product exists in cart: increment quantity
                user.shopping_cart[productIndex].quantity += 1;
            } else {
                // Product not in cart: add it
                user.shopping_cart.push({
                    productId,
                    quantity: 1,
                });
            }

            // Step 4: Save user
            await user.save();

            // Step 5: Re-fetch user with populated cart
            const updatedUser = await UserModel.findById(userId).populate('shopping_cart.productId');

            // Step 6: Send response
            return res.status(200).json({
                message: "Cart item quantity incremented successfully",
                success: true,
                error: false,
                data: updatedUser.shopping_cart,
            });
        } catch (error) {
            return res.status(500).json({
                message: error.message || "Something went wrong",
                error: true,
                success: false,
            });
        }
    },
    decrementCartItemQuantity: async (req, res) => {
        try {
            const { userId, productId } = req.body;
            const user = await UserModel.findById(userId)
                .populate('shopping_cart.productId')
            if (!user) {
                return res.status(404).json({
                    message: "User not found",
                    error: true,
                    success: false,
                });
            }

            const productIndex = user.shopping_cart.findIndex(
                (item) => item.productId._id.toString() === productId
            );

            if (productIndex > -1) {
                if (user.shopping_cart[productIndex].quantity > 1) {
                    user.shopping_cart[productIndex].quantity -= 1;
                } else {
                    user.shopping_cart.splice(productIndex, 1);
                }
                await user.save();
                return res.status(200).json({
                    message: "Cart item quantity decremented successfully",
                    success: true,
                    error: false,
                    data: user.shopping_cart,
                });
            } else {
                return res.status(404).json({
                    message: "Product not found in cart",
                    error: true,
                    success: false,
                });
            }
        } catch (error) {
            return res.status(500).json({
                message: error.message || error,
                error: true,
                success: false,
            });
        }
    },

    getCartItemsByUserId: async (req, res) => {
        try {
            const user = await UserModel.findById(req.params.id).populate('shopping_cart.productId')
            if (!user) {
                return res.status(404).json({
                    message: "User not found",
                    error: true,
                    success: false
                })
            }
            return res.status(200).json({
                message: "Cart items fetched successfully",
                success: true,
                error: false,
                data: user.shopping_cart
            })
        } catch (error) {
            return res.status(500).json({
                message: error.message || error,
                error: true,
                success: false
            })
        }
    },



    deleteCartItem: async (req, res) => {
        try {
            const { userId, productId } = req.body
            const user = await UserModel.findById(userId)
                .populate('shopping_cart.productId')
            if (!user) {
                return res.status(404).json({
                    message: "User not found",
                    error: true,
                    success: false
                })
            }
            const productIndex = user.shopping_cart.findIndex(item => item.productId._id.toString() === productId)
            if (productIndex > -1) {
                user.shopping_cart.splice(productIndex, 1)
            } else {
                return res.status(404).json({
                    message: "Product not found in cart",
                    error: true,
                    success: false
                })
            }
            await user.save()
            return res.status(200).json({
                message: "Cart item deleted successfully",
                success: true,
                error: false,
                data: user.shopping_cart
            })
        } catch (error) {
            return res.status(500).json({
                message: error.message || error,
                error: true,
                success: false
            })
        }
    },
    clearCart: async (req, res) => {
        try {
            const  userId  = req.params.id;

            const user = await UserModel.findById(userId);
            if (!user) {
                return res.status(404).json({
                    message: "User not found",
                    error: true,
                    success: false
                });
            }

            user.shopping_cart = []; // ✅ Clear all items
            await user.save();

            return res.status(200).json({
                message: "Cart cleared successfully",
                success: true,
                error: false,
                data: user.shopping_cart
            });

        } catch (error) {
            return res.status(500).json({
                message: error.message || error,
                error: true,
                success: false
            });
        }
    }

}

module.exports = userContollers