const attributeRepo = require('../repositories/attribute.repo')
const ResponseModel = require("../models/response.model");
const MyLogger = require("../util/logging.utility");
const CreateAttributeFailure = require('../exceptions/CreateAttributeFailure');
const AttributesNotExist = require('../exceptions/AtrributesNotExist');
const AttributeNotExist = require('../exceptions/AttributeNotExist');





class AttributeController {
    static async getProductAttribute(req, res) {
        const lang = req.headers.lang;
        const productId = req.params.productId;
        try {
            const data = await attributeRepo.getProductAttributes(productId);
            const temp = ResponseModel.getSuccessResponse(lang === "en" ? '' : "", data);
            MyLogger.info(`${temp.code}|${temp.message}|${JSON.stringify(temp.data)}`)
            res.status(200).json(temp);
        } catch (error) {
            let temp = ResponseModel.getServerSideError(lang === "en" ? "Unknown Error Happened" : "مشكلة غير معروفة", error);
            if (error instanceof AttributesNotExist) {
                temp = ResponseModel.getNotFoundResponse(lang === "en" ? "Attribute not exist" : "الواصفة غير موجودة", error)
                MyLogger.info(`${temp.code}|${temp.message}|${JSON.stringify(temp.data)}`)
            }
            else {
                MyLogger.error(`${temp.code}|${temp.message}|${JSON.stringify(temp.data)}`)
            }
            res.status(500).json(temp);
        }
    }
    // media upload finished and we arrived to the attributes processing now
    static async create(req, res) {
        const lang = req.headers.lang;
        const body = req.body; try {
            const data = await attributeRepo.create(body);
            const temp = ResponseModel.getSuccessResponse(lang === "en" ? '' : "", data);
            MyLogger.info(`${temp.code}|${temp.message}|${JSON.stringify(temp.data)}`)
            res.status(200).json(temp);
        } catch (error) {
            let temp = ResponseModel.getServerSideError(lang === "en" ? "Unknown Error Happened" : "مشكلة غير معروفة", error);
            if (error instanceof CreateAttributeFailure) {
                temp = ResponseModel.getServerSideError(lang === "en" ? "Error creating attribute" : "حدثت مشكلة في إنشاء الواصفة", error)
                MyLogger.info(`${temp.code}|${temp.message}|${JSON.stringify(temp.data)}`)
            }
            else {
                MyLogger.error(`${temp.code}|${temp.message}|${JSON.stringify(temp.data)}`)
            }
            res.status(500).json(temp);
        }



    }
    static async edit(req, res) {
        const lang = req.headers.lang;
        const body = req.body;
        try {
            const data = await attributeRepo.edit(body);
            const temp = ResponseModel.getSuccessResponse(lang === "en" ? '' : "", data);
            MyLogger.info(`${temp.code}|${temp.message}|${JSON.stringify(temp.data)}`)
            res.status(200).json(temp);
        } catch (error) {
            let temp = ResponseModel.getServerSideError(lang === "en" ? "Unknown Error Happened" : "مشكلة غير معروفة", error);
            if (error instanceof AttributesNotExist) {
                temp = ResponseModel.getNotFoundResponse(lang === "en" ? "Attribute not exist" : "الواصفة غير موجودة", error)
                MyLogger.info(`${temp.code}|${temp.message}|${JSON.stringify(temp.data)}`)
            }
            else {
                MyLogger.error(`${temp.code}|${temp.message}|${JSON.stringify(temp.data)}`)
            }
            res.status(500).json(temp);
        }


    }
    static async createImageAttribute(req, res) {
        const lang = req.headers.lang;
        const body = req.body;

        try {
            const data = await attributeRepo.createImageAttribute(body, req.files["mediaAr[]"], req.files["itemsAr[]"], req.files["mediaEn[]"], req.files["itemsEn[]"]);
            const temp = ResponseModel.getSuccessResponse(lang === "en" ? '' : "", data);
            MyLogger.info(`${temp.code}|${temp.message}|${JSON.stringify(temp.data)}`)
            res.status(200).json(temp);
        } catch (error) {
            let temp = ResponseModel.getServerSideError(lang === "en" ? "Unknown Error Happened" : "مشكلة غير معروفة", error);
            if (error instanceof CreateAttributeFailure) {
                temp = ResponseModel.getServerSideError(lang === "en" ? "Error creating attribute" : "حدثت مشكلة في إنشاء الواصفة", error)
                MyLogger.info(`${temp.code}|${temp.message}|${JSON.stringify(temp.data)}`)
            }
            else {
                MyLogger.error(`${temp.code}|${temp.message}|${JSON.stringify(temp.data)}`)
            }
            res.status(500).json(temp);
        }


    }
    static async deleteImageAttributes(req, res) {
        const lang = req.headers.lang;
        const id = req.params.id;
        try {
            const data = await attributeRepo.deleteImageAttribute(id);
            const temp = ResponseModel.getSuccessResponse(lang === "en" ? '' : "", data);
            MyLogger.info(`${temp.code}|${temp.message}|${JSON.stringify(temp.data)}`)
            res.status(200).json(temp);
        } catch (error) {
            let temp = ResponseModel.getServerSideError(lang === "en" ? "Unknown Error Happened" : "مشكلة غير معروفة", error);
            if (error instanceof AttributeNotExist) {
                temp = ResponseModel.getNotFoundResponse(lang === "en" ? "Attribute not Exist" : "الواصفة غير موجودة", error)
                MyLogger.info(`${temp.code}|${temp.message}|${JSON.stringify(temp.data)}`)
            }
            else {
                MyLogger.error(`${temp.code}|${temp.message}|${JSON.stringify(temp.data)}`)
            }
            res.status(500).json(temp);
        }

    }
    static async deleteAttributes(req, res) {
        const lang = req.headers.lang;
        const id = req.params.id;
        try {
            const data = await attributeRepo.deleteAttribute(id);
            const temp = ResponseModel.getSuccessResponse(lang === "en" ? '' : "", data);
            MyLogger.info(`${temp.code}|${temp.message}|${JSON.stringify(temp.data)}`)
            res.status(200).json(temp);
        } catch (error) {
            let temp = ResponseModel.getServerSideError(lang === "en" ? "Unknown Error Happened" : "مشكلة غير معروفة", error);
            if (error instanceof AttributeNotExist) {
                temp = ResponseModel.getNotFoundResponse(lang === "en" ? "Attribute not Exist" : "الواصفة غير موجودة", error)
                MyLogger.info(`${temp.code}|${temp.message}|${JSON.stringify(temp.data)}`)
            }
            else {
                MyLogger.error(`${temp.code}|${temp.message}|${JSON.stringify(temp.data)}`)
            }
            res.status(500).json(temp);

        }
    }
}
module.exports = AttributeController