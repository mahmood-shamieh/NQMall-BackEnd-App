const mediaController = require('../controllers/media.controller');
const express = require('express');
const mediaRouter = express.Router();
const path = require('path')
const multer = require('multer');
const storage = multer.diskStorage({
    destination: 'public/media/',
    filename: function (req, file, cb) {
        cb(null, "media" + '-' + Date.now() + path.extname(file.originalname));
    }
});
const files = multer({
    storage: storage,
    limits: { fileSize: 10 * 1000000 }, // Sets file size limit to 1MB
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    }
});
function checkFileType(file, cb) {
    // Allowed ext
    const filetypes = /jpeg|jpg|png|gif/;
    // Check ext
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check mime
    const mimetype = filetypes.test(file.mimetype);

    // if (mimetype && extname) {
        return cb(null, true);
    // } else {
        // cb('Error: Images Only!');
    // }
}



mediaRouter.post('/create', files.array("images[]"), mediaController.create);
mediaRouter.get('/getProductMedia/:productId', mediaController.getProductMedia);
mediaRouter.get('/get/:id?', mediaController.getMediaDetails);
mediaRouter.get('/getFormat', mediaController.getFormat);
mediaRouter.delete('/delete/:id', mediaController.delete);

module.exports = mediaRouter;