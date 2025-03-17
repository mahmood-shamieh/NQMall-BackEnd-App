
const SystemUtil = require("../util/system");
const Values = require('../models/values.model');
const Variations = require('../models/vairation.model');
const ProductVariationValues = require("../models/productVariationValues.model");





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
                    temp = {...element.dataValues,product_variation_values:element.dataValues.product_variation_values,Values:element.dataValues.product_variation_values.map(variation=>{
                        return variation.value
                    })}
                    data.push(temp);
                });
                return data;
            }
            else {
                return false;
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
module.exports = VariationsRepo