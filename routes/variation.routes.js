

const variationController = require('../controllers/variations.controller')
const express = require('express')
const variationRoute = express.Router();
const path = require('path')
const multer = require('multer');
const AuthMiddleware = require('../middlewares/auth.middleware');
const ActionsUtility = require('../util/Action.utility');
const Variations = require('../models/vairation.model');

// Admins Apis
variationRoute.post("/create", (req, res, next) => AuthMiddleware.AuthAdminAndVendor(req, res, next, Variations.name, ActionsUtility.add), variationController.create);
variationRoute.put("/edit", (req, res, next) => AuthMiddleware.AuthAdminAndVendor(req, res, next, Variations.name, ActionsUtility.edit), variationController.updateVariation);
variationRoute.delete("/delete/:id", (req, res, next) => AuthMiddleware.AuthAdminAndVendor(req, res, next, Variations.name, ActionsUtility.delete), variationController.deleteVariations);
variationRoute.get("/getProductVariation/:productId", (req, res, next) => AuthMiddleware.AuthAdminAndVendor(req, res, next, Variations.name, ActionsUtility.read), variationController.getProductVariations);

module.exports = variationRoute;