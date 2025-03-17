
const valuesController = require('../controllers/values.controller')
const express = require('express')
const valuesRoute = express.Router();
const path = require('path')
const multer = require('multer');
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
valuesRoute.post("/create", files.fields([{ name: "HoverImageAr", }, { name: "HoverImageEn", }]), valuesController.create);
valuesRoute.post("/edit", files.fields([{ name: "HoverImageAr", }, { name: "HoverImageEn", }]), valuesController.edit);
// this is for type images
valuesRoute.post("/create/img", files.fields([{ name: "ValueAr", }, { name: "ValueEn", }, { name: "HoverImageAr", }, { name: "HoverImageEn", }]), valuesController.createImageAttributeValue);
valuesRoute.post("/edit/img", files.fields([{ name: "ValueAr", }, { name: "ValueEn", }, { name: "HoverImageAr", }, { name: "HoverImageEn", }]), valuesController.editImageAttributeValue);

valuesRoute.delete("/delete/:id", valuesController.deleteAttributesValue);
valuesRoute.delete("/delete/image/:id", valuesController.deleteImageAttributeValue);
valuesRoute.get("/getAttributeValues/:attributeId", valuesController.getProductAttributeValues);

module.exports = valuesRoute;