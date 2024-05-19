const brand = require("../models/brand.model")

const brandRepo = require('../repositories/brand.repo')
const SystemUtil = require("../util/system")





class BrandController {
    static async createNewBrand(req, res) {
        const body = req.body;

        if (req.files.length) {
            body.LogoSize = req.files[0].size;
            body.LogoUrl =
            SystemUtil.detectOS() === SystemUtil.OS_TYPE.MACOS
          ? req.files[0].path.split("/").slice(1).join("\\")
          : req.files[0].path.split("\\").slice(1).join("\\");
        }
        const addBrand = await brandRepo.addBrand(body);
        if (addBrand) {
            res.status(200).json({ code: 201, message: "Data Inserted Successfully", data: addBrand, });
            // res.status(201).json(addBrand);
        }
        else if (addBrand === null) {
            res.status(500).json({ message: 'Error creating user' });
        }
        else {
            res.status(500).json({
                status: false,
                message: 'Unknown Error Happened'
            })
        }
    }
    static async getBrandDetails(req, res) {
        const id = req.params.id;

        const brandDetails = await brandRepo.getBrandDetails(id, req.body.page, req.body.limit, req.body.searchQuery);
        if (brandDetails) {
            res.status(200).json({ code: 200, message: "Data Inserted Successfully", data: brandDetails, });
        } else if (brandDetails === false) {
            res.status(404).json(
                {
                    status: false,
                    message: "Element Not Found"
                }
            );
        } else {
            res.status(500).json({ message: 'Error Retrieving Data' });
        }
    }
    static async getAllBrandDetails(req, res) {
        // const id = req.params.id;

        const brandDetails = await brandRepo.getAllBrandDetails();
        if (brandDetails) {
            res.status(200).json({ code: 200, message: "Data Inserted Successfully", data: brandDetails, });
        } else if (brandDetails === false) {
            res.status(204).json();
        } else {
            res.status(500).json({ message: 'Error Retrieving Data' });
        }
    }
    static async updateBrandDetails(req, res) {
        const body = req.body;
        if (req.files.length) {
            body.LogoSize = req.files[0].size;
            body.LogoUrl = req.files[0].path;
        }
        const updatedBrand = await brandRepo.updateBrandDetails(body);
        if (updatedBrand) {
            res.status(200).json({ code: 200, message: "Data Inserted Successfully", data: updatedBrand, });
            // res.status(200).json()
        } else if (updatedBrand === false) {
            res.status(404).json({ status: false, message: "Element Not Found" });
        } else { res.status(500).json({ message: 'Error creating user' }); }
    }
    static async deleteBrand(req, res) {
        const id = req.params.id;
        const brandDeleted = brandRepo.deleteBrand(id);
        if (brandDeleted) {
            res.status(200).json({
                status: true,
                message: "Element Was Deleted Successfully"
            })
        } else if (brandDeleted === false) {
            res.status(404).json(
                {
                    status: false,
                    message: "Element Not Found"
                }
            )
        } else {
            res.status(500).json({ message: 'Error creating user', });
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