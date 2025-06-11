const router = require("express").Router();
const categoryControllers = require("../Controllers/categoryController");
const authenticateToken = require("../middleware/auth");


router.get("/getallcategories", categoryControllers.getAllCategories);

router.post("/addcategory", authenticateToken, categoryControllers.addNewCategory);

router.delete("/deletecategory/:id", authenticateToken, categoryControllers.deleteCategoryByCategoryId);

router.put("/updatecategory/:id", authenticateToken, categoryControllers.updateCategoryByCategoryId);


module.exports = router;