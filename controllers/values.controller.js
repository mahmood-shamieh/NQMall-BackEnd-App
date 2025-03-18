const attributeRepo = require('../repositories/attribute.repo');
const ValuesRepo = require('../repositories/values.repo');
const ResponseModel = require("../models/response.model");
const MyLogger = require("../util/logging.utility");
const ValueNotExist = require('../exceptions/ValueNotExist');
const CreateValueFailure = require('../exceptions/CreateValueFailure');
const ValueFailure = require('../exceptions/ValueFailure');





class ValuesController {
    static async getProductAttributeValues(req, res) {
        const attributeId = req.params.attributeId;
        const lang = req.headers.lang;
        try {
            const data = await ValuesRepo.getProductAttributeValues(attributeId);
            const temp = ResponseModel.getSuccessResponse(lang === "en" ? '' : "", data);
            MyLogger.info(`${temp.code}|${temp.message}|${JSON.stringify(temp.data)}`)
            res.status(200).json(temp);
        } catch (error) {
            let temp = ResponseModel.getServerSideError(lang === "en" ? "Unknown Error Happened" : "مشكلة غير معروفة", error);
            if (error instanceof ValueNotExist) {
                temp = ResponseModel.getNotFoundResponse(lang === "en" ? "Value not exist" : "لا يوجد قيم", error)
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
        const body = req.body;
        const files = req.files;
        try {
            const data = await ValuesRepo.create(body, files['HoverImageAr'], files['HoverImageEn']);
            const temp = ResponseModel.getSuccessResponse(lang === "en" ? '' : "", data);
            MyLogger.info(`${temp.code}|${temp.message}|${JSON.stringify(temp.data)}`)
            res.status(200).json(temp);
        } catch (error) {
            let temp = ResponseModel.getServerSideError(lang === "en" ? "Unknown Error Happened" : "مشكلة غير معروفة", error);
            if (error instanceof CreateValueFailure) {
                temp = ResponseModel.getServerSideError(lang === "en" ? "Error Creating Value" : "مشكلة في إنشاء القيمة", error)
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
        const files = req.files;
        try {
            const data = await ValuesRepo.edit(body, files['HoverImageAr'], files['HoverImageEn']);
            const temp = ResponseModel.getSuccessResponse(lang === "en" ? '' : "", data);
            MyLogger.info(`${temp.code}|${temp.message}|${JSON.stringify(temp.data)}`)
            res.status(200).json(temp);
        } catch (error) {
            let temp = ResponseModel.getServerSideError(lang === "en" ? "Unknown Error Happened" : "مشكلة غير معروفة", error);
            if (error instanceof ValueFailure) {
                temp = ResponseModel.getServerSideError(lang === "en" ? "Error editing value" : "مشكلة في تعديل القيمة", error)
                MyLogger.info(`${temp.code}|${temp.message}|${JSON.stringify(temp.data)}`)
            }
            else if (error instanceof ValueNotExist) {
                temp = ResponseModel.getNotFoundResponse(lang === "en" ? "Value not exist" : "لا يوجد قيم", error)
                MyLogger.info(`${temp.code}|${temp.message}|${JSON.stringify(temp.data)}`)
            }
            else {
                MyLogger.error(`${temp.code}|${temp.message}|${JSON.stringify(temp.data)}`)
            }
            res.status(500).json(temp);
        }



    }
    static async createImageAttributeValue(req, res) {
        const lang = req.headers.lang;
        const attributeId = req.body.attributeId;
        const files = req.files;        
        try {
            const data = await ValuesRepo.createImageValues(attributeId, files["ValueAr"], files["ValueEn"], files["HoverImageAr"], files["HoverImageEn"]);
            const temp = ResponseModel.getSuccessResponse(lang === "en" ? '' : "", data);
            MyLogger.info(`${temp.code}|${temp.message}|${JSON.stringify(temp.data)}`)
            res.status(200).json(temp);
        } catch (error) {
            let temp = ResponseModel.getServerSideError(lang === "en" ? "Unknown Error Happened" : "مشكلة غير معروفة", error);
            if (error instanceof CreateValueFailure) {
                temp = ResponseModel.getServerSideError(lang === "en" ? "Error Creating Value" : "مشكلة في إنشاء القيمة", error)
                MyLogger.info(`${temp.code}|${temp.message}|${JSON.stringify(temp.data)}`)
            }
            else {
                MyLogger.error(`${temp.code}|${temp.message}|${JSON.stringify(temp.data)}`)
            }
            res.status(500).json(temp);
        }
    }
    static async editImageAttributeValue(req, res) {
        const lang = req.headers.lang;
        const attributeId = req.body.attributeId;
        const id = req.body.Id;
        const files = req.files;
        try {
            const data = await ValuesRepo.editImageValues(id, attributeId, files["ValueAr"], files["ValueEn"], files["HoverImageAr"], files["HoverImageEn"]);
            const temp = ResponseModel.getSuccessResponse(lang === "en" ? '' : "", data);
            MyLogger.info(`${temp.code}|${temp.message}|${JSON.stringify(temp.data)}`)
            res.status(200).json(temp);
        } catch (error) {
            let temp = ResponseModel.getServerSideError(lang === "en" ? "Unknown Error Happened" : "مشكلة غير معروفة", error);
            if (error instanceof ValueFailure) {
                temp = ResponseModel.getServerSideError(lang === "en" ? "Error editing value" : "مشكلة في تعديل القيمة", error)
                MyLogger.info(`${temp.code}|${temp.message}|${JSON.stringify(temp.data)}`)
            }
            else if (error instanceof ValueNotExist) {
                temp = ResponseModel.getNotFoundResponse(lang === "en" ? "Value not exist" : "لا يوجد قيم", error)
                MyLogger.info(`${temp.code}|${temp.message}|${JSON.stringify(temp.data)}`)
            }
            else {
                MyLogger.error(`${temp.code}|${temp.message}|${JSON.stringify(temp.data)}`)
            }
            res.status(500).json(temp);
        }
    }
    static async deleteImageAttributeValue(req, res) {
        const lang = req.headers.lang;
        const id = req.params.id;
        try {
            const data = await ValuesRepo.deleteImageValue(id);
            const temp = ResponseModel.getSuccessResponse(lang === "en" ? '' : "", data);
            MyLogger.info(`${temp.code}|${temp.message}|${JSON.stringify(temp.data)}`)
            res.status(200).json(temp);
        } catch (error) {
            let temp = ResponseModel.getServerSideError(lang === "en" ? "Unknown Error Happened" : "مشكلة غير معروفة", error);
            if (error instanceof ValueNotExist) {
                temp = ResponseModel.getNotFoundResponse(lang === "en" ? "Value not exist" : "لا يوجد قيم", error)
                MyLogger.info(`${temp.code}|${temp.message}|${JSON.stringify(temp.data)}`)
            }
            else {
                MyLogger.error(`${temp.code}|${temp.message}|${JSON.stringify(temp.data)}`)
            }
            res.status(500).json(temp);
        }

    }
    static async deleteAttributesValue(req, res) {
        const lang = req.headers.lang;
        const id = req.params.id;
        try {
            const data = await ValuesRepo.deleteValue(id);
            const temp = ResponseModel.getSuccessResponse(lang === "en" ? '' : "", data);
            MyLogger.info(`${temp.code}|${temp.message}|${JSON.stringify(temp.data)}`)
            res.status(200).json(temp);
        } catch (error) {
            let temp = ResponseModel.getServerSideError(lang === "en" ? "Unknown Error Happened" : "مشكلة غير معروفة", error);
            if (error instanceof ValueNotExist) {
                temp = ResponseModel.getNotFoundResponse(lang === "en" ? "Value not exist" : "لا يوجد قيم", error)
                MyLogger.info(`${temp.code}|${temp.message}|${JSON.stringify(temp.data)}`)
            }
            else {
                MyLogger.error(`${temp.code}|${temp.message}|${JSON.stringify(temp.data)}`)
            }
            res.status(500).json(temp);
        }

    }
}
module.exports = ValuesController