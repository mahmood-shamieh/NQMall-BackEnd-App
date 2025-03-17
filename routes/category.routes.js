const express = require('express');
const categoryRouter = express.Router();
const categoryController = require('../controllers/category.controller')
const path = require('path')
const multer = require('multer');
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
categoryRouter.post('/create', files.array("image"), categoryController.create);
categoryRouter.put('/update', files.array("image"), categoryController.updateCategoryDetails);
categoryRouter.delete('/delete/:id', categoryController.deleteCategory);
categoryRouter.get('/getFormat', categoryController.getFormat);
categoryRouter.get('/getAll', categoryController.getAllCategories);
categoryRouter.post('/get/:id?', categoryController.getCategoryDetails);


// view apis
categoryRouter.get('/categoriesView', categoryController.getCategoryForView);
categoryRouter.get('/categoriesBrands/:categoryId', categoryController.getCategoryBrands);

module.exports = categoryRouter;