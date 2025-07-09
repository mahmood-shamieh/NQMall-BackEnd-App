const Order = require('../models/order.model');
const { sequelize, Sequelize } = require('../config/sequelize.config');
const { create } = require('./attribute.repo');
const CreateOrderFailure = require('../exceptions/CreatOrderFailure');
const OrderItem = require('../models/orderItem.model');
const VariationsRepo = require('./variations.repo');
const VariationQTYOutOfStock = require('../exceptions/VariationQTYOutOfStock');
const OrderStatus = require('../models/orderStatus.model');
const ProductVariationValues = require('../models/productVariationValues.model');
const Values = require('../models/values.model');
const Attribute = require('../models/attribute.model');
const Variations = require('../models/vairation.model');
const Product = require('../models/product.model');
const Media = require('../models/media.model');
const CartRepo = require('../repositories/cart.repo.js');
const OrderFailure = require('../exceptions/OrderFailure.js');
const OrderNotFound = require('../exceptions/OrderNotFound');
const OrderStatusNotFound = require('../exceptions/OrderStatusNotFound');
const OrderStatusUpdateFailure = require('../exceptions/OrderStatusUpdateFailure');
const User = require('../models/user.model.js');
const NotificationService = require('../services/notification.service.js');
const ApplicationTopics = require('../util/Application_topics.js');
const UserNotFound = require('../exceptions/UserNotExists.js');





