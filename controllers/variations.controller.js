const attributeRepo = require('../repositories/attribute.repo');
const ValuesRepo = require('../repositories/values.repo');
const VariationsRepo = require('../repositories/variations.repo');
const ResponseModel = require("../models/response.model");
const MyLogger = require("../util/logging.utility");
const VariationNotExist = require('../exceptions/VariationNotExist');
const VariationFailure = require('../exceptions/VariationFailure');
const CreateVariationFailure = require('../exceptions/CreateVariationFailure');





class ValuesController {
    static async getProductVariations(req, res) {
        const lang = req.headers.lang;
        const productId = req.params.productId;
        try {
            const data = await VariationsRepo.getProductVariations(productId);
            const temp = ResponseModel.getSuccessResponse(lang === "en" ? 'Variations Are' : "التشكيلة هي", data);
            MyLogger.info(`${temp.code}|${temp.message}|${JSON.stringify(temp.data)}`)
            res.status(200).json(temp);
        } catch (error) {
            let temp = ResponseModel.getServerSideError(lang === "en" ? "Unknown Error Happened" : "مشكلة غير معروفة", error);
            if (error instanceof VariationNotExist) {
                temp = ResponseModel.getNotFoundResponse(lang === "en" ? "Variations not exist" : "هذه التشكيلة غير موجودة", error)
                MyLogger.info(`${temp.code}|${temp.message}|${JSON.stringify(temp.data)}`)
            } else {
                MyLogger.error(`${temp.code}|${temp.message}|${JSON.stringify(temp.data)}`)
            }
            res.status(500).json(temp);
        }
    }
    //
    static async updateVariation(req, res) {
        const lang = req.headers.lang;
        const body = req.body;
        try {
            const data = await VariationsRepo.edit(body);
            const temp = ResponseModel.getSuccessResponse(lang === "en" ? 'Variations Are' : "التشكيلة هي", data);
            MyLogger.info(`${temp.code}|${temp.message}|${JSON.stringify(temp.data)}`)
            res.status(200).json(temp);
        } catch (error) {
            let temp = ResponseModel.getServerSideError(lang === "en" ? "Unknown Error Happened" : "مشكلة غير معروفة", error);
            if (error instanceof VariationNotExist) {
                temp = ResponseModel.getNotFoundResponse(lang === "en" ? "Variations not exist" : "هذه التشكيلة غير موجودة", error)
                MyLogger.info(`${temp.code}|${temp.message}|${JSON.stringify(temp.data)}`)
            } else if (error instanceof VariationFailure) {
                temp = ResponseModel.getServerSideError(lang === "en" ? "Variations Error" : "مشكلة في التشكيلة", error)
                MyLogger.info(`${temp.code}|${temp.message}|${JSON.stringify(temp.data)}`)
            } else {
                MyLogger.error(`${temp.code}|${temp.message}|${JSON.stringify(temp.data)}`)
            }
            res.status(500).json(temp);
        }
    }

    static async create(req, res) {
        const lang = req.headers.lang;
        const body = req.body;
        try {
            const data = await VariationsRepo.create(body);
            const temp = ResponseModel.getSuccessResponse(lang === "en" ? 'Variations Are' : "التشكيلة هي", data);
            MyLogger.info(`${temp.code}|${temp.message}|${JSON.stringify(temp.data)}`)
            res.status(200).json(temp);
        } catch (error) {
            let temp = ResponseModel.getServerSideError(lang === "en" ? "Unknown Error Happened" : "مشكلة غير معروفة", error);
            if (error instanceof CreateVariationFailure) {
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
            const data = await VariationsRepo.deleteVariation(id);
            const temp = ResponseModel.getSuccessResponse(lang === "en" ? 'Variations deleted successfully' : "تم حذف التشكيلة", data);
            MyLogger.info(`${temp.code}|${temp.message}|${JSON.stringify(temp.data)}`)
            res.status(200).json(temp);
        } catch (error) {
            let temp = ResponseModel.getServerSideError(lang === "en" ? "Unknown Error Happened" : "مشكلة غير معروفة", error);
            if (error instanceof VariationNotExist) {
                temp = ResponseModel.getNotFoundResponse(lang === "en" ? "Variations not exist" : "هذه التشكيلة غير موجودة", error)
                MyLogger.info(`${temp.code}|${temp.message}|${JSON.stringify(temp.data)}`)
            } else {
                MyLogger.error(`${temp.code}|${temp.message}|${JSON.stringify(temp.data)}`)
            }
            res.status(500).json(temp);
        }
    }

}
module.exports = ValuesController