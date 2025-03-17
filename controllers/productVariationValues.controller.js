const {sequelize} = require('../config/sequelize.config');
const attributeRepo = require('../repositories/attribute.repo');
const ProductVariationsValueRepo = require('../repositories/productVariationValues.repo');
const ValuesRepo = require('../repositories/values.repo');
const VariationsRepo = require('../repositories/variations.repo');





class ProductVariationValuesController {
    static async getVariationsForValue(req, res) {
        const valueId = req.params.valueId;
        const productVariations = await ProductVariationsValueRepo.getVariationsForValue(valueId);
        if (productVariations) {
            res.status(200).json({ code: 200, message: "Data selected Successfully", data: productVariations, });
        } else if (productVariations === false) {
            res.status(200).json({ code: 204, message: 'No Variations Found', status: false });
        }
        else {
            res.status(500).json({ message: 'Unknown Error Happened' });
        }
    }
    //


    static async create(req, res) {
        console.log("--------------------------------------------");
        console.log("-------api has been called-----------------");
        console.log("--------------------------------------------");
        const body = req.body;
        const transaction = await sequelize.transaction();
        try {
            for (const element of body) {
                let variation = null;
                variation = await VariationsRepo.create(element.variation, { transaction: transaction })
                for (const value of element.valueId) {
                    let insertData = {
                        "valueId": value,
                        "variationId": variation.Id
                    };
                    await ProductVariationsValueRepo.create(insertData, { transaction: transaction });
                }
            }
            await transaction.commit();
            res.status(200).json({ code: 200, message: "Data Inserted Successfully", data: {}, });
        } catch (error) {
            await transaction.rollback();
            res.status(500).json({ message: 'Unknown Error Happened', data: error, });
        }
        return;
        // const temp = await ProductVariationsValueRepo.create(body);
        // if (temp) {
        //     res.status(200).json({ code: 200, message: "Data Inserted Successfully", data: temp, });
        // } else if (temp === false) {
        //     res.status(500).json({ message: 'Error Creating variation Link' });
        // }
        // else {
        //     res.status(500).json({ message: 'Unknown Error Happened' });
        // }


    }
    static async deleteVariations(req, res) {
        const id = req.params.id;
        const deletedItem = await ProductVariationsValueRepo.deleteVariation(id);
        if (deletedItem) {
            res.status(200).json({ code: 200, message: "Variation Link deleted successfully", data: null, });
        } else if (deletedItem === false) {
            res.status(200).json({ code: 204, message: "Variation Link not found", data: null, });
        } else {
            res.status(500).json({ code: 500, message: "Error happened", data: null, });
        }

    }

}
module.exports = ProductVariationValuesController