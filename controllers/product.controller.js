const mediaRepo = require('../repositories/media.repo')
const productRepo = require('../repositories/product.repo')
const ResponseModel = require("../models/response.model");
const MyLogger = require("../util/logging.utility");
const ProductNotExist = require('../exceptions/ProductNotExist');
const CreateProductFailure = require('../exceptions/CreateProductFailure');



function removeIndexesFromProductDetails(products) {
    for (let index = 0; index < products.data.length; index++) {
        let entriesAr = Object.entries(products.data[index].DetailsAr);
        const updatedEntriesAr = entriesAr.map(([key, value]) => [key.includes('_') ? key.split('_')[1] : key, value]);
        const updatedDetailsAr = Object.fromEntries(updatedEntriesAr);
        products.data[index].DetailsAr = updatedDetailsAr;
        let entriesEn = Object.entries(products.data[index].DetailsEn);
        const updatedEntriesEn = entriesEn.map(([key, value]) => [key.includes('_') ? key.split('_')[1] : key, value]);
        const updatedDetailsEn = Object.fromEntries(updatedEntriesEn);
        products.data[index].DetailsEn = updatedDetailsEn;

    }
    return products;
}
class ProductController {
    static async getProductCategory(req, res) {
        const lang = req.headers.lang;
        const categoryId = req.params.id;
        const page = req.params.page;
        const searchQuery = req.params.searchQuery;


        try {
            const data = await productRepo.getProductCategory(categoryId, page, 12, searchQuery);
            const temp = ResponseModel.getSuccessResponse(lang === "en" ? 'Products Are' : "المنتجات هي", data);
            MyLogger.info(`${temp.code}|${temp.message}|${JSON.stringify(temp.data)}`)
            res.status(200).json(temp);
        } catch (error) {
            let temp = ResponseModel.getServerSideError(lang === "en" ? "Unknown Error Happened" : "مشكلة غير معروفة", error);
            if (error instanceof ProductFailure) {
                temp = ResponseModel.getServerSideError(lang === "en" ? "Error Fetching Products" : "مشكلة في جلب المنتجات", error)
                MyLogger.info(`${temp.code}|${temp.message}|${JSON.stringify(temp.data)}`)
            } else {
                MyLogger.error(`${temp.code}|${temp.message}|${JSON.stringify(temp.data)}`)
            }
            res.status(500).json(temp);
        }

    }
    static async getProductBrand(req, res) {
        const lang = req.headers.lang;
        const brandId = req.params.id;
        const page = req.params.page;
        const searchQuery = req.params.searchQuery;

        try {
            const data = await productRepo.getProductBrand(brandId, page, 12, searchQuery);
            const temp = ResponseModel.getSuccessResponse(lang === "en" ? 'Products Are' : "المنتجات هي", data);
            MyLogger.info(`${temp.code}|${temp.message}|${JSON.stringify(temp.data)}`)
            res.status(200).json(temp);

        } catch (error) {
            let temp = ResponseModel.getServerSideError(lang === "en" ? "Unknown Error Happened" : "مشكلة غير معروفة", error);
            if (error instanceof ProductFailure) {
                temp = ResponseModel.getServerSideError(lang === "en" ? "Error Fetching Products" : "مشكلة في جلب المنتجات", error)
                MyLogger.info(`${temp.code}|${temp.message}|${JSON.stringify(temp.data)}`)
            } else {
                MyLogger.error(`${temp.code}|${temp.message}|${JSON.stringify(temp.data)}`)
            }
            res.status(500).json(temp);
        }

    }

