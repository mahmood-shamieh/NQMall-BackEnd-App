const { sequelize } = require('../config/sequelize.config');
const attributeRepo = require('../repositories/attribute.repo');
const ProductVariationsValueRepo = require('../repositories/productVariationValues.repo');
const ValuesRepo = require('../repositories/values.repo');
const VariationsRepo = require('../repositories/variations.repo');
const ResponseModel = require("../models/response.model");
const MyLogger = require("../util/logging.utility");
const ProductVariationNotExist = require('../exceptions/ProductVariationNotExist');
const CreateProductVariationFailure = require('../exceptions/CreateProductVariationFailure');
const CreateVariationFailure = require('../exceptions/CreateVariationFailure');





class ProductVariationValuesController {
    static async getVariationsForValue(req, res) {
        const lang = req.headers.lang;
        const valueId = req.params.valueId;
        try {
            const data = await ProductVariationsValueRepo.getVariationsForValue(valueId);
            const temp = ResponseModel.getSuccessResponse(lang === "en" ? 'Variations Are' : "التشكيلة هي", data);
            MyLogger.info(`${temp.code}|${temp.message}|${JSON.stringify(temp.data)}`)
            res.status(200).json(temp);
        } catch (error) {
            let temp = ResponseModel.getServerSideError(lang === "en" ? "Unknown Error Happened" : "مشكلة غير معروفة", error);
            if (error instanceof ProductVariationNotExist) {
                temp = ResponseModel.getNotFoundResponse(lang === "en" ? "Product variations not exist" : "تشكيلة المنتج غير موجودة", error)
                MyLogger.info(`${temp.code}|${temp.message}|${JSON.stringify(temp.data)}`)
            } else {
                MyLogger.error(`${temp.code}|${temp.message}|${JSON.stringify(temp.data)}`)
            }
            res.status(500).json(temp);

        }

    }
    //


    static async create(req, res) {
        const lang = req.headers.lang;
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
            const temp = ResponseModel.getSuccessResponse(lang === "en" ? 'Product Variations Are' : "تشكيلة المنتج هي", {});
            MyLogger.info(`${temp.code}|${temp.message}|${JSON.stringify(temp.data)}`)
            res.status(200).json(temp);
        } catch (error) {
            await transaction.rollback();
            let temp = ResponseModel.getServerSideError(lang === "en" ? "Unknown Error Happened" : "مشكلة غير معروفة", error);
            if (error instanceof CreateProductVariationFailure) {
                temp = ResponseModel.getServerSideError(lang === "en" ? "Product variations Failure" : "خطأ في تشكيلة المنتج", error)
                MyLogger.info(`${temp.code}|${temp.message}|${JSON.stringify(temp.data)}`)
            } else if (error instanceof CreateVariationFailure) {
                temp = ResponseModel.getServerSideError(lang === "en" ? "Error creating variations" : "مشكلة في إنشاء التشكيلة", error)
                MyLogger.info(`${temp.code}|${temp.message}|${JSON.stringify(temp.data)}`)
            } else {
                MyLogger.error(`${temp.code}|${temp.message}|${JSON.stringify(temp.data)}`)
            }
            res.status(500).json(temp);

        }

    }
    static async deleteVariations(req, res) {
        const lang = req.headers.lang;
        const id = req.params.id;
        try {
            const data = await ProductVariationsValueRepo.deleteVariation(id);
            const temp = ResponseModel.getSuccessResponse(lang === "en" ? 'Product variation deleted successfully' : "تمت إزالة تشكيلة المنتج بنجاح", data);
            MyLogger.info(`${temp.code}|${temp.message}|${JSON.stringify(temp.data)}`)
            res.status(200).json(temp);
        } catch (error) {
            let temp = ResponseModel.getServerSideError(lang === "en" ? "Unknown Error Happened" : "مشكلة غير معروفة", error);
            if (error instanceof ProductVariationNotExist) {
                temp = ResponseModel.getNotFoundResponse(lang === "en" ? "Product variations not exist" : "تشكيلة المنتج غير موجودة", error)
            } else {
                MyLogger.error(`${temp.code}|${temp.message}|${JSON.stringify(temp.data)}`)
            }
            res.status(500).json(temp);

        }

    }

}
module.exports = ProductVariationValuesController