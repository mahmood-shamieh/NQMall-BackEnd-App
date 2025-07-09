const express = require('express');
const router = express.Router();
const NotificationController = require('../controllers/notification.controller');
const AuthMiddleware = require('../middlewares/auth.middleware');

// Initialize notification service
const NotificationService = require('../services/notification.service');
const ActionsUtility = require('../util/Action.utility');
NotificationService.initialize();

// Send notification to a specific device
router.post('/send-to-device', (req, res, next) => AuthMiddleware.AuthAdminAndVendor(req, res, next, "notifications", ActionsUtility.read), NotificationController.sendToDevice);

// Send notification to multiple devices
router.post('/send-to-multiple-devices', (req, res, next) => AuthMiddleware.AuthAdminAndVendor(req, res, next, "notifications", ActionsUtility.read), NotificationController.sendToMultipleDevices);

// Send notification to a topic
router.post('/send-to-topic', (req, res, next) => AuthMiddleware.AuthAdminAndVendor(req, res, next, "notifications", ActionsUtility.read), NotificationController.sendToTopic);

// Subscribe devices to a topic
router.post('/subscribe-to-topic', (req, res, next) => AuthMiddleware.AuthAdminAndVendor(req, res, next, "notifications", ActionsUtility.read), NotificationController.subscribeToTopic);

// Unsubscribe devices from a topic
router.post('/unsubscribe-from-topic', (req, res, next) => AuthMiddleware.AuthAdminAndVendor(req, res, next, "notifications", ActionsUtility.read), NotificationController.unsubscribeFromTopic);

module.exports = router; 