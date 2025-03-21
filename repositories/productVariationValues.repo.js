
const SystemUtil = require("../util/system");
const Values = require('../models/values.model');
const Variations = require('../models/vairation.model');
const ProductVariationValues = require("../models/productVariationValues.model");
const ProductVariationNotExist = require("../exceptions/ProductVariationNotExist");
const CreateProductVariationFailure = require("../exceptions/CreateProductVariationFailure");





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
                throw new ProductVariationNotExist()
            }
        } catch (error) {
            throw error
        }

    }
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
                throw new CreateProductVariationFailure()
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
            else throw new ProductVariationNotExist()
        } catch (error) {
            throw error
        }

    }

}
module.exports = ProductVariationsValueRepo