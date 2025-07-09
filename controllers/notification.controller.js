const NotificationService = require('../services/notification.service');
const ResponseModel = require('../models/response.model');
const MyLogger = require('../util/logging.utility');

class NotificationController {
    /**
     * Send notification to a specific device
     */
    static async sendToDevice(req, res) {
        const { deviceToken, title, body, data } = req.body;
        const lang = req.headers.lang || 'en';

        try {
            const response = await NotificationService.sendToDevice(deviceToken, title, body, data);
            const temp = ResponseModel.getSuccessResponse(
                lang === "en" ? 'Notification sent successfully' : 'تم إرسال الإشعار بنجاح',
                response
            );
            MyLogger.info(`${temp.code}|${temp.message}|${JSON.stringify(temp.data)}`);
            res.status(200).json(temp);
        } catch (error) {
            const temp = ResponseModel.getServerSideError(
                lang === "en" ? 'Failed to send notification' : 'فشل في إرسال الإشعار',
                error
            );
            MyLogger.error(`${temp.code}|${temp.message}|${JSON.stringify(temp.data)}`);
            res.status(500).json(temp);
        }
    }

    /**
     * Send notification to multiple devices
     */
    static async sendToMultipleDevices(req, res) {
        const { deviceTokens, title, body, data } = req.body;
        const lang = req.headers.lang || 'en';

        try {
            const response = await NotificationService.sendToMultipleDevices(deviceTokens, title, body, data);
            const temp = ResponseModel.getSuccessResponse(
                lang === "en" ? 'Notifications sent successfully' : 'تم إرسال الإشعارات بنجاح',
                response
            );
            MyLogger.info(`${temp.code}|${temp.message}|${JSON.stringify(temp.data)}`);
            res.status(200).json(temp);
        } catch (error) {
            const temp = ResponseModel.getServerSideError(
                lang === "en" ? 'Failed to send notifications' : 'فشل في إرسال الإشعارات',
                error
            );
            MyLogger.error(`${temp.code}|${temp.message}|${JSON.stringify(temp.data)}`);
            res.status(500).json(temp);
        }
    }

    /**
     * Send notification to a topic
     */
    static async sendToTopic(req, res) {
        const { topic, title, body, data } = req.body;
        const lang = req.headers.lang || 'en';

        try {
            const response = await NotificationService.sendToTopic(topic, title, body, data);
            const temp = ResponseModel.getSuccessResponse(
                lang === "en" ? 'Topic notification sent successfully' : 'تم إرسال إشعار الموضوع بنجاح',
                response
            );
            MyLogger.info(`${temp.code}|${temp.message}|${JSON.stringify(temp.data)}`);
            res.status(200).json(temp);
        } catch (error) {
            const temp = ResponseModel.getServerSideError(
                lang === "en" ? 'Failed to send topic notification' : 'فشل في إرسال إشعار الموضوع',
                error
            );
            MyLogger.error(`${temp.code}|${temp.message}|${JSON.stringify(temp.data)}`);
            res.status(500).json(temp);
        }
    }

    /**
     * Subscribe devices to a topic
     */
    static async subscribeToTopic(req, res) {
        const { deviceTokens, topic } = req.body;
        const lang = req.headers.lang || 'en';

        try {
            const response = await NotificationService.subscribeToTopic(deviceTokens, topic);
            const temp = ResponseModel.getSuccessResponse(
                lang === "en" ? 'Successfully subscribed to topic' : 'تم الاشتراك في الموضوع بنجاح',
                response
            );
            MyLogger.info(`${temp.code}|${temp.message}|${JSON.stringify(temp.data)}`);
            res.status(200).json(temp);
        } catch (error) {
            const temp = ResponseModel.getServerSideError(
                lang === "en" ? 'Failed to subscribe to topic' : 'فشل في الاشتراك في الموضوع',
                error
            );
            MyLogger.error(`${temp.code}|${temp.message}|${JSON.stringify(temp.data)}`);
            res.status(500).json(temp);
        }
    }

    /**
     * Unsubscribe devices from a topic
     */
    static async unsubscribeFromTopic(req, res) {
        const { deviceTokens, topic } = req.body;
        const lang = req.headers.lang || 'en';

        try {
            const response = await NotificationService.unsubscribeFromTopic(deviceTokens, topic);
            const temp = ResponseModel.getSuccessResponse(
                lang === "en" ? 'Successfully unsubscribed from topic' : 'تم إلغاء الاشتراك من الموضوع بنجاح',
                response
            );
            MyLogger.info(`${temp.code}|${temp.message}|${JSON.stringify(temp.data)}`);
            res.status(200).json(temp);
        } catch (error) {
            const temp = ResponseModel.getServerSideError(
                lang === "en" ? 'Failed to unsubscribe from topic' : 'فشل في إلغاء الاشتراك من الموضوع',
                error
            );
            MyLogger.error(`${temp.code}|${temp.message}|${JSON.stringify(temp.data)}`);
            res.status(500).json(temp);
        }
    }
}

module.exports = NotificationController; 