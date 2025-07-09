const admin = require('firebase-admin');
const ResponseModel = require('../models/response.model');
const MyLogger = require('../util/logging.utility');

var serviceAccount = require("./private_key.json");



class NotificationService {
    static initialize() {
        // Initialize Firebase Admin with your service account
        // You need to download your service account key from Firebase Console
        // and store it securely (preferably in environment variables)
        try {
            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount)
            });
            // MyLogger.info('Firebase Admin SDK initialized successfully');
        } catch (error) {
            // MyLogger.error('Error initializing Firebase Admin SDK:', error);
            throw error;
        }
    }

    /**
     * Send notification to a specific device
     * @param {string} deviceToken - The FCM token of the target device
     * @param {string} title - Notification title
     * @param {string} body - Notification body
     * @param {Object} data - Additional data to send with notification
     * @returns {Promise<Object>} - Response from FCM
     */
    static async sendToDevice(deviceToken, title, body, data = {}) {
        try {
            const message = {
                notification: {
                    title,
                    body
                },
                data,
                token: deviceToken
            };

            const response = await admin.messaging().send(message);
            // MyLogger.info('Successfully sent notification:', response);
            return response;
        } catch (error) {
            // MyLogger.error('Error sending notification:', error);
            throw error;
        }
    }

    /**
     * Send notification to multiple devices
     * @param {string[]} deviceTokens - Array of FCM tokens
     * @param {string} title - Notification title
     * @param {string} body - Notification body
     * @param {Object} data - Additional data to send with notification
     * @returns {Promise<Object>} - Response from FCM
     */
    static async sendToMultipleDevices(deviceTokens, title, body, data = {}) {
        try {
            const message = {
                notification: {
                    title,
                    body
                },
                data,
                tokens: deviceTokens
            };

            const response = await admin.messaging().sendMulticast(message);
            // MyLogger.info('Successfully sent notifications:', response);
            return response;
        } catch (error) {
            // MyLogger.error('Error sending notifications:', error);
            throw error;
        }
    }

    /**
     * Send notification to a topic
     * @param {string} topic - Topic name to send notification to
     * @param {string} title - Notification title
     * @param {string} body - Notification body
     * @param {Object} data - Additional data to send with notification
     * @returns {Promise<Object>} - Response from FCM
     */
    static async sendToTopic(topic, title, body, data = {}) {
        try {
            const message = {
                notification: {
                    title,
                    body
                },
                data,
                topic
            };

            const response = await admin.messaging().send(message);
            // MyLogger.info('Successfully sent topic notification:', response);
            return response;
        } catch (error) {
            // MyLogger.error('Error sending topic notification:', error);
            throw error;
        }
    }

    /**
     * Subscribe devices to a topic
     * @param {string[]} deviceTokens - Array of FCM tokens to subscribe
     * @param {string} topic - Topic name to subscribe to
     * @returns {Promise<Object>} - Response from FCM
     */
    static async subscribeToTopic(deviceTokens, topic) {
        try {
            const response = await admin.messaging().subscribeToTopic(deviceTokens, topic);
            // MyLogger.info('Successfully subscribed to topic:', response);
            return response;
        } catch (error) {
            // MyLogger.error('Error subscribing to topic:', error);
            throw error;
        }
    }

    /**
     * Unsubscribe devices from a topic
     * @param {string[]} deviceTokens - Array of FCM tokens to unsubscribe
     * @param {string} topic - Topic name to unsubscribe from
     * @returns {Promise<Object>} - Response from FCM
     */
    static async unsubscribeFromTopic(deviceTokens, topic) {
        try {
            const response = await admin.messaging().unsubscribeFromTopic(deviceTokens, topic);
            // MyLogger.info('Successfully unsubscribed from topic:', response);
            return response;
        } catch (error) {
            // MyLogger.error('Error unsubscribing from topic:', error);
            throw error;
        }
    }
}

module.exports = NotificationService; 