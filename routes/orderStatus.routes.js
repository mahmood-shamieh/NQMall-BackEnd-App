const express = require('express');
const router = express.Router();
const OrderStatusController = require('../controllers/orderStatus.controller');
const AuthMiddleware = require('../middlewares/auth.middleware');
const OrderStatus = require('../models/orderStatus.model');
const ActionsUtility = require('../util/Action.utility');

// Get all order statuses
router.get('/', (req, res, next) => AuthMiddleware.AuthAdminAndVendor(req, res, next, OrderStatus.name, ActionsUtility.read), OrderStatusController.getAllOrderStatuses);

module.exports = router; 