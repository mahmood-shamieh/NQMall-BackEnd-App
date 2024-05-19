const mediaRepo = require("../repositories/media.repo");
const SystemUtil = require("../util/system");

class MediaController {
  static async getProductMedia(req, res) {
    const productId = req.params.productId;
    const productMedia = await mediaRepo.getProductMedia(productId);
    if (productMedia) {
      res
        .status(200)
        .json({
          code: 200,
          message: "Data selected Successfully",
          data: productMedia,
        });
    } else if (productMedia === false) {
      res.status(200).json({
        status: false,
        code: "204",
        message: "No media found",
      });
    } else {
      res.status(500).json({
        status: false,
        message: "Unknown Error Happened",
      });
    }
  }
  static async create(req, res) {
    const id = req.body.productId;
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
    let data = await Promise.all(promises);
    
    if (data) {
      res
        .status(200)
        .json({ code: 200, message: "Data Inserted Successfully", data: data });
    } else if (temp === false) {
      res.status(500).json({
        status: false,
        message: "Unknown Error Happened",
      });
    } else {
      res.status(500).json({
        status: false,
        message: "Unknown Error Happened",
      });
    }
  }

  static async delete(req, res) {
    const id = req.params.id;
    const temp = await mediaRepo.deleteMedia(id);
    if (temp) {
      res
        .status(200)
        .json({
          status: true,
          message: "Element Has Been Deleted Successfully",
        });
    } else if (temp === false) {
      res.status(404).json({ status: false, message: "Element Not Exist" });
    } else {
      res
        .status(500)
        .json({ status: false, message: "Unknown Error Happened" });
    }
  }
  static async getMediaDetails(req, res) {
    const id = req.params.id;
    const temp = await mediaRepo.getMediaDetails(id);
    const processData = new Array();
    // temp.forEach(element => {
    // element.URL = element.URL.split("\\").slice(1).join("\\");
    // processData.push(element);
    // });

    if (temp) {
      res.status(200).json(temp);
    } else if (temp === false) {
      res.status(404).json({ status: false, message: "Element Not Exist" });
    } else {
      res
        .status(500)
        .json({ status: false, message: "Unknown Error Happened" });
    }
  }
  static getFormat(req, res) {
    res.status(200).json({
      Id: 1,
      URL: "شركة 4",
      Type: "image",
      IsActive: "1",
      productId: "1",
      UpdatedAt: "2024-03-15T08:24:07.869Z",
      CreatedAt: "2024-03-15T08:24:07.869Z",
    });
  }
}
module.exports = MediaController;
