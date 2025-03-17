

const productVariationController  = require('../controllers/productVariationValues.controller')
const express = require('express')
const productVariationRoute = express.Router();
const path = require('path')
const multer = require('multer');
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
productVariationRoute.post("/create", productVariationController.create);
productVariationRoute.get("/valuesVariations/:valueId", productVariationController.getVariationsForValue);
productVariationRoute.delete("/delete/:id", productVariationController.deleteVariations);

module.exports = productVariationRoute;