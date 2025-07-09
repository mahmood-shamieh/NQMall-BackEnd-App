const OrderStatusRepo = require('../repositories/orderStatus.repo');
const ResponseModel = require('../models/response.model');
const MyLogger = require('../util/logging.utility');
const OrderStatusNotFound = require('../exceptions/OrderStatusNotFound');

class OrderStatusController {
    static async getAllOrderStatuses(req, res) {
        const lang = req.headers.lang;
        try {
            const statuses = await OrderStatusRepo.getAllOrderStatuses();
            const temp = ResponseModel.getSuccessResponse(
                lang === "en" ? 'Order statuses retrieved successfully' : "تم استرجاع حالات الطلبات بنجاح",
                statuses
            );
            MyLogger.info(`${temp.code}|${temp.message}|${JSON.stringify(temp.data)}`);
            res.status(200).json(temp);
        } catch (error) {
            let temp;
            
            if (error instanceof OrderStatusNotFound) {
                temp = ResponseModel.getNotFoundResponse(
                    lang === "en" ? "No order statuses found" : "لم يتم العثور على حالات الطلبات",
                    error
                );
                MyLogger.info(`${temp.code}|${temp.message}|${JSON.stringify(temp.data)}`);
            } else {
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

module.exports = OrderStatusController; 