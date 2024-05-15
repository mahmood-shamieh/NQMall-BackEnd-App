const Attribute = require('../models/attribute.model');
const product = require('../models/product.model');
const { sequelize, Sequelize } = require('../config/sequelize.config');
const Media = require('../models/media.model');



class ProductRepo {
    static async updateProduct(body) {
        const productId = body.Id;
        try {
            const updatedProduct = await product.update(
                body
                ,
                {
                    where: {
                        Id: productId
                    }
                });
            if (updatedProduct) {
                const data = await product.findOne({
                    where: {
                        Id: productId
                    }
                });
                return { ...data.dataValues };
            }
            else {
                return false;
            }
        } catch (error) {
            return null;
        }
    }
    static async getAllProduct(productId, page, limit, searchQuery) {
        const pageNumber = parseInt(page) || 1;
        const perPage = parseInt(limit) || 10;
        const offset = (pageNumber - 1) * perPage;
        let whereCondition;
        if (productId) {
            whereCondition = {
                Id: productId
            };
        } else {
            if (searchQuery) {
                whereCondition = {
                    [Sequelize.Op.or]: [
                        { NameAr: { [Sequelize.Op.like]: `%${searchQuery}%` } },
                        { NameEn: { [Sequelize.Op.like]: `%${searchQuery}%` } },
                        { DescriptionAr: { [Sequelize.Op.like]: `%${searchQuery}%` } },
                        { DescriptionEn: { [Sequelize.Op.like]: `%${searchQuery}%` } },
                        { DetailsAr: { [Sequelize.Op.like]: `%${searchQuery}%` } },
                        { DetailsAr: { [Sequelize.Op.like]: `%${searchQuery}%` } },

                    ]
                };
            }
        }

        // try {
        // console.log(id != null);
        const temp = await product.findAndCountAll({
            include: [{
                model: Media,
                as: 'media' // Ensure the 'as' matches the alias in the association
            }]
            ,
            where: whereCondition, // Apply search condition if query exists
            limit: productId != null ? 1 : perPage,
            offset: productId != null ? 0 : offset,
            order: [
                ['Id', 'DESC']
            ]
        });
        // return { ...temp.dataValues };
        const totalPages = Math.ceil(temp.count / perPage);
        return {
            total: productId != null ? 1 : temp.count,
            totalPages: productId != null ? 1 : totalPages,
            currentPage: productId != null ? 1 : pageNumber,
            data: temp.rows
        };

    }
    static async deleteProduct(productId) {
        try {
            const deletedProduct = await product.destroy({
                where: {
                    Id: productId
                }
            });

            if (deletedProduct) {
                return true;
            } else {
                return false;
            }
        } catch (error) {
            return null;

        }
    }
    static async createProduct(body) {
        try {

            const temp = await product.create(body);
            if (temp) {
                let createdProduct = temp.dataValues;
                createdProduct.Price = parseInt(createdProduct.Price);
                createdProduct.SalePrice = parseInt(createdProduct.SalePrice);
                createdProduct.userId = parseInt(createdProduct.userId);
                createdProduct.categoryId = parseInt(createdProduct.categoryId);
                createdProduct.brandId = parseInt(createdProduct.brandId);
                createdProduct.IsActive = !!createdProduct.IsActive;
                return createdProduct;
            }
            else {
                return false;
            }
        } catch (error) {
            return null;
        }
    }
    // static async getProductDetails(id) {
    //     try {

    //         let temp;
    //         let allBrand = [];
    //         if (id) {
    //             temp = await product.findOne({
    //                 where: {
    //                     Id: id
    //                 }
    //             });
    //             if (temp) {
    //                 return { ...temp.dataValues };
    //             }
    //             else {
    //                 return false;
    //             }

    //         }
    //         else {
    //             temp = await product.findAll();

    //             temp.forEach(element => {
    //                 allBrand.push(element.dataValues);
    //             });
    //         }
    //         if (temp) {
    //             return allBrand;
    //         }
    //         else {
    //             return false
    //         }
    //     } catch (error) {
    //         return null;
    //     }
    // }
}
module.exports = ProductRepo