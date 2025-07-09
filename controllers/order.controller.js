const { sequelize } = require('../config/sequelize.config');
const attributeRepo = require('../repositories/attribute.repo');
const ValuesRepo = require('../repositories/values.repo');
const ResponseModel = require("../models/response.model");
const MyLogger = require("../util/logging.utility");
const CartNotExist = require('../exceptions/CartNotExist');
const VariationNotExist = require('../exceptions/VariationNotExist');
const OrderRepo = require('../repositories/order.repo');
const VariationQTYOutOfStock = require('../exceptions/VariationQTYOutOfStock');
const OrderFailure = require('../exceptions/OrderFailure');
const OrderNotFound = require('../exceptions/OrderNotFound');
const OrderStatusNotFound = require('../exceptions/OrderStatusNotFound');
const OrderStatusUpdateFailure = require('../exceptions/OrderStatusUpdateFailure');





class OrderController {
    static async addOrder(req, res) {
        const lang = req.headers.lang;
        try {
            const body = req.body;
            body.userId = req.headers.userId;
            const data = await OrderRepo.addOrder(body);
            const temp = ResponseModel.getSuccessResponse(lang === "en" ? 'Order is' : "الطلب هو", data);
            MyLogger.info(`${temp.code}|${temp.message}|${JSON.stringify(temp.data)}`)
            res.status(200).json(temp);
        } catch (error) {
            if (error instanceof VariationQTYOutOfStock) {
                let temp = ResponseModel.getDataConflictError(lang === "en" ? "Order Can't be proceed" : "لا يمكن إتمام الطلب", error);
                MyLogger.error(`${temp.code}|${temp.message}|${JSON.stringify(temp.data)}`)
                res.status(500).json(temp);
            } else {
                let temp = ResponseModel.getServerSideError(lang === "en" ? "Unknown Error Happened" : "مشكلة غير معروفة", error);
                MyLogger.error(`${temp.code}|${temp.message}|${JSON.stringify(temp.data)}`)
                res.status(500).json(temp);
            }
        }
    }
    static async getUserOrders(req, res) {

        const lang = req.headers.lang

        try {
            const body = req.body;
            body.userId = req.headers.userId;
            const data = await OrderRepo.getUserOrders(body);
            const temp = ResponseModel.getSuccessResponse(lang === "en" ? 'Cart is' : "السلة هي", data);
            MyLogger.info(`${temp.code}|${temp.message}|${JSON.stringify(temp.data)}`)
            res.status(200).json(temp);
        } catch (error) {
            console.log(error);
            let temp = ResponseModel.getServerSideError(lang === "en" ? "Unknown Error Happened" : "مشكلة غير معروفة", error);
            if (error instanceof CartNotExist) {
                temp = ResponseModel.getNotFoundResponse(lang === "en" ? "Cart not exist" : "السلة غير موجودة", error)
                MyLogger.info(`${temp.code}|${temp.message}|${JSON.stringify(temp.data)}`)
            } else if (error instanceof VariationNotExist) {
                temp = ResponseModel.getNotFoundResponse(lang === "en" ? "Variations not exist" : "هذه التشكيلة غير موجودة", error)
                MyLogger.info(`${temp.code}|${temp.message}|${JSON.stringify(temp.data)}`)
            } else {
                MyLogger.error(`${temp.code}|${temp.message}|${JSON.stringify(temp.data)}`)
            }
            res.status(500).json(temp);
        }

    }
    static async getUserCart(req, res) {
        const lang = req.headers.lang
        const userId = req.user.Id;
        try {
            const data = await CartRepo.getUserCart(userId);
            const temp = ResponseModel.getSuccessResponse(lang === "en" ? 'Cart is' : "السلة هي", data);
            MyLogger.info(`${temp.code}|${temp.message}|${JSON.stringify(temp.data)}`)
            res.status(200).json(temp);
        } catch (error) {
            let temp = ResponseModel.getServerSideError(lang === "en" ? "Unknown Error Happened" : "مشكلة غير معروفة", error);
            if (error instanceof CartNotExist) {
                temp = ResponseModel.getNotFoundResponse(lang === "en" ? "Cart not exist" : "السلة غير موجودة", error)
                MyLogger.info(`${temp.code}|${temp.message}|${JSON.stringify(temp.data)}`)
            } else {
                MyLogger.error(`${temp.code}|${temp.message}|${JSON.stringify(temp.data)}`)
            }
            res.status(500).json(temp);
        }
    }
    static async getOrderDetails(req, res) {
        const id = req.params.id;
        const lang = req.headers.lang;
        try {
            const ordersData = await OrderRepo.getOrderDetails(id, req.body.page, req.body.limit, req.body.searchQuery);
            const temp = ResponseModel.getSuccessResponse(lang === "en" ? '' : "", ordersData);
            MyLogger.info(`${temp.code}|${temp.message}|${JSON.stringify(temp.data)}`)
            res.status(200).json(temp);

        } catch (error) {
            console.log(error);
            
            let temp = ResponseModel.getServerSideError(lang === "en" ? "Unknown Error Happened" : "مشكلة غير معروفة", error);
            if (error instanceof OrderFailure) {
                temp = ResponseModel.getNotFoundResponse(lang === "en" ? "Orders Not Found" : "البراند غير موجود", error)
                MyLogger.info(`${temp.code}|${temp.message}|${JSON.stringify(temp.data)}`)
            }
            else {
                MyLogger.error(`${temp.code}|${temp.message}|${JSON.stringify(temp.data)}`)
            }
            res.status(500).json(temp);
        }

    }
    static async updateOrderStatus(req, res) {
        const lang = req.headers.lang;
        const { orderId, orderStatusId, responseNote } = req.body;

        // Add input validation
        if (!orderId || !orderStatusId) {
            const temp = ResponseModel.getBadRequestError(
                lang === "en" ? "Order ID and Order Status ID are required" : "معرف الطلب ومعرف حالة الطلب مطلوبان",
                { orderId, orderStatusId }
            );
            MyLogger.error(`${temp.code}|${temp.message}|${JSON.stringify(temp.data)}`);
            return res.status(400).json(temp);
        }

        // Validate that IDs are numbers
        if (isNaN(Number(orderId)) || isNaN(Number(orderStatusId))) {
            const temp = ResponseModel.getBadRequestError(
                lang === "en" ? "Order ID and Order Status ID must be numbers" : "يجب أن يكون معرف الطلب ومعرف حالة الطلب أرقامًا",
                { orderId, orderStatusId }
            );
            MyLogger.error(`${temp.code}|${temp.message}|${JSON.stringify(temp.data)}`);
            return res.status(400).json(temp);
        }

        try {
            const updatedOrder = await OrderRepo.updateOrderStatus(orderId, orderStatusId,responseNote,lang);
            const temp = ResponseModel.getSuccessResponse(
                lang === "en" ? 'Order status updated successfully' : "تم تحديث حالة الطلب بنجاح", 
                updatedOrder
            );
            MyLogger.info(`${temp.code}|${temp.message}|${JSON.stringify(temp.data)}`);
            res.status(200).json(temp);
        } catch (error) {
            let temp;
            
            if (error instanceof OrderNotFound) {
                temp = ResponseModel.getNotFoundResponse(
                    lang === "en" ? "Order not found" : "الطلب غير موجود",
                    error
                );
                MyLogger.info(`${temp.code}|${temp.message}|${JSON.stringify(temp.data)}`);
            } 
            
            else if (error instanceof OrderStatusNotFound) {
                temp = ResponseModel.getNotFoundResponse(
                    lang === "en" ? "Order status not found" : "حالة الطلب غير موجودة",
                    error
                );
                MyLogger.info(`${temp.code}|${temp.message}|${JSON.stringify(temp.data)}`);
            }
            else if (error instanceof OrderStatusUpdateFailure) {
                temp = ResponseModel.getDataConflictError(
                    lang === "en" ? "Failed to update order status" : "فشل تحديث حالة الطلب",
                    error
                );
                MyLogger.error(`${temp.code}|${temp.message}|${JSON.stringify(temp.data)}`);
            }
            else {
                temp = ResponseModel.getServerSideError(
                    lang === "en" ? "Unknown Error Happened" : "مشكلة غير معروفة",
                    error
                );
                MyLogger.error(`${temp.code}|${temp.message}|${JSON.stringify(temp.data)}`);
            }
            
            res.status(500).json(temp);
        }
    }
}
module.exports = OrderController