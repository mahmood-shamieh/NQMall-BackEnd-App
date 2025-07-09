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
const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');





class ProductRepo {
    static async uploadProductFileProcess(file) {
        const failedRowsPath = path.join(path.dirname(file.path), 'failed_rows.csv');
        // Clear the failed_rows.csv file before processing
        if (fs.existsSync(failedRowsPath)) {
            fs.truncateSync(failedRowsPath, 0);
        }
        let headerWritten = false;
        try {
            let i = 0;
            fs.createReadStream(file.path)
                .pipe(csv())
                .on('data', async (row) => {
                    const transaction = await sequelize.transaction();
                    try {
                        if (row.attributes == "null" || row.attributes == "") throw "";
                        i += 1;
                        console.log(i);
                        let tempDetailsAr = row.detailsAr.split('|').map(e => e.trim());
                        const tempDetailsArMap = {};
                        tempDetailsAr.forEach(entry => {
                            const [key, value] = entry.split(':').map(part => part.trim());
                            tempDetailsArMap[key] = value;
                        });
                        let tempDetailsEn = row.detailsEn.split('|').map(e => e.trim());
                        const tempDetailsEnMap = {};
                        tempDetailsEn.forEach(entry => {
                            const [key, value] = entry.split(':').map(part => part.trim());
                            tempDetailsEnMap[key] = value;
                        });
                        const element = {
                            NameAr: row.nameAr == 'null' || row.nameAr == '' ? null : row.nameAr,
                            NameEn: row.nameEn == 'null' || row.nameEn == '' ? null : row.nameEn,
                            DescriptionAr: row.descriptionAr == 'null' || row.descriptionAr == '' ? null : row.descriptionAr,
                            DescriptionEn: row.descriptionEn == 'null' || row.descriptionEn == '' ? null : row.descriptionEn,
                            Price: parseInt(row.price.split(',')[0].trim()),
                            SalePrice: row.salesPrice == 'null' || row.salesPrice == '' ? null : row.salesPrice,
                            DetailsAr: tempDetailsArMap,
                            DetailsEn: tempDetailsEnMap,
                            BrandId: row.brand == 'null' || row.brand == '' ? null : row.brand,
                            CategoryId: row.category == 'null' || row.category == '' ? null : row.category,
                        };
                        let addedProduct = await Product.create(element, { transaction });
                        addedProduct = addedProduct.get({ plain: true });
                        let mediaModel = {
                            URL:
                                'media\\defaultImage.jpg',
                            Type: "image",
                            Size: 120,
                            IsActive: true,
                            productId: addedProduct.Id,
                        };
                        let addedMedia = await Media.create(mediaModel, { transaction });
                        const tempAttribute = row.attributes.split('>').map(e => e.trim())[0];
                        let attributeModel = {
                            NameAr: tempAttribute.split(":").map(e => e.trim())[1],
                            NameEn: tempAttribute.split(":").map(e => e.trim())[0],
                            IsActive: true,
                            productId: addedProduct.Id,
                            Type: "items"
                        }
                        let addedAttribute = await Attribute.create(attributeModel, { transaction });
                        addedAttribute = addedAttribute.get({ plain: true })
                        const tempValues = row.attributes.split('>').map(e => e.trim())[1].split('،');
                        for (let index = 0; index < tempValues.length; index++) {
                            const values = tempValues[index].split('_').map(e => e.trim());
                            const tempVariation = {
                                Price: values[1],
                                Stock: values[2],
                                productId: addedProduct.Id
                            }
                            let addedVariation = await Variations.create(tempVariation, { transaction });
                            addedVariation = addedVariation.get({ plain: true })
                            const tempValue = {
                                ValueAr: values[0].split(':').map(e => e.trim())[1],
                                ValueEn: values[0].split(':').map(e => e.trim())[0],
                                HoverImageAr: null,
                                HoverImageEn: null,
                                attributeId: addedAttribute.Id
                            }
                            let addedValue = await Values.create(tempValue, { transaction });
                            addedValue = addedValue.get({ plain: true });
                            const tempVariationValues = {
                                valueId: addedValue.Id,
                                variationId: addedVariation.Id
                            };
                            let addedVariationValues = await ProductVariationValues.create(tempVariationValues, { transaction });
                            addedVariationValues = addedVariationValues.get({ plain: true });
                        }
                        await transaction.commit();
                    } catch (error) {
                        await transaction.rollback();
                        const fileExists = fs.existsSync(failedRowsPath);
                        if (!fileExists) {
                            fs.appendFileSync(failedRowsPath, Object.keys(row).join(',') + '\n');
                        }
                        fs.appendFileSync(failedRowsPath, Object.values(row).map(v => '"'+String(v).replace(/"/g, '""')+'"').join(',') + '\n');
                    }
                })
                .on('end', () => {
                    console.log('CSV file successfully processed');
                });
        } catch (error) {
            console.log(error);
            throw error
        }
    }
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
                },
                include: [Brand, Category, Media],
                limit: 16, // You can adjust the limit as needed
                order: [
                    ['createdAt', 'DESC']
                ]
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
    static async getAllProduct(productId, page, limit, searchQuery, categoryId, brandId) {
        const pageNumber = parseInt(page) || 1;
        const perPage = parseInt(limit) || 10;
        const offset = (pageNumber - 1) * perPage;
        let whereCondition = {};
        if (productId) {
            whereCondition = {
                Id: productId
            };
        } else {

            // if (searchQuery) {
            //     whereCondition = {
            //         [Sequelize.Op.or]: [
            //             { NameAr: { [Sequelize.Op.like]: `%${searchQuery}%` } },
            //             { NameEn: { [Sequelize.Op.like]: `%${searchQuery}%` } },
            //             { DescriptionAr: { [Sequelize.Op.like]: `%${searchQuery}%` } },
            //             { DescriptionEn: { [Sequelize.Op.like]: `%${searchQuery}%` } },
            //             { DetailsAr: { [Sequelize.Op.like]: `%${searchQuery}%` } },
            //             { DetailsAr: { [Sequelize.Op.like]: `%${searchQuery}%` } },
            //         ]
            //     };
            // }
            const searchConditions = [];

            if (searchQuery) {
                searchConditions.push(
                    { NameAr: { [Sequelize.Op.like]: `%${searchQuery}%` } },
                    { NameEn: { [Sequelize.Op.like]: `%${searchQuery}%` } },
                    { DescriptionAr: { [Sequelize.Op.like]: `%${searchQuery}%` } },
                    { DescriptionEn: { [Sequelize.Op.like]: `%${searchQuery}%` } },
                    { DetailsAr: { [Sequelize.Op.like]: `%${searchQuery}%` } },
                    { DetailsEn: { [Sequelize.Op.like]: `%${searchQuery}%` } }
                );
            }
            if (searchConditions.length > 0) {
                whereCondition[Sequelize.Op.and] = [
                    { [Sequelize.Op.or]: searchConditions }
                ];
            } else {
                whereCondition[Sequelize.Op.and] = [];
            }

            // Add AND filters for Category and Brand if present
            // if (categoryId) {
            //     whereCondition[Sequelize.Op.and].push({ CategoryId: categoryId });
            // }
            // if (brandId) {
            //     whereCondition[Sequelize.Op.and].push({ BrandId: brandId });
            // }
            if (categoryId) {
                whereCondition[Sequelize.Op.and].push({
                    CategoryId: Array.isArray(categoryId)
                        ? { [Sequelize.Op.in]: categoryId }
                        : categoryId
                });
            }

            if (brandId) {
                whereCondition[Sequelize.Op.and].push({
                    BrandId: Array.isArray(brandId)
                        ? { [Sequelize.Op.in]: brandId }
                        : brandId
                });
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
            console.log(error);

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