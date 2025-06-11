export const base_backend_url = import.meta.env.VITE_API_URL

export const endpoints = {
    users: {
        registerUser: "/api/user/register",
        getAllUsers: "/api/user/getallusers",
        loginUser: "/api/user/loginuser",
        sendOtp: "/api/user/reset-password-send-otp",
        verifyOTP: "/api/user/verify-reset-otp",
        resetPassword: "/api/user/update-new-password",
        getUserByUserId: "/api/user/getuser/:id",
        updateUserByUserId: "/api/user/updateuser/:id",
        deleteUserByUserId: "/api/user/deleteuser/:id",
        searchUser: "/api/user/searchuser",
        uploadAvatar: "/api/user/uploadavatar",
        addToCart: "/api/user/add-to-cart",
        getCartItemsByUserId: "/api/user/get-cart",
        decrementCartItemQuantity: "/api/user/decrement-cart-item",
        incrementCartItemQuantity: "/api/user/increment-cart-item",
        deleteCartItem: "/api/user/delete-cart-item"
    },
    upload: {
        uploadImage: "/api/upload/uploadimage"
    },
    products: {
        addNewProduct: "/api/product/addproduct",
        getAllProducts: "/api/product/getallproducts",
        getProductByProductId: "/api/product/getproduct",
        updateProductByProductId: "/api/product/updateproduct",
        deleteProductByProductId: "/api/product/deleteproduct",
        searchProduct: "/api/product/search",
        getProductsByCategoryId: "/api/product/getproductsByCategoryId",
    },
    orders: {
        placeNewOrder: "/api/order/placeneworder",
        getOrderByUserId: "/api/order/getorderbyuserid/:id",
        getAllOrders: "/api/order/getallorders",
        updateOrderById: "/api/order/updateorder/:id",
        deleteOrderById: "/api/order/deleteorder/:id",
        searchOrder: "/api/order/searchorders"
    },
    address: {
        addAddress: "/api/address/addaddress",
        getAllAddressByUserId: "/api/address/getaddressbyuserid",
        updateAddressById: "/api/address/updateaddress",
        deleteAddressById: "/api/address/deleteaddress"
    },
    category: {
        addCategory: "/api/category/addcategory",
        getAllCategories: "/api/category/getallcategories",
        updateCategoryById: "/api/category/updatecategory",
        deleteCategoryById: "/api/category/deletecategory"
    },
    subCategory: {
        addSubCategory: "/api/subcategory/addsubcategory",
        getSubCategoryByCategoryId: "/api/subcategory/getsubcategoryByCategoryId/:id",
        getAllSubCategories: "/api/subcategory/getallsubcategories",
        updateSubCategoryById: "/api/subcategory/updatesubcategory",
        deleteSubCategoryById: "/api/subcategory/deletesubcategory"
    },
}
