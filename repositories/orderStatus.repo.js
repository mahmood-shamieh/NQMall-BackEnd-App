const OrderStatus = require('../models/orderStatus.model');
const OrderStatusNotFound = require('../exceptions/OrderStatusNotFound');

class OrderStatusRepo {
    static async getAllOrderStatuses() {
        try {
            const statuses = await OrderStatus.findAll({
                where: {
                    IsActive: true
                },
                order: [['Id', 'ASC']]
            });

            if (!statuses || statuses.length === 0) {
                throw new OrderStatusNotFound();
            }

            return statuses.map(status => status.get({ plain: true }));
        } catch (error) {
            throw error;
        }
    }
}

module.exports = OrderStatusRepo; 