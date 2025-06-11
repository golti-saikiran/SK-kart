const router = require('express').Router()
const productContollers = require('../Controllers/productController')
const authenticateToken = require("../middleware/auth");


router.get('/getallproducts', productContollers.getAllProducts)

router.post('/addproduct',authenticateToken, productContollers.addNewProduct)

router.get('/getproduct/:id', productContollers.getProductByProductId)

router.delete('/deleteproduct/:id',authenticateToken, productContollers.deleteProductByProductId)

router.put('/updateproduct/:id',authenticateToken, productContollers.updateProductByProductId)

router.get('/search', productContollers.searchProduct)

router.get('/getproductsByCategoryId/:id',productContollers.getproductsByCategoryId)

module.exports = router