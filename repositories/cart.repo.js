
const SystemUtil = require("../util/system");
const Values = require('../models/values.model');
const Variations = require('../models/vairation.model');
const ProductVariationValues = require("../models/productVariationValues.model");
const Cart = require("../models/cart.model");
const CartItem = require("../models/cartItem.model");
const { sequelize, Sequelize } = require("../config/sequelize.config");
const Product = require("../models/product.model");
const Media = require("../models/media.model");
const CartNotExist = require("../exceptions/CartNotExist");
const VariationNotExist = require("../exceptions/VariationNotExist");
const CreateCartFailure = require("../exceptions/CreateCartFailure");





class CartRepo {
    static async addToCart(userId,body) {
        const transaction = await sequelize.transaction(); // Start transaction
        try {
            let cartId = null;
            const CartFound = await Cart.findOne({ where: { userId: userId } });
            if (!CartFound) {
                const cart = await Cart.create({ userId: userId }, { transaction });
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
            if (transaction)
                await transaction.rollback(); // Rollback transaction on error
            throw error
        }



    }
    static async removeFromCart(user,body) {
        try {
            const carItems = body.variations
            const userId = user.Id
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
                if (!cartWithVariation) {
                    throw new VariationNotExist()
                }
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
            else throw new CartNotExist()
        } catch (error) {
            throw error
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
                throw new CartNotExist()
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
            throw error;
        }



    }

}
module.exports = CartRepo