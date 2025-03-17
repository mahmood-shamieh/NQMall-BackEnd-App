const productController = require('../controllers/product.controller')
const express = require('express')
const productRouter = express.Router();
const path = require('path')
const multer = require('multer');
const { AuthAdminAndVendor, Auth } = require('../middlewares/auth.middleware');
const AuthMiddleware = require('../middlewares/auth.middleware');
const Product = require('../models/product.model');
const ActionsUtility = require('../util/Action.utility');
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
// admin apis
productRouter.post("/create", (req, res, next) => AuthMiddleware.AuthAdminAndVendor(req, res, next, Product.name, ActionsUtility.add), files.array("media[]"), productController.create);
productRouter.delete("/delete/:productId", (req, res, next) => AuthMiddleware.AuthAdminAndVendor(req, res, next, Product.name, ActionsUtility.delete), productController.deleteProduct);
productRouter.post("/get/:id?", (req, res, next) => AuthMiddleware.AuthAdminAndVendor(req, res, next, Product.name, ActionsUtility.read), productController.getAllProductDetails);
productRouter.post("/update", (req, res, next) => AuthMiddleware.AuthAdminAndVendor(req, res, next, Product.name, ActionsUtility.edit), productController.updateProductDetails);
// categoryRouter.post('/get/:id?', categoryController.getCategoryDetails);

// view apis
productRouter.get("/productsViewHomePage", productController.getProductForViewHomePage);
productRouter.get("/productsCategory/:id/:page/:searchQuery?", productController.getProductCategory);
productRouter.get("/productBrand/:id/:page/:searchQuery?", productController.getProductBrand);
productRouter.get("/:id?", productController.getProductDetails);

module.exports = productRouter;