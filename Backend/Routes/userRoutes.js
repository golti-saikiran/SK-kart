const router = require('express').Router()
const userContollers = require('../Controllers/userController')
const upload = require('../Config/multer-config')
const authenticateToken = require('../middleware/auth')

router.get('/getallusers', userContollers.getAllUsersController)

router.post('/register', userContollers.registerUserController)

router.post('/loginuser', userContollers.loginUserController)

router.post('/reset-password-send-otp', userContollers.forgotPasswordController)

router.post('/verify-reset-otp', userContollers.verifyForgotPasswordOtpController)

router.post('/update-new-password', userContollers.resetPasswordController)

router.get('/getuser/:id', authenticateToken, userContollers.getUserByUserIdController)

router.delete('/deleteuser/:id', authenticateToken, userContollers.deleteUserByUserIdController)

router.put('/updateuser/:id', authenticateToken, userContollers.updateUserByUserIdController)

router.get('/searchuser', authenticateToken, userContollers.searchUserController)

router.post('/uploadavatar', authenticateToken, upload.single("avatar"), userContollers.uploadAvatar)

router.post('/add-to-cart', authenticateToken, userContollers.addProductToCart)

router.get('/get-cart-items/:id', authenticateToken, userContollers.getCartItemsByUserId)

router.put('/decrement-cart-item', authenticateToken, userContollers.decrementCartItemQuantity)

router.put('/increment-cart-item', authenticateToken, userContollers.incrementCartItemQuantity)

router.delete('/delete-cart-item', authenticateToken, userContollers.deleteCartItem)

router.delete('/clear-cart/:id', authenticateToken, userContollers.clearCart)

module.exports = router