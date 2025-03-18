const attributeController = require('../controllers/attribute.controller')
const express = require('express')
const attributeRoute = express.Router();
const path = require('path')
const multer = require('multer');
const AuthMiddleware = require('../middlewares/auth.middleware');
const Attribute = require('../models/attribute.model');
const ActionsUtility = require('../util/Action.utility');
const storage = multer.diskStorage({
    destination: 'public/attribute/',
    filename: function (req, file, cb) {
        cb(null, "attribute" + '-' + Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname));
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
attributeRoute.post("/create",(req, res, next) => AuthMiddleware.AuthAdminAndVendor(req, res, next, Attribute.name, ActionsUtility.add), attributeController.create);
attributeRoute.post("/edit",(req, res, next) => AuthMiddleware.AuthAdminAndVendor(req, res, next, Attribute.name, ActionsUtility.edit), attributeController.edit);
// this is for type images
// attributeRoute.post("/imgCreate", files.fields([{ name: "itemsAr[]", }, { name: "mediaAr[]", }, { name: "itemsEn[]", }, { name: "mediaEn[]", }]), attributeController.createImageAttribute);

attributeRoute.delete("/delete/:id", (req, res, next) => AuthMiddleware.AuthAdminAndVendor(req, res, next, Attribute.name, ActionsUtility.delete),attributeController.deleteAttributes);
// attributeRoute.delete("/deleteImage/:id", attributeController.deleteImageAttributes);
attributeRoute.get("/getProductAttribute/:productId", attributeController.getProductAttribute);

module.exports = attributeRoute;