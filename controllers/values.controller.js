const attributeRepo = require('../repositories/attribute.repo');
const ValuesRepo = require('../repositories/values.repo');





class ValuesController {
    static async getProductAttributeValues(req, res) {
        const attributeId = req.params.attributeId;
        const productAttributeValues = await ValuesRepo.getProductAttributeValues(attributeId);
        if (productAttributeValues) {
            res.status(200).json({ code: 200, message: "Data selected Successfully", data: productAttributeValues, });
        } else if (productAttributeValues === false) {
            res.status(200).json({ code: 204, message: 'No Values Found', status: false });
        }
        else {
            res.status(500).json({ message: 'Unknown Error Happened' });
        }
    }
    // media upload finished and we arrived to the attributes processing now
    static async create(req, res) {
        const body = req.body;
        const files = req.files;
        const temp = await ValuesRepo.create(body, files['HoverImageAr'] , files['HoverImageEn'] );
        if (temp) {
            res.status(200).json({ code: 200, message: "Data Inserted Successfully", data: temp, });
        } else if (temp === false) {
            res.status(500).json({ message: 'Error Creating value' });
        }
        else {
            res.status(500).json({ message: 'Unknown Error Happened' });
        }


    }
    static async edit(req, res) {
        const body = req.body;
        const files = req.files;
        // console.log(files);
        const temp = await ValuesRepo.edit(body, files['HoverImageAr'] , files['HoverImageEn'] );
        if (temp) {
            res.status(200).json({ code: 200, message: "Data Updated Successfully", data: temp, });
        } else if (temp === false) {
            res.status(500).json({ message: 'Error Updating value' });
        }
        else {
            res.status(500).json({ message: 'Unknown Error Happened' });
        }


    } static async createImageAttributeValue(req, res) {
        const attributeId = req.body.attributeId;
        const files = req.files;
        // console.log(req.files["itemsEn[]"]);
        // console.log(req.files["itemsAr[]"]);
        // console.log(req.files["mediaEn[]"]);
        // console.log(req.files["mediaAr[]"]);
        const temp = await ValuesRepo.createImageValues(attributeId, files["ValueAr"], files["ValueEn"], files["HoverImageAr"], files["HoverImageEn"]);

        if (temp) {
            res.status(200).json({ code: 200, message: "Data Inserted Successfully", data: temp, });
        } else if (temp === false) {
            res.status(500).json({ message: 'Error Creating image value' });
        }
        else {
            res.status(500).json({ message: 'Unknown Error Happened' });
        }


    }
    static async editImageAttributeValue(req, res) {
        const attributeId = req.body.attributeId;
        const id = req.body.Id;
        const files = req.files;
        // console.log(req.files["itemsEn[]"]);
        // console.log(req.files["itemsAr[]"]);
        // console.log(req.files["mediaEn[]"]);
        // console.log(req.files["mediaAr[]"]);
        const temp = await ValuesRepo.editImageValues(id,attributeId, files["ValueAr"], files["ValueEn"], files["HoverImageAr"], files["HoverImageEn"]);

        if (temp) {
            res.status(200).json({ code: 200, message: "Data Inserted Successfully", data: temp, });
        } else if (temp === false) {
            res.status(500).json({ message: 'Error Creating image value' });
        }
        else {
            res.status(500).json({ message: 'Unknown Error Happened' });
        }


    }
    static async deleteImageAttributeValue(req, res) {
        const id = req.params.id;
        const deletedItem = await ValuesRepo.deleteImageValue(id);
        if (deletedItem) {
            res.status(200).json({ code: 200, message: "Value deleted successfully", data: null, });
        } else if (deletedItem === false) {
            res.status(200).json({ code: 204, message: "Value not found", data: null, });
        } else {
            res.status(500).json({ code: 500, message: "Error happened", data: null, });
        }

    }
    static async deleteAttributesValue(req, res) {
        const id = req.params.id;
        const deletedItem = await ValuesRepo.deleteValue(id);
        if (deletedItem) {
            res.status(200).json({ code: 200, message: "Value deleted successfully", data: null, });
        } else if (deletedItem === false) {
            res.status(200).json({ code: 204, message: "Value not found", data: null, });
        } else {
            res.status(500).json({ code: 500, message: "Error happened", data: null, });
        }
    }
}
module.exports = ValuesController