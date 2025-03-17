const categoryRepo = require("../repositories/category.repo");
const SystemUtil = require("../util/system")
const ResponseModel = require("../models/response.model");
const MyLogger = require("../util/logging.utility");
const CategoryFailure = require("../exceptions/CategoryFailure");
const CreateCategoryFailure = require("../exceptions/CreateCategoryFailure");
const CategoryNotExist = require("../exceptions/CategoryNotExist");

class CategoryController {


  static async getCategoryForView(req, res) {
    const lang = req.headers.lang;

    try {
      const data = await categoryRepo.getCategoryForView()
      const temp = ResponseModel.getSuccessResponse(lang === "en" ? 'Categories Are' : "الأصناف هي", data);
      MyLogger.info(`${temp.code}|${temp.message}|${JSON.stringify(temp.data)}`)
      res.status(200).json(temp);
    } catch (error) {
      let temp = ResponseModel.getServerSideError(lang === "en" ? "Unknown Error Happened" : "مشكلة غير معروفة", error);
      MyLogger.error(`${temp.code}|${temp.message}|${JSON.stringify(temp.data)}`)
      res.status(500).json(temp);
    }
  }
  static async getCategoryBrands(req, res) {
    const lang = req.headers.lang;
    const categoryId = req.params.categoryId;

    try {
      const data = await categoryRepo.getCategoryBrands(categoryId)
      const temp = ResponseModel.getSuccessResponse(lang === "en" ? 'Categories Are' : "الأصناف هي", data);
      MyLogger.info(`${temp.code}|${temp.message}|${JSON.stringify(temp.data)}`)
      res.status(200).json(temp);
    }
    catch (error) {
      let temp = ResponseModel.getServerSideError(lang === "en" ? "Unknown Error Happened" : "مشكلة غير معروفة", error);
      MyLogger.error(`${temp.code}|${temp.message}|${JSON.stringify(temp.data)}`)
      res.status(500).json(temp);
    }

  }
  static async create(req, res) {
    const lang = req.headers.lang;
    const body = req.body;
    if (req.files.length) {
      body.ImageSize = req.files[0].size;
      body.ImageURL =
        SystemUtil.detectOS() === SystemUtil.OS_TYPE.MACOS
          ? req.files[0].path.split("/").slice(1).join("\\")
          : req.files[0].path.split("\\").slice(1).join("\\");
    }
    try {
      const createdCategory = await categoryRepo.addCategory(body);
      const temp = ResponseModel.getSuccessResponse(lang === "en" ? '' : "", createdCategory);
      MyLogger.info(`${temp.code}|${temp.message}|${JSON.stringify(temp.data)}`)
      res.status(200).json(temp);
    } catch (error) {
      let temp = ResponseModel.getServerSideError(lang === "en" ? "Unknown Error Happened" : "مشكلة غير معروفة", error);
      if (error instanceof CreateCategoryFailure) {
        temp = ResponseModel.getDataConflictError(lang === "en" ? "Error Creating Category" : "حدثت مشكلة في إنشاء الصنف", error)
        MyLogger.info(`${temp.code}|${temp.message}|${JSON.stringify(temp.data)}`)
      } else {
        MyLogger.error(`${temp.code}|${temp.message}|${JSON.stringify(temp.data)}`)
      }
      res.status(500).json(temp);
    }

  }
  static async getCategoryDetails(req, res) {
    const lang = req.headers.lang;

    // Define pagination parameters

    const id = req.params.id;
    const page = req.body.page;
    const limit = req.body.limit;
    const searchQuery = req.body.searchQuery;
    try {
      const updatedCategory = await categoryRepo.getCategoryDetails(
        id,
        page,
        limit,
        searchQuery
      );
      const temp = ResponseModel.getSuccessResponse(lang === "en" ? '' : "", updatedCategory);
      MyLogger.info(`${temp.code}|${temp.message}|${JSON.stringify(temp.data)}`)
      res.status(200).json(temp);
    } catch (error) {
      let temp = ResponseModel.getServerSideError(lang === "en" ? "Unknown Error Happened" : "مشكلة غير معروفة", error);
      if (error instanceof CategoryFailure) {
        temp = ResponseModel.getDataConflictError(lang === "en" ? "Error Reading Category" : "حدثت مشكلة في قراءة الأصناف", error)
        MyLogger.info(`${temp.code}|${temp.message}|${JSON.stringify(temp.data)}`)
      } else {
        MyLogger.error(`${temp.code}|${temp.message}|${JSON.stringify(temp.data)}`)
      }
      res.status(500).json(temp);
    }

  }
  static async getAllCategories(req, res) {
    const lang = req.headers.lang;

    // Define pagination parameters

    try {
      const updatedCategory = await categoryRepo.getAllCategoriesDetails();
      const temp = ResponseModel.getSuccessResponse(lang === "en" ? '' : "", updatedCategory);
      MyLogger.info(`${temp.code}|${temp.message}|${JSON.stringify(temp.data)}`)
      res.status(200).json(temp);
    } catch (error) {
      let temp = ResponseModel.getServerSideError(lang === "en" ? "Unknown Error Happened" : "مشكلة غير معروفة", error);
      if (error instanceof CategoryFailure) {
        temp = ResponseModel.getDataConflictError(lang === "en" ? "Error Reading Category" : "حدثت مشكلة في قراءة الأصناف", error)
        MyLogger.info(`${temp.code}|${temp.message}|${JSON.stringify(temp.data)}`)
      } else {
        MyLogger.error(`${temp.code}|${temp.message}|${JSON.stringify(temp.data)}`)
      }
      res.status(500).json(temp);
    }

  }
  static async updateCategoryDetails(req, res) {
    const lang = req.headers.lang;

    const body = req.body;

    if (req.files.length) {
      body.ImageSize = req.files[0].size;
      body.ImageURL =
        SystemUtil.detectOS() === SystemUtil.OS_TYPE.MACOS
          ? req.files[0].path.split("/").slice(1).join("\\") : req.files[0].path.split("\\").slice(1).join("\\");
    }
    try {
      const updatedCategory = await categoryRepo.updateCategoryDetails(body);
      const temp = ResponseModel.getSuccessResponse(lang === "en" ? '' : "", updatedCategory);
      MyLogger.info(`${temp.code}|${temp.message}|${JSON.stringify(temp.data)}`)
      res.status(200).json(temp);
    } catch (error) {
      let temp = ResponseModel.getServerSideError(lang === "en" ? "Unknown Error Happened" : "مشكلة غير معروفة", error);
      if (error instanceof CategoryNotExist) {
        temp = ResponseModel.getDataConflictError(lang === "en" ? "Category Not Exist" : "الصنف ليس موجود", error)
        MyLogger.info(`${temp.code}|${temp.message}|${JSON.stringify(temp.data)}`)
      } else {
        MyLogger.error(`${temp.code}|${temp.message}|${JSON.stringify(temp.data)}`)
      }
      res.status(500).json(temp);
    }

  }
  static async deleteCategory(req, res) {
    const lang = req.headers.lang;

    const id = req.params.id;
    try {
      const categoryDeleted = await categoryRepo.deleteCategory(id);
      const temp = ResponseModel.getSuccessResponse(lang === "en" ? '' : "", null);
      MyLogger.info(`${temp.code}|${temp.message}|${JSON.stringify(temp.data)}`)
      res.status(200).json(temp);
    } catch (error) {
      let temp = ResponseModel.getServerSideError(lang === "en" ? "Unknown Error Happened" : "مشكلة غير معروفة", error);
      if (error instanceof CategoryNotExist) {
        temp = ResponseModel.getDataConflictError(lang === "en" ? "Category Not Exist" : "الصنف ليس موجود", error)
        MyLogger.info(`${temp.code}|${temp.message}|${JSON.stringify(temp.data)}`)
      } else {
        MyLogger.error(`${temp.code}|${temp.message}|${JSON.stringify(temp.data)}`)
      }
      res.status(500).json(temp);

    }

  }

}

module.exports = CategoryController;
