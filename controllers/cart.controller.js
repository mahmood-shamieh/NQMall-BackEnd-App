const { sequelize } = require('../config/sequelize.config');
const attributeRepo = require('../repositories/attribute.repo');
const CartRepo = require('../repositories/cart.repo');
const ValuesRepo = require('../repositories/values.repo');
const ResponseModel = require("../models/response.model");
const MyLogger = require("../util/logging.utility");
const CartNotExist = require('../exceptions/CartNotExist');
const VariationNotExist = require('../exceptions/VariationNotExist');





class CartController {
    static async addToCart(req, res) {
        const lang = req.headers.lang;
        try {
            const data = await CartRepo.addToCart(req.user.Id, req.body);
            const temp = ResponseModel.getSuccessResponse(lang === "en" ? 'Cart is' : "السلة هي", data);
            MyLogger.info(`${temp.code}|${temp.message}|${JSON.stringify(temp.data)}`)
            res.status(200).json(temp);
        } catch (error) {
            let temp = ResponseModel.getServerSideError(lang === "en" ? "Unknown Error Happened" : "مشكلة غير معروفة", error);
            // if (error instanceof VariationNotExist) {
            //     temp = ResponseModel.getNotFoundResponse(lang === "en" ? "Variations not exist" : "هذه التشكيلة غير موجودة", error)
            //     MyLogger.info(`${temp.code}|${temp.message}|${JSON.stringify(temp.data)}`)
            // } else {
            MyLogger.error(`${temp.code}|${temp.message}|${JSON.stringify(temp.data)}`)
            // }
            res.status(500).json(temp);
        }      // console.log("bbbb");
    } static async removeFromCart(req, res) {
        // console.log(req.body);
        const lang = req.headers.lang

        try {
            const data = await CartRepo.removeFromCart(req.user, req.body);
            const temp = ResponseModel.getSuccessResponse(lang === "en" ? 'Cart is' : "السلة هي", data);
            MyLogger.info(`${temp.code}|${temp.message}|${JSON.stringify(temp.data)}`)
            res.status(200).json(temp);
        } catch (error) {

            let temp = ResponseModel.getServerSideError(lang === "en" ? "Unknown Error Happened" : "مشكلة غير معروفة", error);
            if (error instanceof CartNotExist) {
                temp = ResponseModel.getNotFoundResponse(lang === "en" ? "Cart not exist" : "السلة غير موجودة", error)
                MyLogger.info(`${temp.code}|${temp.message}|${JSON.stringify(temp.data)}`)
            } else if (error instanceof VariationNotExist) {
                temp = ResponseModel.getNotFoundResponse(lang === "en" ? "Variations not exist" : "هذه التشكيلة غير موجودة", error)
                MyLogger.info(`${temp.code}|${temp.message}|${JSON.stringify(temp.data)}`)
            } else {
                MyLogger.error(`${temp.code}|${temp.message}|${JSON.stringify(temp.data)}`)
            }
            res.status(500).json(temp);
        }

    }static async removeFromCartByVariationId(req, res) {
        // console.log(req.body);
        const lang = req.headers.lang

        try {
            const data = await CartRepo.removeFromCartByVariationId(req.user, req.body);
            const temp = ResponseModel.getSuccessResponse(lang === "en" ? 'Cart is' : "السلة هي", data);
            MyLogger.info(`${temp.code}|${temp.message}|${JSON.stringify(temp.data)}`)
            res.status(200).json(temp);
        } catch (error) {

            let temp = ResponseModel.getServerSideError(lang === "en" ? "Unknown Error Happened" : "مشكلة غير معروفة", error);
            if (error instanceof CartNotExist) {
                temp = ResponseModel.getNotFoundResponse(lang === "en" ? "Cart not exist" : "السلة غير موجودة", error)
                MyLogger.info(`${temp.code}|${temp.message}|${JSON.stringify(temp.data)}`)
            } else if (error instanceof VariationNotExist) {
                temp = ResponseModel.getNotFoundResponse(lang === "en" ? "Variations not exist" : "هذه التشكيلة غير موجودة", error)
                MyLogger.info(`${temp.code}|${temp.message}|${JSON.stringify(temp.data)}`)
            } else {
                MyLogger.error(`${temp.code}|${temp.message}|${JSON.stringify(temp.data)}`)
            }
            res.status(500).json(temp);
        }

    }
    static async getUserCart(req, res) {
        const lang = req.headers.lang
        const userId = req.user.Id;
        try {
            const data = await CartRepo.getUserCart(userId);
            const temp = ResponseModel.getSuccessResponse(lang === "en" ? 'Cart is' : "السلة هي", data);
            MyLogger.info(`${temp.code}|${temp.message}|${JSON.stringify(temp.data)}`)
            res.status(200).json(temp);
        } catch (error) {
            let temp = ResponseModel.getServerSideError(lang === "en" ? "Unknown Error Happened" : "مشكلة غير معروفة", error);
            if (error instanceof CartNotExist) {
                temp = ResponseModel.getNotFoundResponse(lang === "en" ? "Cart not exist" : "السلة غير موجودة", error)
                MyLogger.info(`${temp.code}|${temp.message}|${JSON.stringify(temp.data)}`)
            } else {
                MyLogger.error(`${temp.code}|${temp.message}|${JSON.stringify(temp.data)}`)
            }
            res.status(500).json(temp);
        }
    }

}
module.exports = CartController