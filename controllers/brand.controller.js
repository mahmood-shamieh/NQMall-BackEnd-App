const BrandNotExist = require("../exceptions/BrandNotExist");
const UpdateBrandFailure = require("../exceptions/UpdateBrandFaileur");
const brand = require("../models/brand.model");
const ResponseModel = require("../models/response.model");
const MyLogger = require("../util/logging.utility");
const BrandRepo = require("../repositories/brand.repo");

const brandRepo = require('../repositories/brand.repo');
const SystemUtil = require("../util/system");
const CreateBrandFailed = require("../exceptions/CreateBrandFailed");





class BrandController {

    static async getBrandForView(req, res) {
        const lang = req.headers.lang;
        try {
            const brands = await brandRepo.getBrandForView();
            const temp = ResponseModel.getSuccessResponse(lang === "en" ? 'Brands Are' : "البراندات هي", brands);
            MyLogger.info(`${temp.code}|${temp.message}|${JSON.stringify(temp.data)}`)
            res.status(200).json(temp);
        }
        catch (error) {
            let temp = ResponseModel.getServerSideError(lang === "en" ? "Unknown Error Happened" : "مشكلة غير معروفة", error);
            MyLogger.error(`${temp.code}|${temp.message}|${JSON.stringify(temp.data)}`)
            res.status(500).json(temp);
        }


    }
    static async createNewBrand(req, res) {
        const body = req.body;
        const lang = req.headers.lang
        if (req.files.length) {
            body.LogoSize = req.files[0].size;
            body.LogoUrl =
                SystemUtil.detectOS() === SystemUtil.OS_TYPE.MACOS
                    ? req.files[0].path.split("/").slice(1).join("\\")
                    : req.files[0].path.split("\\").slice(1).join("\\");
        }
        try {
            const addBrand = await brandRepo.addBrand(body);
            const temp = ResponseModel.getSuccessResponse(lang === "en" ? '' : "", addBrand);
            MyLogger.info(`${temp.code}|${temp.message}|${JSON.stringify(temp.data)}`)
            res.status(200).json(temp);
        } catch (error) {
            let temp = ResponseModel.getServerSideError(lang === "en" ? "Unknown Error Happened" : "مشكلة غير معروفة", error);
            if (error instanceof CreateBrandFailed) {
                temp = ResponseModel.getServerSideError(lang === "en" ? "Error Creating Brand" : "حدثت مشكلة في إنشاء البراند", error)
                MyLogger.info(`${temp.code}|${temp.message}|${JSON.stringify(temp.data)}`)
            }
            else {
                MyLogger.error(`${temp.code}|${temp.message}|${JSON.stringify(temp.data)}`)
            }
            res.status(500).json(temp);
        }

    }
    static async getBrandDetails(req, res) {
        const id = req.params.id;
        const lang = req.headers.lang;
        try {
            const brandDetails = await brandRepo.getBrandDetails(id, req.body.page, req.body.limit, req.body.searchQuery);
            const temp = ResponseModel.getSuccessResponse(lang === "en" ? '' : "", brandDetails);
            MyLogger.info(`${temp.code}|${temp.message}|${JSON.stringify(temp.data)}`)
            res.status(200).json(temp);

        } catch (error) {
            let temp = ResponseModel.getServerSideError(lang === "en" ? "Unknown Error Happened" : "مشكلة غير معروفة", error);
            if (error instanceof BrandNotExist) {
                temp = ResponseModel.getNotFoundResponse(lang === "en" ? "Brand Not Found" : "البراند غير موجود", error)
                MyLogger.info(`${temp.code}|${temp.message}|${JSON.stringify(temp.data)}`)
            }
            else {
                MyLogger.error(`${temp.code}|${temp.message}|${JSON.stringify(temp.data)}`)
            }
            res.status(500).json(temp);
        }

    }
    static async getAllBrandDetails(req, res) {
        // const id = req.params.id;
        const lang = req.headers.lang
        try {
            const brandDetails = await brandRepo.getAllBrandDetails();
            const temp = ResponseModel.getSuccessResponse(lang === "en" ? '' : "", brandDetails);
            MyLogger.info(`${temp.code}|${temp.message}|${JSON.stringify(temp.data)}`)
            res.status(200).json(temp);
        } catch (error) {
            let temp = ResponseModel.getServerSideError(lang === "en" ? "Unknown Error Happened" : "مشكلة غير معروفة", error);
            MyLogger.error(`${temp.code}|${temp.message}|${JSON.stringify(temp.data)}`)
            res.status(500).json(temp);
        }
    }
    static async updateBrandDetails(req, res) {
        const body = req.body;
        const lang = req.headers.lang;
        if (req.files.length) {
            body.LogoSize = req.files[0].size;
            body.LogoUrl =
                SystemUtil.detectOS() === SystemUtil.OS_TYPE.MACOS
                    ? req.files[0].path.split("/").slice(1).join("\\")
                    : req.files[0].path.split("\\").slice(1).join("\\");
        }
        try {
            const updatedBrand = await brandRepo.updateBrandDetails(body);
            const temp = ResponseModel.getSuccessResponse(lang === "en" ? '' : "", updatedBrand);
            MyLogger.info(`${temp.code}|${temp.message}|${JSON.stringify(temp.data)}`)
            res.status(200).json(temp);
        } catch (error) {
            let temp = ResponseModel.getServerSideError(lang === "en" ? "Unknown Error Happened" : "مشكلة غير معروفة", error);
            if (error instanceof UpdateBrandFailure) {
                temp = ResponseModel.getServerSideError(lang === "en" ? "Brand update failed" : "فشل تعديل البراند", error)
                MyLogger.info(`${temp.code}|${temp.message}|${JSON.stringify(temp.data)}`)
            } else {
                MyLogger.error(`${temp.code}|${temp.message}|${JSON.stringify(temp.data)}`)
            }
            res.status(500).json(temp);
        }

    }
    static async deleteBrand(req, res) {
        const id = req.params.id;
        const lang = req.headers.lang;
        try {
            const brandDeleted =await  brandRepo.deleteBrand(id);
            const temp = ResponseModel.getSuccessResponse(lang === "en" ? '' : "", brandDeleted);
            MyLogger.info(`${temp.code}|${temp.message}|${JSON.stringify(temp.data)}`)
            res.status(200).json(temp);
        } catch (error) {
            let temp = ResponseModel.getServerSideError(lang === "en" ? "Unknown Error Happened" : "مشكلة غير معروفة", error);
            if (error instanceof BrandNotExist) {
                temp = ResponseModel.getNotFoundResponse(lang === "en" ? "Brand Not Found" : "البراند غير موجود", error)
                MyLogger.info(`${temp.code}|${temp.message}|${JSON.stringify(temp.data)}`)
            } else {
                MyLogger.error(`${temp.code}|${temp.message}|${JSON.stringify(temp.data)}`)
            }
            res.status(500).json(temp);
        }


    }
    static async getFormat(req, res) {
        res.status(200).send({
            "Id": 1,
            "NameAr": "تصنيف 4",
            "NameEn": "category 4",
            "LogoUrl": "وصف 4",
            "LogoSize": "4",
            "WebSiteUrl": "description 4",
            "DescriptionAr": "https://www.google.com",
            "DescriptionEn": "https://www.google.com",
            "IsActive": "1",
            "UpdatedAt": "2024-03-14T09:06:59.718Z",
            "CreatedAt": "2024-03-14T09:06:59.718Z"

        });
    }

}
module.exports = BrandController    