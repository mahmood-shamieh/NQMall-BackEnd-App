const mediaController = require('../controllers/media.controller');
const express = require('express');
const mediaRouter = express.Router();
const path = require('path')
const multer = require('multer');
const AuthMiddleware = require('../middlewares/auth.middleware');
const Media = require('../models/media.model');
const ActionsUtility = require('../util/Action.utility');
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



mediaRouter.post('/create', (req, res, next) => AuthMiddleware.AuthAdminAndVendor(req, res, next, Media.name, ActionsUtility.add), files.array("images[]"), mediaController.create);
mediaRouter.get('/getProductMedia/:productId', (req, res, next) => AuthMiddleware.AuthAdminAndVendor(req, res, next, Media.name, ActionsUtility.read), mediaController.getProductMedia);
mediaRouter.get('/get/:id?', (req, res, next) => AuthMiddleware.AuthAdminAndVendor(req, res, next, Media.name, ActionsUtility.read), mediaController.getMediaDetails);
mediaRouter.delete('/delete/:id', (req, res, next) => AuthMiddleware.AuthAdminAndVendor(req, res, next, Media.name, ActionsUtility.delete), mediaController.delete);

module.exports = mediaRouter;