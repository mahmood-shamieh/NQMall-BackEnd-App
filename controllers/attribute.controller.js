const attributeRepo = require('../repositories/attribute.repo')





class AttributeController {
    static async getProductAttribute(req, res) {
        const productId = req.params.productId;
        const productAttributes = await attributeRepo.getProductAttributes(productId);
        if (productAttributes) {
            res.status(200).json({ code: 200, message: "Data selected Successfully", data: productAttributes, });
        } else if (productAttributes === false) {
            res.status(200).json({ code: 204, message: 'No Attribute Found', status: false });
        }
        else {
            res.status(500).json({ message: 'Unknown Error Happened' });
        }
    }
    // media upload finished and we arrived to the attributes processing now
    static async create(req, res) {
        const body = req.body;
        const temp = await attributeRepo.create(body);
        if (temp) {
            res.status(200).json({ code: 200, message: "Data Inserted Successfully", data: temp, });
        } else if (temp === false) {
            res.status(500).json({ message: 'Error Creating attribute' });
        }
        else {
            res.status(500).json({ message: 'Unknown Error Happened' });
        }


    }
    static async edit(req, res) {
        const body = req.body;
        const temp = await attributeRepo.edit(body);
        if (temp) {
            res.status(200).json({ code: 200, message: "Data Updated Successfully", data: temp, });
        } else if (temp === false) {
            res.status(500).json({ message: 'Error Updating  attribute' });
        }
        else {
            res.status(500).json({ message: 'Unknown Error Happened' });
        }


    }
    static async createImageAttribute(req, res) {
        const body = req.body;
        
        const temp = await attributeRepo.createImageAttribute(body, req.files["mediaAr[]"], req.files["itemsAr[]"], req.files["mediaEn[]"], req.files["itemsEn[]"]);

        if (temp) {
            res.status(200).json({ code: 200, message: "Data Inserted Successfully", data: temp, });
        } else if (temp === false) {
            res.status(500).json({ message: 'Error Creating Attribute' });
        }
        else {
            res.status(500).json({ message: 'Unknown Error Happened' });
        }


    }
    static async deleteImageAttributes(req, res) {
        const id = req.params.id;
        const deletedItem = await attributeRepo.deleteImageAttribute(id);
        if (deletedItem) {
            res.status(200).json({ code: 200, message: "attribute deleted successfully", data: null, });
        } else if (deletedItem === false) {
            res.status(200).json({ code: 204, message: "attribute not found", data: null, });
        } else {
            res.status(500).json({ code: 500, message: "Error happened", data: null, });
        }

    }
    static async deleteAttributes(req, res) {
        const id = req.params.id;
        const deletedItem = await attributeRepo.deleteAttribute(id);
        if (deletedItem) {
            res.status(200).json({ code: 200, message: "attribute deleted successfully", data: null, });
        } else if (deletedItem === false) {
            res.status(200).json({ code: 204, message: "attribute not found", data: null, });
        } else {
            res.status(500).json({ code: 500, message: "Error happened", data: null, });
        }
    }
}
module.exports = AttributeController