    static async getProductForViewHomePage(req, res) {
        const lang = req.headers.lang;
        try {
            const data = await productRepo.getProductForViewHomePage();
            const temp = ResponseModel.getSuccessResponse(lang === "en" ? 'Products Are' : "المنتجات هي", data);
            MyLogger.info(`${temp.code}|${temp.message}|${JSON.stringify(temp.data)}`)
            res.status(200).json(temp);
        } catch (error) {
            let temp = ResponseModel.getServerSideError(lang === "en" ? "Unknown Error Happened" : "مشكلة غير معروفة", error);
            MyLogger.error(`${temp.code}|${temp.message}|${JSON.stringify(temp.data)}`)
            res.status(500).json(temp);
        }
    }
    static async updateProductDetails(req, res) {
        const lang = req.headers.lang;
        const body = req.body;
        try {
            const data = await productRepo.updateProduct(body);
            const temp = ResponseModel.getSuccessResponse(lang === "en" ? 'Products Are' : "المنتجات هي", data);
            MyLogger.info(`${temp.code}|${temp.message}|${JSON.stringify(temp.data)}`)
            res.status(200).json(temp);
        } catch (error) {
            let temp = ResponseModel.getServerSideError(lang === "en" ? "Unknown Error Happened" : "مشكلة غير معروفة", error);
            if (error instanceof ProductNotExist) {
                temp = ResponseModel.getNotFoundResponse(lang === "en" ? "Products not exist" : "فشل تحديث بيانات المنتج", error)
                MyLogger.info(`${temp.code}|${temp.message}|${JSON.stringify(temp.data)}`)
            } else {
                MyLogger.error(`${temp.code}|${temp.message}|${JSON.stringify(temp.data)}`)
            }
            res.status(500).json(temp);
        }

    }
    static async getAllProductDetails(req, res) {
        const lang = req.headers.lang;
        const productId = req.params.id;
        const page = req.body.page;
        const limit = req.body.limit;
        const searchQuery = req.body.searchQuery;
        const categoryId = req.body.categoryId;
        const brandId = req.body.brandId;
        try {
            const data = await productRepo.getAllProduct(productId, page, limit, searchQuery,categoryId,brandId);
            const temp = ResponseModel.getSuccessResponse(lang === "en" ? 'Products Are' : "المنتجات هي", data);
            MyLogger.info(`${temp.code}|${temp.message}|${JSON.stringify(temp.data)}`)
            res.status(200).json(temp);
        } catch (error) {
            let temp = ResponseModel.getServerSideError(lang === "en" ? "Unknown Error Happened" : "مشكلة غير معروفة", error);
            if (error instanceof ProductFailure) {
                temp = ResponseModel.getServerSideError(lang === "en" ? "Error Fetching Products" : "مشكلة في جلب المنتجات", error)
                MyLogger.info(`${temp.code}|${temp.message}|${JSON.stringify(temp.data)}`)
            } else {
                MyLogger.error(`${temp.code}|${temp.message}|${JSON.stringify(temp.data)}`)
            }
            res.status(500).json(temp);
        }


    }
    static async deleteProduct(req, res) {
        const lang = req.headers.lang;
        const productId = req.params.productId;
        try {
            const data = await productRepo.deleteProduct(productId);
            const temp = ResponseModel.getSuccessResponse(lang === "en" ? 'Product deleted successfully' : "تم حذف المنتج بنجاح", data);
            MyLogger.info(`${temp.code}|${temp.message}|${JSON.stringify(temp.data)}`)
            res.status(200).json(temp);
        } catch (error) {
            let temp = ResponseModel.getServerSideError(lang === "en" ? "Unknown Error Happened" : "مشكلة غير معروفة", error);
            if (error instanceof ProductNotExist) {
                temp = ResponseModel.getNotFoundResponse(lang === "en" ? "Products not exist" : "فشل تحديث بيانات المنتج", error)
                MyLogger.info(`${temp.code}|${temp.message}|${JSON.stringify(temp.data)}`)
            } else {
                MyLogger.error(`${temp.code}|${temp.message}|${JSON.stringify(temp.data)}`)
            }
            res.status(500).json(temp);
        }

    }
    static async getProductDetails(req, res) {
        const lang = req.headers.lang;
        const productId = req.params.id;
        try {
            const data = await productRepo.getProductDetails(productId);
            const temp = ResponseModel.getSuccessResponse(lang === "en" ? 'Products Are' : "المنتجات هي", data);
            MyLogger.info(`${temp.code}|${temp.message}|${JSON.stringify(temp.data)}`)
            res.status(200).json(temp);
        } catch (error) {
            let temp = ResponseModel.getServerSideError(lang === "en" ? "Unknown Error Happened" : "مشكلة غير معروفة", error);
            if (error instanceof ProductNotExist) {
                temp = ResponseModel.getNotFoundResponse(lang === "en" ? "Error Fetching Products" : "مشكلة في جلب المنتجات", error)
                MyLogger.info(`${temp.code}|${temp.message}|${JSON.stringify(temp.data)}`)
            } else {
                MyLogger.error(`${temp.code}|${temp.message}|${JSON.stringify(temp.data)}`)
            }
            res.status(500).json(temp);
        }
    }
    // media upload finished and we arrived to the attributes processing now
    static async create(req, res) {
        const lang = req.headers.lang;
        const body = req.body;
        try {
            const data = await productRepo.createProduct(body);
            const temp = ResponseModel.getSuccessResponse(lang === "en" ? 'Products Are' : "المنتجات هي", data);
            MyLogger.info(`${temp.code}|${temp.message}|${JSON.stringify(temp.data)}`)
            res.status(200).json(temp);
        } catch (error) {
            let temp = ResponseModel.getServerSideError(lang === "en" ? "Unknown Error Happened" : "مشكلة غير معروفة", error);
            if (error instanceof CreateProductFailure) {
                temp = ResponseModel.getServerSideError(lang === "en" ? "Create Product Error" : "مشكلة في إنشاء المنتج", error)
                MyLogger.info(`${temp.code}|${temp.message}|${JSON.stringify(temp.data)}`)
            } else {
                MyLogger.error(`${temp.code}|${temp.message}|${JSON.stringify(temp.data)}`)
            }
            res.status(500).json(temp);
         }
    }
}
module.exports = ProductController