
const SystemUtil = require("../util/system");
const Values = require('../models/values.model');
const Variations = require('../models/vairation.model');
const ProductVariationValues = require("../models/productVariationValues.model");
const Cart = require("../models/cart.model");
const CartItem = require("../models/cartItem.model");
const {sequelize,Sequelize} = require("../config/sequelize.config");
const Product = require("../models/product.model");
const Media = require("../models/media.model");





class CartRepo {
    static async addToCart(body) {
        const transaction = await sequelize.transaction(); // Start transaction
        try {
            let cartId = null;
            const CartFound = await Cart.findOne({ where: { userId: body.userId } });
            if (!CartFound) {
                const cart = await Cart.create({ userId: body.userId }, { transaction });
                cartId = cart.dataValues.Id;
            } else {
                cartId = CartFound.dataValues.Id;
            }
            const cartItems = body.variations.map(e => ({ ...e, cartId }));
            for (let index = 0; index < cartItems.length; index++) {
                let checkExist = await CartItem.findOne({
                    where: {
                        variationId: cartItems[index].variationId
                    }, transaction
                })
                if (checkExist) {
                    await CartItem.update(cartItems[index], {
                        where: {
                            variationId: cartItems[index].variationId
                        }, transaction
                    })
                }
                else {
                    await CartItem.create(cartItems[index], { transaction })
                }
            }
            const cartWithVariation = await Cart.findOne({
                where: {
                    userId: body.userId
                },
                include: [{
                    model: CartItem, include: [{
                        model: Variations,
                        include: [
                            {
                                model: ProductVariationValues,
                                include: [
                                    Values
                                ],
                            },
                        ],
                    }, { model: Product, include: [Media] }]
                }],
                transaction
            })
            await transaction.commit(); // Commit transaction only after all queries finish            
            let data = { ...cartWithVariation.dataValues };
            const tempCartItems = data.CartItems.map((cartItem) => ({
                ...cartItem.dataValues, variation: {
                    ...cartItem.variation.dataValues, Values: cartItem.variation.product_variation_values.map((value) => {
                        return ({
                            Id: value.value.Id,
                            ValueAr: value.value.ValueAr,
                            ValueEn: value.value.ValueEn,
                            HoverImageAr: value.value.HoverImageAr,
                            HoverImageEn: value.value.HoverImageEn,
                        })
                    }),
                }
            }));
            data.CartItems = tempCartItems
            return data;
        } catch (error) {
            console.log(error);
            if (transaction)
                await transaction.rollback(); // Rollback transaction on error
            return null;
        }



    }
    static async removeFromCart(body) {
        try {
            const carItems = body.variations
            const userId = body.userId;
            const userCart = await Cart.findOne({
                where: {
                    userId: userId
                }
            })
            if (userCart) {
                for (let index = 0; index < carItems.length; index++) {
                    await CartItem.destroy({
                        where: {
                            variationId: carItems[index],
                            cartId: userCart.Id
                        }
                    })
                }
                const cartWithVariation = await Cart.findOne({
                    where: {
                        userId: userId
                    },
                    include: [{
                        model: CartItem, include: [{
                            model: Variations,
                            include: [
                                {
                                    model: ProductVariationValues,
                                    include: [
                                        Values
                                    ],
                                },
                            ],
                        }, { model: Product, include: [Media] }]
                    }],
                })
                let data = { ...cartWithVariation.dataValues };
                const tempCartItems = data.CartItems.map((cartItem) => ({
                    ...cartItem.dataValues, variation: {
                        ...cartItem.variation.dataValues, Values: cartItem.variation.product_variation_values.map((value) => {
                            return ({
                                Id: value.value.Id,
                                ValueAr: value.value.ValueAr,
                                ValueEn: value.value.ValueEn,
                                HoverImageAr: value.value.HoverImageAr,
                                HoverImageEn: value.value.HoverImageEn,
                            })
                        }),
                    }
                }));
                data.CartItems = tempCartItems
                return data;
            }
            else return false;
        } catch (error) {
            console.log(error);
            return null;
        }



    }
    static async getUserCart(userId) {

        try {
            // await new Promise(resolve => setTimeout(resolve, 2000));

            const cartWithVariation = await Cart.findOne({
                where: {
                    userId: userId
                },
                include: [{
                    model: CartItem, include: [{
                        model: Variations,
                        include: [
                            {
                                model: ProductVariationValues,
                                include: [
                                    Values
                                ],
                            },
                        ],
                    }, { model: Product, include: [Media] }]
                }],
            })
            if (!cartWithVariation)
                return false;
            else {
                let data = { ...cartWithVariation.dataValues };
                const tempCartItems = data.CartItems.map((cartItem) => ({
                    ...cartItem.dataValues, variation: {
                        ...cartItem.variation.dataValues, Values: cartItem.variation.product_variation_values.map((value) => {
                            return ({
                                Id: value.value.Id,
                                ValueAr: value.value.ValueAr,
                                ValueEn: value.value.ValueEn,
                                HoverImageAr: value.value.HoverImageAr,
                                HoverImageEn: value.value.HoverImageEn,
                            })
                        }),
                    }
                }));
                data.CartItems = tempCartItems
                return data;
            }
        } catch (error) {
            console.log(error);
            return null;
        }



    }
    static async create(body, { transaction } = {}) {
        let insertData = {
            "Price": body.Price,
            "Stock": body.Stock,
            "productId": body.productId
        };
        try {

            const temp = transaction ? await Variations.create(insertData, { transaction: transaction })
                : await Variations.create(insertData);
            if (temp) {
                let createdValues = temp;
                createdValues.IsActive = !!createdValues.IsActive;
                createdValues.attributeId = parseInt(createdValues.attributeId);
                return createdValues.dataValues;
            }
            else {
                throw "UnKnown Error"
                // return false;
            }
        } catch (error) {
            throw error
        }
    }

    static async edit(body) {
        let insertData = {
            "Price": body.Price,
            "Stock": body.Stock,
            "productId": body.productId,
            "IsActive": !!body.IsActive

        };
        try {
            const data = await Variations.findOne({
                where: {
                    Id: body.Id
                }
            });
            if (data) {
                const temp = await Variations.update(insertData, {
                    where: {
                        Id: body.Id
                    }
                });
                if (temp) {
                    const data = await Variations.findOne({
                        where: {
                            Id: body.Id
                        }
                    });
                    let createdValues = data.dataValues;
                    createdValues.IsActive = !!createdValues.IsActive;
                    return createdValues;
                }
                else {
                    return false;
                }
            } else {
                return false;
            }
        } catch (error) {
            return null;
        }
    }


    static async deleteVariation(id) {
        try {
            const deletedItem = await Variations.destroy(
                {
                    where: {
                        Id: id
                    }
                }
            );
            if (deletedItem) {
                return true;
            }
            else return false;
        } catch (error) {
            return null;
        }

    }

}
module.exports = CartRepo