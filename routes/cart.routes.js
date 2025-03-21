const express = require('express');
const CartController = require('../controllers/cart.controller');
const AuthMiddleWare = require('../middlewares/auth.middleware');
const ActionsUtility = require('../util/Action.utility');
const Cart = require('../models/cart.model');
const cartRouter = express.Router();




// View apis
cartRouter.put('/add', (req, res, next) => AuthMiddleWare.Auth(req, res, next, Cart.name, ActionsUtility.add), CartController.addToCart);
cartRouter.get('/', (req, res, next) => AuthMiddleWare.Auth(req, res, next, Cart.name, ActionsUtility.read), CartController.getUserCart);
cartRouter.delete('', (req, res, next) => AuthMiddleWare.Auth(req, res, next, Cart.name, ActionsUtility.delete), CartController.removeFromCart);
// cartRouter.delete('/delete/:id', categoryController.deleteCategory);
// cartRouter.get('/getFormat', categoryController.getFormat);
// cartRouter.get('/getAll', categoryController.getAllCategories);
// cartRouter.post('/get/:id?', categoryController.getCategoryDetails);


// view apis
// categoryRouter.get('/categoriesView', categoryController.getCategoryForView);
// categoryRouter.get('/categoriesBrands/:categoryId', categoryController.getCategoryBrands);

module.exports = cartRouter;