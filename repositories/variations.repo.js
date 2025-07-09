
const SystemUtil = require("../util/system");
const Values = require('../models/values.model');
const Variations = require('../models/vairation.model');
const ProductVariationValues = require("../models/productVariationValues.model");
const VariationNotExist = require("../exceptions/VariationNotExist");
const CreateVariationFailure = require("../exceptions/CreateVariationFailure");
const VariationFailure = require("../exceptions/VariationFailure");
const { where } = require("sequelize");
const Product = require("../models/product.model");
const Attribute = require("../models/attribute.model");
const Media = require("../models/media.model");






class VariationsRepo {
    static async getProductVariations(productId) {
        try {
            const productVariations = await Variations.findAll({
                where: {
                    productId: productId
                }
                , include: [
                    {
                        model: ProductVariationValues,
                        include: [
                            Values
                        ],
                    },
                ]
            });
            if (productVariations && productVariations.length) {

                const data = new Array();
                productVariations.forEach(element => {
                    let temp = {};
                    temp = {
                        ...element.dataValues, product_variation_values: element.dataValues.product_variation_values, Values: element.dataValues.product_variation_values.map(variation => {
                            return variation.value
                        })
                    }
                    data.push(temp);
                });
                return data;
            }
            else {
                throw new VariationNotExist();
            }
        } catch (error) {
            throw error
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
                throw new CreateVariationFailure()
            }
        } catch (error) {
            if (error.name === "SequelizeForeignKeyConstraintError")
                throw new CreateVariationFailure()
            else
                throw error
        }
    }
    static async deleteAllVariationsAndItsLinks(productId, { transaction } = {}) {
        try {
            const temp = transaction ? await Variations.destroy({
                where: {
                    productId: productId
                }, transaction: transaction
            })
                : await Variations.destroy({
                    where: {
                        productId: productId
                    }
                });
            console.log(temp)
            return true;
        } catch (error) {
            if (error.name === "SequelizeForeignKeyConstraintError")
                throw new CreateVariationFailure()
            else
                throw error
        }
    }
    static async getVariationByProductIdAndVariationId(variationId, productId, { transaction } = {}) {
        try {
            let whereCondition = { Id: variationId };
            if (productId) {
                whereCondition.productId = productId;
            }
            const temp = transaction ?
                await Variations.findOne({
                    where: whereCondition,
                    transaction, include: [
                        {
                            model: Product,
                            include: [
                                Media
                            ]
                        },
                        {
                            model: ProductVariationValues,
                            include: [
                                {
                                    model: Values, include: [
                                        Attribute
                                    ]
                                }
                            ]
                        }
                    ]
                })
                : await Variations.findOne({
                    where: whereCondition, include: [
                        {
                            model: Product,
                            include: [
                                Media
                            ]
                        },
                        {
                            model: ProductVariationValues,
                            include: [
                                {
                                    model: Values, include: [
                                        Attribute
                                    ]
                                }
                            ]
                        }
                    ]
                });
            if (!temp) {
                throw new VariationNotExist()
            }
            return { ...temp.dataValues, Values: temp.dataValues.product_variation_values.map((e) => e.value) };
        } catch (error) {
            if (error.name === "SequelizeForeignKeyConstraintError")
                throw new CreateVariationFailure()
            else
                throw error
        }
    }

    static async edit(body, { transaction } = {}) {
        let insertData = {
            "Price": body.Price,
            "Stock": body.Stock,
            "productId": body.productId,
            "IsActive": !!body.IsActive

        };
        try {
            const data = transaction ? await Variations.findOne({
                transaction,
                where: {
                    Id: body.Id
                }
            }) : await Variations.findOne({
                where: {
                    Id: body.Id
                }
            });
            if (data && data.length !== 0) {
                const temp = transaction ? await Variations.update(insertData, {
                    transaction,
                    where: {
                        Id: body.Id
                    }
                }) : await Variations.update(insertData, {
                    where: {
                        Id: body.Id
                    }
                });
                if (temp) {
                    const data = transaction ? await Variations.findOne({
                        transaction,
                        where: {
                            Id: body.Id
                        }
                    }) : await Variations.findOne({
                        where: {
                            Id: body.Id
                        }
                    });
                    let createdValues = data.dataValues;
                    createdValues.IsActive = !!createdValues.IsActive;
                    // if (transaction) {
                    //     await transaction.commit();
                    // }
                    return createdValues;
                }
                else {
                    throw new VariationFailure()
                }
            } else {
                throw new VariationNotExist()
            }
        } catch (error) {
            // if (transaction) {
            //     await transaction.rollback();
            // }
            throw error
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
            else throw new VariationNotExist()
        } catch (error) {
            throw error
        }

    }

}
module.exports = VariationsRepo