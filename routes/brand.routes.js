const express = require('express');
const brandRouter = express.Router();
const brandController = require('../controllers/brand.controller')
const path = require('path')
const multer = require('multer');
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



brandRouter.get('/getFormat', brandController.getFormat);
brandRouter.post('/get/:id?', brandController.getBrandDetails);
brandRouter.get('/getAll', brandController.getAllBrandDetails);
brandRouter.post('/create', files.array('image'), brandController.createNewBrand);
brandRouter.put('/update', files.array('image'), brandController.updateBrandDetails);
brandRouter.delete('/delete/:id', brandController.deleteBrand);

module.exports = brandRouter;
