const router = require("express").Router();
const uploadImageController = require("../Controllers/uploadImageController");
const upload = require("../Config/multer-config");

router.post("/uploadimage", upload.single("image"), uploadImageController)

module.exports = router;