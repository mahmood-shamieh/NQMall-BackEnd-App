const attributeRepo = require('../repositories/attribute.repo');
const ValuesRepo = require('../repositories/values.repo');
const VariationsRepo = require('../repositories/variations.repo');





class ValuesController {
    static async getProductVariations(req, res) {
        const productId = req.params.productId;
        const productVariations = await VariationsRepo.getProductVariations(productId);
        if (productVariations) {
            res.status(200).json({ code: 200, message: "Data selected Successfully", data: productVariations, });
        } else if (productVariations === false) {
            res.status(200).json({ code: 204, message: 'No Values Found', status: false });
        }
        else {
            res.status(500).json({ message: 'Unknown Error Happened' });
        }
    }
    //
    static async updateVariation(req, res) {
        const body = req.body;
        const productVariations = await VariationsRepo.edit(body);
        console.log(productVariations);
        if (productVariations) {
            res.status(200).json({ code: 200, message: "Data selected Successfully", data: productVariations, });
        } else if (productVariations === false) {
            res.status(200).json({ code: 204, message: 'No Variation Found', status: false });
        }
        else {
            res.status(500).json({ message: 'Unknown Error Happened' });
        }
    }

    static async create(req, res) {
        const body = req.body;
        const temp = await VariationsRepo.create(body);
        if (temp) {
            res.status(200).json({ code: 200, message: "Data Inserted Successfully", data: temp, });
        } else if (temp === false) {
            res.status(500).json({ message: 'Error Creating variation' });
        }
        else {
            res.status(500).json({ message: 'Unknown Error Happened' });
        }


    }
    static async deleteVariations(req, res) {
        const id = req.params.id;
        const deletedItem = await VariationsRepo.deleteVariation(id);
        if (deletedItem) {
            res.status(200).json({ code: 200, message: "Variation deleted successfully", data: null, });
        } else if (deletedItem === false) {
            res.status(200).json({ code: 204, message: "Variation not found", data: null, });
        } else {
            res.status(500).json({ code: 500, message: "Error happened", data: null, });
        }

    }

}
module.exports = ValuesController