const express = require('express');
const AuthMiddleWare = require('../middlewares/auth.middleware');
const ActionsUtility = require('../util/Action.utility');
const Order = require('../models/order.model');
const OrderController = require('../controllers/order.controller');
const AuthMiddleware = require('../middlewares/auth.middleware');
const orderRoute = express.Router();



orderRoute.post('/get/:id?',(req, res, next) => AuthMiddleware.AuthAdminAndVendor(req, res, next, Order.name, ActionsUtility.read), OrderController.getOrderDetails);
orderRoute.put('/edit',(req, res, next) => AuthMiddleware.AuthAdminAndVendor(req, res, next, Order.name, ActionsUtility.edit), OrderController.updateOrderStatus);

// View apis
orderRoute.get('/', (req, res, next) => AuthMiddleWare.Auth(req, res, next, Order.name, ActionsUtility.read), OrderController.getUserOrders);
orderRoute.put('/create', (req, res, next) => AuthMiddleWare.Auth(req, res, next, Order.name, ActionsUtility.add), OrderController.addOrder);
// orderRoute.get('/', (req, res, next) => AuthMiddleWare.Auth(req, res, next, Cart.name, ActionsUtility.read), CartController.getUserCart);
// orderRoute.delete('', (req, res, next) => AuthMiddleWare.Auth(req, res, next, Cart.name, ActionsUtility.delete), CartController.removeFromCart);
// cartRouter.delete('/delete/:id', categoryController.deleteCategory);
// cartRouter.get('/getFormat', categoryController.getFormat);
// cartRouter.get('/getAll', categoryController.getAllCategories);
// cartRouter.post('/get/:id?', categoryController.getCategoryDetails);


// view apis
// categoryRouter.get('/categoriesView', categoryController.getCategoryForView);
// categoryRouter.get('/categoriesBrands/:categoryId', categoryController.getCategoryBrands);

module.exports = orderRoute;