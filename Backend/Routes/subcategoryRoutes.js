const Router = require("express").Router();
const subCategoryControllers = require("../Controllers/subcategoryController");
const authenticateToken = require("../middleware/auth");


Router.get("/getallsubcategories", subCategoryControllers.getAllSubCategories);

Router.get("/getsubcategoryByCategoryId/:id", subCategoryControllers.getSubCategoryByCategoryId);

Router.post("/addsubcategory", authenticateToken, subCategoryControllers.addNewSubCategory);

Router.delete("/deletesubcategory/:id", authenticateToken, subCategoryControllers.deleteSubCategoryBySubCategoryId);

Router.put("/updatesubcategory/:id", authenticateToken, subCategoryControllers.updateSubCategoryBySubCategoryId);


module.exports = Router;