class OrderRepo {
    static async getUserOrders(body) {
        try {
            const orders = await Order.findAll({
                where: {
                    userId: body.userId
                },
                include: [
                    {
                        model: OrderItem,
                        include: [
                            {
                                model: Product, include: [
                                    Media
                                ]
                            },
                            {
                                model: Variations,
                                include: [
                                    {
                                        model: ProductVariationValues,
                                        include: [
                                            {
                                                model: Values,
                                                include: [Attribute]
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    },
                    OrderStatus,
                ],
                order: [['CreatedAt', 'DESC']]
            });

            if (!orders || orders.length === 0) {
                return [];
            }

            // Transform each order in the array
            return orders.map(order => {
                const orderData = order.get({ plain: true }); // converts Sequelize instance to plain object

                return {
                    ...orderData,
                    orderItems: orderData.orderItems.map(orderItem => ({
                        ...orderItem,

                        variation: {
                            ...orderItem.variation, Values: orderItem.variation.product_variation_values
                                ?.map(pvv => pvv.value) || []
                        }
                    }))
                };
            });
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
    static async addOrder(body) {
        const transaction = await sequelize.transaction();
        try {
            const orderStatus = await OrderStatus.findOne({
                where: {
                    NameAr: "بانتظار القبول"
                }, transaction
            })
            body.orderStatusId = orderStatus.dataValues.Id;
            const createdOrder = await Order.create(body, { transaction });
            if (createdOrder) {
                const orderId = createdOrder.dataValues.Id;
                for (let index = 0; index < body.orderItems.length; index++) {
                    const data = { ...body.orderItems[index], orderId };
                    const tempVariation = await VariationsRepo.getVariationByProductIdAndVariationId(body.orderItems[index].variationId, body.orderItems[index].productId, transaction);
                    if (parseInt(tempVariation.Stock) >= body.orderItems[index].Quantity) {
                        await VariationsRepo.edit({
                            Id: body.orderItems[index].variationId,
                            Price: tempVariation.Price,
                            Stock: parseInt(parseInt(tempVariation.Stock) - parseInt(body.orderItems[index].Quantity)),
                            productId: tempVariation.productId,
                            IsActive: !!tempVariation.IsActive

                        }, { transaction });
                    }
                    else {
                        throw new VariationQTYOutOfStock(tempVariation, body.orderItems[index])
                    }
                    await OrderItem.create(data, { transaction });
                }
                await CartRepo.emptyCart(body, { transaction });

                await transaction.commit();
                const databaseOrder = await Order.findOne({
                    where: {
                        Id: orderId
                    },
                    include: [
                        {
                            model: OrderItem,
                            include: [
                                {
                                    model: Product, include: [
                                        Media
                                    ]
                                },
                                {
                                    model: Variations,
                                    include: [
                                        {
                                            model: ProductVariationValues,
                                            include: [
                                                {
                                                    model: Values,
                                                    include: [Attribute]
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        },
                        OrderStatus,
                    ]
                });

                NotificationService.sendToTopic(ApplicationTopics.admins, "طلب جديد", "يوجد طلب جديد يرجى معالجته");
                return databaseOrder.dataValues;
            }
            else {
                throw new CreateOrderFailure();
            }

        } catch (error) {
            console.log(error);
            await transaction.rollback();
            throw error
        }
    }
    static async getOrderDetails(id, page, limit, searchQuery) {
        const pageNumber = parseInt(page) || 1;
        const perPage = parseInt(limit) || 10;
        const offset = (pageNumber - 1) * perPage;
        let whereCondition;
        if (id) {
            whereCondition = {
                Id: id
            }
        }
        else {
            if (searchQuery) {
                whereCondition = {
                    [Sequelize.Op.or]: [
                        { Id: { [Sequelize.Op.like]: `%${searchQuery}%` } },


                    ]
                };
            }
        }
        try {
            const temp = await Order.findAndCountAll({
                where: whereCondition, // Apply search condition if query exists
                distinct: true,
                limit: id != null ? 1 : perPage,
                offset: id != null ? 0 : offset,
                order: [
                    ['Id', 'DESC']
                ],
                include: [
                    {
                        model: OrderItem,
                        include: [
                            {
                                model: Product, include: [
                                    Media
                                ]
                            },
                            {
                                model: Variations,
                                include: [
                                    {
                                        model: ProductVariationValues,
                                        include: [
                                            {
                                                model: Values,
                                                include: [Attribute

                                                ]
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    },
                    OrderStatus,
                    User
                ]
            });
            if (temp) {
                const totalPages = Math.ceil(temp.count / perPage);
                const tempData = temp.rows.map(order => {
                    const orderData = order.get({ plain: true });
                    return {
                        ...orderData,
                        orderItems: orderData.orderItems.map(orderItem => ({
                            ...orderItem,
                            variation: {
                                ...orderItem.variation, Values: orderItem.variation.product_variation_values
                                    ?.map(pvv => pvv.value) || []
                            }
                        }))
                    };
                });
                return {
                    total: id != null ? 1 : temp.count,
                    totalPages: id != null ? 1 : totalPages,
                    currentPage: id != null ? 1 : pageNumber,
                    data: tempData
                };
            } else { throw new OrderFailure() }
        } catch (error) {
            console.log(error);
            throw error;
        }
    }


    static async updateOrderStatus(orderId, orderStatusId, responseNote = null, lang) {
        const transaction = await sequelize.transaction();
        try {
            // First verify if the order exists
            let order = await Order.findOne({
                where: { Id: orderId },
                transaction
            });

            if (!order) {
                throw new OrderNotFound();
            }
            order = order.get({ plain: true });
            // Verify if the status exists
            let status = await OrderStatus.findOne({
                where: { Id: orderStatusId },
                transaction
            });

            if (!status) {
                throw new OrderStatusNotFound();
            }
            status = status.get({ plain: true });
            let user = await User.findOne({
                where: { Id: order.userId },
                transaction
            });
            if (!user) {
                throw new UserNotFound();
            }
            user = user.get({ plain: true });

            // Update the order status and response note
            const updateData = {
                orderStatusId: orderStatusId
            };

            if (responseNote !== null) {
                updateData.ResponseNote = responseNote;
            }

            const updatedOrder = await Order.update(
                updateData,
                {
                    where: { Id: orderId },
                    transaction
                }
            );

            if (!updatedOrder[0]) {
                throw new OrderStatusUpdateFailure();
            }

            await transaction.commit();
            
            // Send notification to user
            if (user.FcmToken) {
                    const title =  user.Lang === "en" ? "Order Status Updated" : "تم تحديث حالة الطلب";
                    const body = user.Lang === "en"
                    ? `Your order #${orderId} status has been updated to ${status.NameEn}`
                    : `تم تحديث حالة طلبك رقم ${orderId} إلى ${status.NameAr}`;
                    NotificationService.sendToDevice(user.FcmToken,title,body,{});
            }

            // Return the updated order with its details
            const updatedOrderDetails = await Order.findOne({
                where: { Id: orderId },
                include: [
                    {
                        model: OrderItem,
                        include: [
                            {
                                model: Product,
                                include: [Media]
                            },
                            {
                                model: Variations,
                                include: [
                                    {
                                        model: ProductVariationValues,
                                        include: [
                                            {
                                                model: Values,
                                                include: [Attribute]
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    },
                    OrderStatus,
                ]
            });
            const orderData = updatedOrderDetails.get({ plain: true }); // converts Sequelize instance to plain object

            return {
                ...orderData,
                orderItems: orderData.orderItems.map(orderItem => ({
                    ...orderItem,

                    variation: {
                        ...orderItem.variation, Values: orderItem.variation.product_variation_values
                            ?.map(pvv => pvv.value) || []
                    }
                }))
            };
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }
}
module.exports = OrderRepo;