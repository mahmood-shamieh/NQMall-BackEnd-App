const productController = require('../controllers/product.controller')
const express = require('express')
const productRouter = express.Router();
const path = require('path')
const multer = require('multer');
const storage = multer.diskStorage({
    destination: 'public/media/',
    filename: function (req, file, cb) {
        cb(null, "media" + '-' + Date.now() + path.extname(file.originalname));
    }
});
const files = multer({
    storage: storage,
    limits: { fileSize: 10 * 1000000 }, // Sets file size limit to 1MB
    // fileFilter: function (req, file, cb) {
    // checkFileType(file, cb);
    // }
});

productRouter.post("/create",files.array("media[]"),productController.create);
productRouter.delete("/delete/:productId",productController.deleteProduct);
productRouter.post("/get/:id?",productController.getProductDetails);
productRouter.post("/update",productController.updateProductDetails);
// categoryRouter.post('/get/:id?', categoryController.getCategoryDetails);

module.exports = productRouter;