
const categoryRepo = require('../repositories/category.repo')
class CategoryController {
    static async create(req, res) {
        const body = req.body;
        if (req.files.length) {
            body.ImageSize = req.files[0].size;
            body.ImageURL = req.files[0].path.split('\\').slice(1).join('\\');
        }
        const createdCategory = await categoryRepo.addCategory(body);
        if (createdCategory) {
            res.status(200).json({ code: 200, message: "Data Inserted Successfully", data: createdCategory, });
        }
        else if (createdCategory === false) {
            res.status(500).json({ code: 500, message: "Error Creating Category", data: null, });
        }
        else {
            res.status(500).json({ code: 500, message: "Unknown Error Happened", data: null, });
        }
    }
    static async getCategoryDetails(req, res) {
        // Define pagination parameters

        const id = req.params.id;
        const page = req.body.page;
        const limit = req.body.limit;
        const searchQuery = req.body.searchQuery;
        const updatedCategory = await categoryRepo.getCategoryDetails(id, page, limit, searchQuery);
        if (updatedCategory) {
            res.status(200).json({ code: 200, message: "Data Inserted Successfully", data: updatedCategory, });
        } else if (updatedCategory == null) {
            res.status(404).json({ code: 404, message: "No Content Found", data: null, });
        } else {
            res.status(500).json({ code: 500, message: "Unknown Error Happened", data: null, });

        }

    } static async getAllCategories(req, res) {
        // Define pagination parameters


        const updatedCategory = await categoryRepo.getAllCategoriesDetails();
        if (updatedCategory) {
            res.status(200).json({ code: 200, message: "Data Inserted Successfully", data: updatedCategory, });
        } else if (updatedCategory == null) {
            res.status(404).json({ code: 404, message: "No Content Found", data: null, });
        } else {
            res.status(500).json({ code: 500, message: "Unknown Error Happened", data: null, });

        }

    }
    static async updateCategoryDetails(req, res) {
        const body = req.body;

        if (req.files.length) {
            body.ImageSize = req.files[0].size;
            body.ImageURL = req.files[0].path.split('\\').slice(1).join('\\');
        }
        const updatedCategory = await categoryRepo.updateCategoryDetails(body);
        if (updatedCategory) {
            res.status(200).json({ code: 200, message: "Data Inserted Successfully", data: updatedCategory, });
            // res.status(200).json(updatedCategory);
        }
        else if (updatedCategory === false) {
            res.status(404).json({ code: 404, message: "No Content Found", data: null, });
        }
        else {
            res.status(500).json({ code: 500, message: "Unknown Error Happened", data: null, });
        }
    }
    static async deleteCategory(req, res) {
        const id = req.params.id;
        const categoryDeleted = await categoryRepo.deleteCategory(id);
        if (categoryDeleted) {
            res.status(200).json({ code: 200, message: "Element Was Deleted Successfully", data: null, });
        } else if (categoryDeleted === false) {
            res.status(404).json({ code: 404, message: "No Content Found", data: null, });
        } else {
            res.status(500).json({ code: 500, message: "Unknown Error Happened", data: null, });
        }

    }
    static async getFormat(req, res) {
        res.status(200).send({
            "NameAr": "",
            "NameEn": "",
            "DescriptionAr": "",
            "DescriptionEn": "",
            "ImageURL": "",
            "IsActive": "1"

        });
    }


}

module.exports = CategoryController;