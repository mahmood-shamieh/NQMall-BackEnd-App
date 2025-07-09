const express = require('express');
const UserController = require('../controllers/user.controller');
const AuthMiddleware = require('../middlewares/auth.middleware');
const User = require('../models/user.model');
const ActionsUtility = require('../util/Action.utility');
const userRoutes = express.Router();



userRoutes.post('/create', UserController.create);
userRoutes.post('/createAdmin', (req, res, next) => AuthMiddleware.AuthAdminAndVendor(req, res, next, "admins", ActionsUtility.add), UserController.createAdmin);
userRoutes.post('/login', UserController.login);
userRoutes.put('/update', (req, res, next) => AuthMiddleware.Auth(req, res, next, User.name, ActionsUtility.edit), UserController.updateUser);
userRoutes.delete('/delete', (req, res, next) => AuthMiddleware.Auth(req, res, next, User.name, ActionsUtility.delete), UserController.deleteUser);
userRoutes.get('/getFormat', (req, res, next) => AuthMiddleware.Auth(req, res, next, User.name, ActionsUtility.read), UserController.getFormat);
userRoutes.get('/get', (req, res, next) => AuthMiddleware.Auth(req, res, next, User.name, ActionsUtility.read), UserController.getUserDetails);
userRoutes.post('/page');



module.exports = userRoutes;
