

const variationController = require('../controllers/variations.controller')
const express = require('express')
const variationRoute = express.Router();
const path = require('path')
const multer = require('multer');

variationRoute.post("/create", variationController.create);
variationRoute.put("/edit", variationController.updateVariation);

variationRoute.delete("/delete/:id", variationController.deleteVariations);
variationRoute.get("/getProductVariation/:productId", variationController.getProductVariations);

module.exports = variationRoute;