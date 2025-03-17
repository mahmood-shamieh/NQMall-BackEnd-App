const express = require('express');
const brandRouter = express.Router();
const brandController = require('../controllers/brand.controller')
const path = require('path')
const multer = require('multer');
const AuthMiddleware = require('../middlewares/auth.middleware');
const Brand = require('../models/brand.model');
const ActionsUtility = require('../util/Action.utility');
const storage = multer.diskStorage({
    destination: 'public/brands/',
    filename: function (req, file, cb) {
        cb(null, "brands" + '-' + Date.now() + path.extname(file.originalname));
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
brandRouter.get('/getFormat', (req, res, next) => AuthMiddleware.AuthAdminAndVendor(req, res, next, Brand.name, ActionsUtility.read), brandController.getFormat);
brandRouter.post('/get/:id?',(req, res, next) => AuthMiddleware.AuthAdminAndVendor(req, res, next, Brand.name, ActionsUtility.read), brandController.getBrandDetails);
brandRouter.get('/getAll',(req, res, next) => AuthMiddleware.AuthAdminAndVendor(req, res, next, Brand.name, ActionsUtility.read), brandController.getAllBrandDetails);
brandRouter.post('/create',(req, res, next) => AuthMiddleware.AuthAdminAndVendor(req, res, next, Brand.name, ActionsUtility.read), files.array('image'), brandController.createNewBrand);
brandRouter.put('/update',(req, res, next) => AuthMiddleware.AuthAdminAndVendor(req, res, next, Brand.name, ActionsUtility.read), files.array('image'), brandController.updateBrandDetails);
brandRouter.delete('/delete/:id',(req, res, next) => AuthMiddleware.AuthAdminAndVendor(req, res, next, Brand.name, ActionsUtility.read), brandController.deleteBrand);

// view apis
brandRouter.get('/brandsView',  brandController.getBrandForView);

module.exports = brandRouter;
