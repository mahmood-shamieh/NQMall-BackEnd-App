
const SystemUtil = require("../util/system");
const Values = require('../models/values.model');
const Variations = require('../models/vairation.model');
const ProductVariationValues = require("../models/productVariationValues.model");





class ProductVariationsValueRepo {
    static async getVariationsForValue(valueId) {
        try {
            const productVariations = await ProductVariationValues.findAll({
                where: {
                    valueId: valueId
                }
            });
            if (productVariations && productVariations.length) {

                const data = new Array();
                productVariations.forEach(element => {
                    data.push({ ...element.dataValues });
                });
                return data;
            }
            else {
                return false;
            }
        } catch (error) {
            return null;
        }

    }
    static counter = 1;
    static async create(body, { transaction } = {}) {


        let insertData = {
            "valueId": body.valueId,
            "variationId": body.variationId
        };
        try {
            const temp = transaction ? await ProductVariationValues.create(insertData, { transaction: transaction }) : await ProductVariationValues.create(insertData);
            if (temp) {
                let createdValues = temp;
                createdValues.IsActive = !!createdValues.IsActive;
                return createdValues;
            }
            else {
                throw 'Unhandled Transaction'
            }

        }
        catch (error) {
            throw error
        }
    }




    static async deleteVariation(id) {
        try {
            const deletedItem = await ProductVariationValues.destroy(
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
module.exports = ProductVariationsValueRepo