const Router = require("express").Router();
const addressControllers = require("../Controllers/addressController");
const authenticateToken = require("../middleware/auth");

Router.post("/addaddress", authenticateToken, addressControllers.addNewAddress);

Router.get("/getaddressbyuserid/:id", authenticateToken, addressControllers.getAllAddresses);

Router.delete("/deleteaddress/:id", authenticateToken, addressControllers.deleteAddressById);

Router.put("/updateaddress/:id", authenticateToken, addressControllers.updateAddressById);

module.exports = Router;