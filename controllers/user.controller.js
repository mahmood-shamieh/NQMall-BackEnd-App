


const EmailUsed = require('../exceptions/EmailUsed');
const PhoneNumberUsed = require('../exceptions/PhoneNumberUsed');
const UserNotFound = require('../exceptions/UserNotExists');
const Product = require('../models/product.model');
const ResponseModel = require('../models/response.model');
const userRepo = require('../repositories/user.repo');
const MyLogger = require('../util/logging.utility');


class UserController {
    static async login(req, res) {
        const body = req.body;
        const lang = req.headers.lang || "en";
        try {
            const addedUser = await userRepo.logIn(body,lang);
            if (addedUser === false) {
                const temp = new ResponseModel(403, lang === "en" ? "Forbidden" : "غير مسموح بالدخول", null);
                MyLogger.info(`${temp.code}|${temp.message}|${temp.data}`)
                res.status(403).json(temp);
            } else if (addedUser) {
                const temp = ResponseModel.getSuccessResponse(lang === "en" ? 'Welcome' : "أهلاً", addedUser);
                MyLogger.info(`${temp.code}|${temp.message}|${JSON.stringify(temp.data)}`)
                res.status(200).json(temp);
            }
            else {
                throw ResponseModel.getServerSideError(lang === "en" ? "Unknown Error Happened" : "مشكلة غير معروفة", null)
            }
        } catch (error) {
            const temp = error instanceof ResponseModel ? error : ResponseModel.getServerSideError(lang === "en" ? "Unknown Error Happened" : "مشكلة غير معروفة", error)
            MyLogger.error(`${temp.code}|${temp.message}|${JSON.stringify(temp.data)}`)
            res.status(500).json(temp);
        }
        return;
    }
    static async create(req, res) {
        const body = req.body;
        const lang = req.headers.lang || 'en'
        try {
            const addedUser = await userRepo.addUser(body);
            const temp = ResponseModel.getSuccessResponse(lang === "en" ? 'Welcome' : "أهلاً", addedUser);
            MyLogger.info(`${temp.code}|${temp.message}|${JSON.stringify(temp.data)}`)
            res.status(200).json(temp);
        } catch (error) {
            let temp = ResponseModel.getServerSideError(lang === "en" ? "Unknown Error Happened" : "مشكلة غير معروفة", error);
            if (error instanceof EmailUsed) {
                temp = ResponseModel.getDataConflictError(lang === "en" ? "Email used before" : "الإيميل مستخدم من قبل", error)
                MyLogger.info(`${temp.code}|${temp.message}|${JSON.stringify(temp.data)}`)
            }
            else if (error instanceof PhoneNumberUsed) {
                temp = ResponseModel.getDataConflictError(lang === "en" ? "Phone Number used before" : "رقم الموبايل مستخدم من قبل", error)
                MyLogger.info(`${temp.code}|${temp.message}|${JSON.stringify(temp.data)}`)
            }
            else {
                MyLogger.error(`${temp.code}|${temp.message}|${JSON.stringify(temp.data)}`)
            }
            res.status(500).json(temp);
        }

    }static async createAdmin(req, res) {
        const body = req.body;
        const lang = req.headers.lang || 'en'
        try {
            const addedUser = await userRepo.AddAdmin(body);
            const temp = ResponseModel.getSuccessResponse(lang === "en" ? 'Welcome' : "أهلاً", addedUser);
            MyLogger.info(`${temp.code}|${temp.message}|${JSON.stringify(temp.data)}`)
            res.status(200).json(temp);
        } catch (error) {
            let temp = ResponseModel.getServerSideError(lang === "en" ? "Unknown Error Happened" : "مشكلة غير معروفة", error);
            if (error instanceof EmailUsed) {
                temp = ResponseModel.getDataConflictError(lang === "en" ? "Email used before" : "الإيميل مستخدم من قبل", error)
                MyLogger.info(`${temp.code}|${temp.message}|${JSON.stringify(temp.data)}`)
            }
            else if (error instanceof PhoneNumberUsed) {
                temp = ResponseModel.getDataConflictError(lang === "en" ? "Phone Number used before" : "رقم الموبايل مستخدم من قبل", error)
                MyLogger.info(`${temp.code}|${temp.message}|${JSON.stringify(temp.data)}`)
            }
            else {
                MyLogger.error(`${temp.code}|${temp.message}|${JSON.stringify(temp.data)}`)
            }
            res.status(500).json(temp);
        }

    }
    static async getUserDetails(req, res) {
        const id = req.headers.userId;
        const lang = req.headers.lang || 'en'
        try {
            const returnedUser = await userRepo.getUserDetails(id);
            const temp = ResponseModel.getSuccessResponse(lang === "en" ? 'Welcome' : "أهلاً", returnedUser);
            MyLogger.info(`${temp.code}|${temp.message}|${JSON.stringify(temp.data)}`)
            res.status(200).json(temp);
        } catch (error) {
            let temp = ResponseModel.getServerSideError(lang === "en" ? "Unknown Error Happened" : "مشكلة غير معروفة", error);
            if (error instanceof UserNotFound) {
                temp = ResponseModel.getDataConflictError(lang === "en" ? "User Not Found" : "المستخدم غير موجود", error)
                MyLogger.info(`${temp.code}|${temp.message}|${JSON.stringify(temp.data)}`)
            }
            else {
                MyLogger.error(`${temp.code}|${temp.message}|${JSON.stringify(temp.data)}`)
            }
            res.status(500).json(temp);

        }
    }
    static async updateUser(req, res) {
        const body = req.body;
        const lang = req.headers.lang || 'en'
        body.Id = req.headers.userId;
        try {
            const updatedUser = await userRepo.updateUserDetails(body);
            const temp = ResponseModel.getSuccessResponse(lang === "en" ? 'Welcome' : "أهلاً", updatedUser);
            MyLogger.info(`${temp.code}|${temp.message}|${JSON.stringify(temp.data)}`)
            res.status(200).json(temp);
        } catch (error) {
            let temp = ResponseModel.getServerSideError(lang === "en" ? "Unknown Error Happened" : "مشكلة غير معروفة", error);
            if (error instanceof UserNotFound) {
                temp = ResponseModel.getDataConflictError(lang === "en" ? "User Not Found" : "المستخدم غير موجود", error)
                MyLogger.info(`${temp.code}|${temp.message}|${JSON.stringify(temp.data)}`)
            }
            else {
                MyLogger.error(`${temp.code}|${temp.message}|${JSON.stringify(temp.data)}`)
            }
            res.status(500).json(temp);
        }
    }
    static async deleteUser(req, res) {
        const id = req.headers.userId;
        const lang = req.headers.lang || 'en'

        try {
            const userDeleted = await userRepo.deleteUser(id);
            const temp = ResponseModel.getSuccessResponse(lang === "en" ? 'user deleted successfully' : "تم حذف المستخدم بنجاح",null);
            MyLogger.info(`${temp.code}|${temp.message}|${JSON.stringify(temp.data)}`)
            res.status(200).json(temp);
        } catch (error) {
            let temp = ResponseModel.getServerSideError(lang === "en" ? "Unknown Error Happened" : "مشكلة غير معروفة", error);
            if (error instanceof UserNotFound) {
                temp = ResponseModel.getDataConflictError(lang === "en" ? "User Not Found" : "المستخدم غير موجود", error)
                MyLogger.info(`${temp.code}|${temp.message}|${JSON.stringify(temp.data)}`)
            }
            else {
                MyLogger.error(`${temp.code}|${temp.message}|${JSON.stringify(temp.data)}`)
            }
            res.status(500).json(temp);

        }

    }
    static async getFormat(req, res) {
        res.status(200).send({
            "Email": "",
            "PasswordHash": "",
            "FullName": "",
            "Address": "",
            "PhoneNumber": "",
            "IsActive": "",
            "Role": ""
        });
    }

}
module.exports = UserController;