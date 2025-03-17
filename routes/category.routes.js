const express = require('express');
const AuthMiddleware = require('../middlewares/auth.middleware');

const ActionsUtility = require('../util/Action.utility');
const categoryRouter = express.Router();
const categoryController = require('../controllers/category.controller')
const path = require('path')
const multer = require('multer');
const Category = require('../models/category.model');
const storage = multer.diskStorage({
    destination: 'public/categories/',
    filename: function (req, file, cb) {
        cb(null, "categories" + '-' + Date.now() + path.extname(file.originalname));
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
categoryRouter.post('/create', (req, res, next) => AuthMiddleware.AuthAdminAndVendor(req, res, next, Category.name, ActionsUtility.add), files.array("image"), categoryController.create);
categoryRouter.put('/update', (req, res, next) => AuthMiddleware.AuthAdminAndVendor(req, res, next, Category.name, ActionsUtility.edit), files.array("image"), categoryController.updateCategoryDetails);
categoryRouter.delete('/delete/:id', (req, res, next) => AuthMiddleware.AuthAdminAndVendor(req, res, next, Category.name, ActionsUtility.delete), categoryController.deleteCategory);
categoryRouter.get('/getAll', (req, res, next) => AuthMiddleware.AuthAdminAndVendor(req, res, next, Category.name, ActionsUtility.read), categoryController.getAllCategories);
categoryRouter.post('/get/:id?', (req, res, next) => AuthMiddleware.AuthAdminAndVendor(req, res, next, Category.name, ActionsUtility.read), categoryController.getCategoryDetails);


// view apis
categoryRouter.get('/categoriesView', categoryController.getCategoryForView);
categoryRouter.get('/categoriesBrands/:categoryId', categoryController.getCategoryBrands);

module.exports = categoryRouter;