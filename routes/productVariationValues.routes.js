

const productVariationController = require('../controllers/productVariationValues.controller')
const express = require('express')
const productVariationRoute = express.Router();
const path = require('path')
const multer = require('multer');
const AuthMiddleware = require('../middlewares/auth.middleware');
const ActionsUtility = require('../util/Action.utility');
const ProductVariationValues = require('../models/productVariationValues.model');
// const storage = multer.diskStorage({
//     destination: 'public/attributeValues/',
//     filename: function (req, file, cb) {
//         cb(null, "attributeValues" + '-' + Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname));
//     }
// });
// const files = multer({
//     storage: storage,
//     limits: { fileSize: 10 * 1000000 }, // Sets file size limit to 1MB
//     // fileFilter: function (req, file, cb) {
//     // checkFileType(file, cb);
//     // }
// });
// this is for type items and list
productVariationRoute.post("/create", (req, res, next) => AuthMiddleware.AuthAdminAndVendor(req, res, next, ProductVariationValues.name, ActionsUtility.add), productVariationController.create);
productVariationRoute.get("/valuesVariations/:valueId", (req, res, next) => AuthMiddleware.AuthAdminAndVendor(req, res, next, ProductVariationValues.name, ActionsUtility.read), productVariationController.getVariationsForValue);
productVariationRoute.delete("/delete/:id", (req, res, next) => AuthMiddleware.AuthAdminAndVendor(req, res, next, ProductVariationValues.name, ActionsUtility.delete), productVariationController.deleteVariations);

module.exports = productVariationRoute;