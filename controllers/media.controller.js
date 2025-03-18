const mediaRepo = require("../repositories/media.repo");
const SystemUtil = require("../util/system");
const ResponseModel = require("../models/response.model");
const MyLogger = require("../util/logging.utility");
const MediaFailure = require("../exceptions/Mediafailure");
const CreateMediaFailure = require("../exceptions/CreateMediaFailure");
const MediaNotExist = require("../exceptions/MediaNotExist");


class MediaController {
  static async getProductMedia(req, res) {
    const productId = req.params.productId;
    const lang = req.headers.lang;
    try {
      const data = await mediaRepo.getProductMedia(productId);
      const temp = ResponseModel.getSuccessResponse(lang === "en" ? '' : "", data);
      MyLogger.info(`${temp.code}|${temp.message}|${JSON.stringify(temp.data)}`)
      res.status(200).json(temp);
    } catch (error) {
      let temp = ResponseModel.getServerSideError(lang === "en" ? "Unknown Error Happened" : "مشكلة غير معروفة", error);
      if (error instanceof MediaNotExist) {
        temp = ResponseModel.getNotFoundResponse(lang === "en" ? "Media not exist" : "الميديا غير موجودة", error)
        MyLogger.info(`${temp.code}|${temp.message}|${JSON.stringify(temp.data)}`)
      }
      else {
        MyLogger.error(`${temp.code}|${temp.message}|${JSON.stringify(temp.data)}`)
      }
      res.status(500).json(temp);
    }
  }
  static async create(req, res) {
    const id = req.body.productId;
    const lang = req.headers.lang;
    const promises = req.files.map((element) => {

      return mediaRepo.addMedia({
        URL:
          SystemUtil.detectOS() === SystemUtil.OS_TYPE.MACOS
            ? element.path.split('/').slice(1).join('\\')
            : element.path.split("\\").slice(1).join("\\"),
        Type: "image",
        Size: element.size,
        IsActive: true,
        productId: id,
      });
    });

    try {
      let data = await Promise.all(promises);
      const temp = ResponseModel.getSuccessResponse(lang === "en" ? '' : "", data);
      MyLogger.info(`${temp.code}|${temp.message}|${JSON.stringify(temp.data)}`)
      res.status(200).json(temp);
    } catch (error) {
      let temp = ResponseModel.getServerSideError(lang === "en" ? "Unknown Error Happened" : "مشكلة غير معروفة", error);
      if (error instanceof CreateMediaFailure) {
        temp = ResponseModel.getServerSideError(lang === "en" ? "Error Creating Media" : "مشكلة في تخزين الميديا", error)
        MyLogger.info(`${temp.code}|${temp.message}|${JSON.stringify(temp.data)}`)
      }
      else {
        MyLogger.error(`${temp.code}|${temp.message}|${JSON.stringify(temp.data)}`)
      }
      res.status(500).json(temp);
    }
  }

  static async delete(req, res) {
    const id = req.params.id;
    const lang = req.headers.lang;
    try {
      const data = await mediaRepo.deleteMedia(id);
      const temp = ResponseModel.getSuccessResponse(lang === "en" ? '' : "", data);
      MyLogger.info(`${temp.code}|${temp.message}|${JSON.stringify(temp.data)}`)
      res.status(200).json(temp);
    } catch (error) {
      let temp = ResponseModel.getServerSideError(lang === "en" ? "Unknown Error Happened" : "مشكلة غير معروفة", error);
      if (error instanceof MediaNotExist) {
        temp = ResponseModel.getNotFoundResponse(lang === "en" ? "Media not exist" : "الميديا غير موجودة", error)
        MyLogger.info(`${temp.code}|${temp.message}|${JSON.stringify(temp.data)}`)
      }
      else {
        MyLogger.error(`${temp.code}|${temp.message}|${JSON.stringify(temp.data)}`)
      }
      res.status(500).json(temp);
    }
  }
  static async getMediaDetails(req, res) {
    const id = req.params.id;
    const lang = req.headers.lang;
    try {
      const data = await mediaRepo.getMediaDetails(id);
      const temp = ResponseModel.getSuccessResponse(lang === "en" ? '' : "", data);
      MyLogger.info(`${temp.code}|${temp.message}|${JSON.stringify(temp.data)}`)
      res.status(200).json(temp);
    } catch (error) {
      let temp = ResponseModel.getServerSideError(lang === "en" ? "Unknown Error Happened" : "مشكلة غير معروفة", error);
      if (error instanceof MediaNotExist) {
        temp = ResponseModel.getNotFoundResponse(lang === "en" ? "Media not exist" : "الميديا غير موجودة", error)
        MyLogger.info(`${temp.code}|${temp.message}|${JSON.stringify(temp.data)}`)
      }
      else if (error instanceof MediaFailure) {
        temp = ResponseModel.getServerSideError(lang === "en" ? "Error Reading Media" : "مشكلة في قراءة الميديا", error)
        MyLogger.info(`${temp.code}|${temp.message}|${JSON.stringify(temp.data)}`)
      }
      else {
        MyLogger.error(`${temp.code}|${temp.message}|${JSON.stringify(temp.data)}`)
      }
      res.status(500).json(temp);
    }
  }

}

module.exports = MediaController;
