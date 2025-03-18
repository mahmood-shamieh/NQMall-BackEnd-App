
const valuesController = require('../controllers/values.controller')
const express = require('express')
const valuesRoute = express.Router();
const path = require('path')
const multer = require('multer');
const AuthMiddleware = require('../middlewares/auth.middleware');
const Values = require('../models/values.model');
const ActionsUtility = require('../util/Action.utility');
const storage = multer.diskStorage({
    destination: 'public/attributeValues/',
    filename: function (req, file, cb) {
        cb(null, "attributeValues" + '-' + Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname));
    }
});
const files = multer({
    storage: storage,
    limits: { fileSize: 10 * 1000000 }, // Sets file size limit to 1MB
    // fileFilter: function (req, file, cb) {
    // checkFileType(file, cb);
    // }
});
// this is for type items and list
valuesRoute.post("/create",(req, res, next) => AuthMiddleware.AuthAdminAndVendor(req, res, next, Values.name, ActionsUtility.add), files.fields([{ name: "HoverImageAr", }, { name: "HoverImageEn", }]), valuesController.create);
valuesRoute.post("/edit",(req, res, next) => AuthMiddleware.AuthAdminAndVendor(req, res, next, Values.name, ActionsUtility.edit), files.fields([{ name: "HoverImageAr", }, { name: "HoverImageEn", }]), valuesController.edit);
// this is for type images
valuesRoute.post("/create/img",(req, res, next) => AuthMiddleware.AuthAdminAndVendor(req, res, next, Values.name, ActionsUtility.add), files.fields([{ name: "ValueAr", }, { name: "ValueEn", }, { name: "HoverImageAr", }, { name: "HoverImageEn", }]), valuesController.createImageAttributeValue);
valuesRoute.post("/edit/img",(req, res, next) => AuthMiddleware.AuthAdminAndVendor(req, res, next, Values.name, ActionsUtility.edit), files.fields([{ name: "ValueAr", }, { name: "ValueEn", }, { name: "HoverImageAr", }, { name: "HoverImageEn", }]), valuesController.editImageAttributeValue);

valuesRoute.delete("/delete/:id",(req, res, next) => AuthMiddleware.AuthAdminAndVendor(req, res, next, Values.name, ActionsUtility.delete), valuesController.deleteAttributesValue);
valuesRoute.delete("/delete/image/:id",(req, res, next) => AuthMiddleware.AuthAdminAndVendor(req, res, next, Values.name, ActionsUtility.delete), valuesController.deleteImageAttributeValue);

valuesRoute.get("/getAttributeValues/:attributeId", valuesController.getProductAttributeValues);

module.exports = valuesRoute;