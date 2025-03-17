const Attribute = require('../models/attribute.model');
const product = require('../models/product.model');
const { sequelize, Sequelize } = require('../config/sequelize.config');
const Media = require('../models/media.model');
const Brand = require('../models/brand.model');
const Category = require('../models/category.model');
const Variations = require('../models/vairation.model');
const Values = require('../models/values.model');
const ProductVariationValues = require('../models/productVariationValues.model');
const ProductFailure = require('../exceptions/ProductFailure');
const Product = require('../models/product.model');
const ProductNotExist = require('../exceptions/ProductNotExist');
const CreateProductFailure = require('../exceptions/CreateProductFailure');



class ProductRepo {
    static async getProductCategory(categoryId, page, limit, searchQuery = '%%') {

        const pageNumber = parseInt(page) || 1;
        const perPage = parseInt(limit) || 10;
        const offset = (pageNumber - 1) * perPage;
        let whereCondition = {
            [Sequelize.Op.and]: [
                { categoryId: categoryId },
                { IsActive: true },
                {

                    [Sequelize.Op.or]: [
                        { NameAr: { [Sequelize.Op.like]: `%${searchQuery}%` } },
                        { NameEn: { [Sequelize.Op.like]: `%${searchQuery}%` } },
                        { DescriptionAr: { [Sequelize.Op.like]: `%${searchQuery}%` } },
                        { DescriptionEn: { [Sequelize.Op.like]: `%${searchQuery}%` } },
                        { DetailsAr: { [Sequelize.Op.like]: `%${searchQuery}%` } },
                        { DetailsAr: { [Sequelize.Op.like]: `%${searchQuery}%` } },

                    ]
                }
            ]

        };


        try {
            // console.log(id != null);
            const temp = await product.findAndCountAll({
                include: [Media, Category, Brand],
                distinct: true,
                where: whereCondition, // Apply search condition if query exists
                limit: perPage,
                offset: offset,
                order: [
                    ['Id', 'DESC']
                ]
            });

            if (temp) {
                const totalPages = Math.ceil(temp.count / perPage);
                return {
                    total: temp.count,
                    totalPages: totalPages,
                    currentPage: pageNumber,
                    data: temp.rows
                };
            } else {
                throw new ProductFailure();
            }
        } catch (error) {
            throw error
        }

    }
    static async getProductBrand(brandId, page, limit, searchQuery = '%%') {

        const pageNumber = parseInt(page) || 1;
        const perPage = parseInt(limit) || 10;
        const offset = (pageNumber - 1) * perPage;
        let whereCondition = {
            [Sequelize.Op.and]: [
                { brandId: brandId },
                { IsActive: true },
                {
                    [Sequelize.Op.or]: [
                        { NameAr: { [Sequelize.Op.like]: `%${searchQuery}%` } },
                        { NameEn: { [Sequelize.Op.like]: `%${searchQuery}%` } },
                        { DescriptionAr: { [Sequelize.Op.like]: `%${searchQuery}%` } },
                        { DescriptionEn: { [Sequelize.Op.like]: `%${searchQuery}%` } },
                        { DetailsAr: { [Sequelize.Op.like]: `%${searchQuery}%` } },
                        { DetailsAr: { [Sequelize.Op.like]: `%${searchQuery}%` } },

                    ]
                }
            ]

        };


        try {
            // console.log(id != null);
            const temp = await product.findAndCountAll({
                include: [Media, Category, Brand],
                distinct: true,
                where: whereCondition, // Apply search condition if query exists
                limit: perPage,
                offset: offset,
                order: [
                    ['Id', 'DESC']
                ]
            });

            if (temp) {
                const totalPages = Math.ceil(temp.count / perPage);
                return {
                    total: temp.count,
                    totalPages: totalPages,
                    currentPage: pageNumber,
                    data: temp.rows
                };
            } else { throw new ProductFailure() }
        } catch (error) {
            throw error
        }

    }
    static async getProductForViewHomePage() {
        try {
            const data = await product.findAll({
                where: {
                    IsActive: true
                }, include: [Brand, Category, Media]
            })
            if (data) { return data; }
            else {
                return [];
            }
        } catch (error) {
            throw error
        }
    }
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
                throw new ProductNotExist()
            }
        } catch (error) {
            throw error
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

        try {
            // console.log(id != null);
            const temp = await product.findAndCountAll({
                distinct: true,
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
            if (temp) {
                const totalPages = Math.ceil(temp.count / perPage);
                return {
                    total: productId != null ? 1 : temp.count,
                    totalPages: productId != null ? 1 : totalPages,
                    currentPage: productId != null ? 1 : pageNumber,
                    data: temp.rows
                };
            } else {
                throw new ProductFailure()
            }
        } catch (error) {
            // console.log(error);
            
            throw error
        }

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
                throw new ProductNotExist()
            }
        } catch (error) {
            throw error
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
                throw new CreateProductFailure()
            }
        } catch (error) {
            throw error
        }
    }
    static async getProductDetails(id) {
        try {

            const temp = await product.findOne({
                include: [Brand, Category, Media, {
                    model: Attribute,
                    include: [Values],
                },
                    {
                        model: Variations,
                        include: [
                            {
                                model: ProductVariationValues,
                                include: [
                                    Values
                                ],
                            },
                        ],
                    },
                ],
                where: {
                    Id: id,
                }
            });
            if (temp) {
                const variations = temp.variations.map((variation) => {
                    return {
                        Id: variation.Id,
                        Price: variation.Price,
                        Stock: variation.Stock,
                        Values: variation.product_variation_values.map((value) => {
                            return ({
                                Id: value.value.Id,
                                ValueAr: value.value.ValueAr,
                                ValueEn: value.value.ValueEn,
                                HoverImageAr: value.value.HoverImageAr,
                                HoverImageEn: value.value.HoverImageEn,
                            })
                        }),
                    };
                });
                return { ...temp.dataValues, variations };
            }
            else {
                throw new ProductNotExist()
            }
        } catch (error) {
            throw error
        }
    }
}
module.exports = ProductRepo