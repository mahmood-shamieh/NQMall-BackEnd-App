const mediaRepo = require('../repositories/media.repo')
const productRepo = require('../repositories/product.repo')





class ProductController {
    static async updateProductDetails(req, res) {
        const body = req.body;
        const updatedProduct = await productRepo.updateProduct(body);
        if (updatedProduct) {
            res.status(200).json({ code: 200, message: "Data updated Successfully", data: updatedProduct, });
        } else if (updatedProduct == null) {
            res.status(200).json({ code: 404, message: "No Content Found", data: null, });
        } else {
            res.status(500).json({ code: 500, message: "Unknown Error Happened", data: null, });

        }

    }
    static async getProductDetails(req, res) {
        const productId = req.params.id;
        const page = req.body.page;
        const limit = req.body.limit;
        const searchQuery = req.body.searchQuery;
        const products = await productRepo.getAllProduct(productId, page, limit, searchQuery);
        if (products) {
            res.status(200).json({ code: 200, message: "Data Inserted Successfully", data: products, });
        } else if (products == null) {
            res.status(404).json({ code: 404, message: "No Content Found", data: null, });
        } else {
            res.status(500).json({ code: 500, message: "Unknown Error Happened", data: null, });

        }
    }
    static async deleteProduct(req, res) {
        const productId = req.params.productId;
        const deletedProduct = await productRepo.deleteProduct(productId);
        if (deletedProduct) {
            res.status(200).json({ code: 200, message: "Product Deleted Successfully", data: deletedProduct, });
        } else if (deletedProduct === false) {
            res.status(300).json({ status: false, code: 204, message: 'Product Not Found' });
        }
        else {
            res.status(500).json({ message: 'Error creating product' });
        }

    }
    // media upload finished and we arrived to the attributes processing now
    static async create(req, res) {
        const body = req.body;
        const temp = await productRepo.createProduct(body);
        if (temp) {
            // if (req.files.length) {
            //     const promises = req.files.map((element) => {
            //         return mediaRepo.addMedia({
            //             URL: element.path.split("\\").slice(1).join("\\"),
            //             Type: element.mimetype.split("/")[0],
            //             Size: element.size,
            //             IsActive: true,
            //             productId: temp.Id,

            //         });
            //     });
            //     let data = await Promise.all(promises);
            //     temp.media = data;
            // }
            res.status(200).json({ code: 200, message: "Data Inserted Successfully", data: temp, });
        } else if (temp === false) {
            res.status(500).json({ message: 'Error creating product' });
        }
        else {
            res.status(500).json({ message: 'Error creating product' });
        }


    }
}
module.exports = ProductController