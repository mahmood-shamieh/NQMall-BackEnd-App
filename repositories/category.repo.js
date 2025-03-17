const category = require('../models/category.model')
// const Sequelize = require('../config/sequelize.config');
const { sequelize, Sequelize } = require('../config/sequelize.config');
const Product = require('../models/product.model');
const Brand = require('../models/brand.model');
const CategoryNotExist = require('../exceptions/CategoryNotExist');
const CreateCategoryFailure = require('../exceptions/CreateCategoryFailure');
const CategoryFailure = require('../exceptions/CategoryFailure');

class CategoryRepo {
    static async getCategoryForView() {
        try {
            const data = category.findAll({
                where: {
                    IsActive: 1
                }
            });
            if (data) { return data; }
            else {
                return [];
            }
        } catch (error) {
            throw error
        }
    } static async getCategoryBrands(categoryId) {
        // the returned value isn't unique you need to solve this section with also the brand category section
        try {
            const data = await Product.findAll({
                attributes: [],
                distinct: true,
                where: {
                    categoryId: categoryId
                }
                , include: [Brand]

            });
            if (data) {
                return data.map((element, index) => element.dataValues.brand);
            }
            else {
                throw new CategoryNotExist()
            }
        } catch (error) {
            throw error
        }
    }
    static async addCategory(body) {
        try {

            const temp = await category.create(body);
            if (temp) { return { ...temp.dataValues }; }
            else {
                throw new CreateCategoryFailure()
            }
        } catch (error) {
            throw error
        }
    }
    static async getCategoryDetails(id, page, limit, searchQuery) {
        const pageNumber = parseInt(page) || 1;
        const perPage = parseInt(limit) || 10;
        const offset = (pageNumber - 1) * perPage;
        let whereCondition;
        if (id) {
            whereCondition = {
                Id: id
            };
        } else {
            if (searchQuery) {
                whereCondition = {
                    [Sequelize.Op.or]: [
                        { NameAr: { [Sequelize.Op.like]: `%${searchQuery}%` } },
                        { NameEn: { [Sequelize.Op.like]: `%${searchQuery}%` } },
                        { DescriptionAr: { [Sequelize.Op.like]: `%${searchQuery}%` } },
                        { DescriptionEn: { [Sequelize.Op.like]: `%${searchQuery}%` } },

                    ]
                };
            }
        }
        try {
            const temp = await category.findAndCountAll({
                where: whereCondition, // Apply search condition if query exists
                distinct: true,
                limit: id != null ? 1 : perPage,
                offset: id != null ? 0 : offset,
                order: [
                    ['Id', 'DESC']
                ]
            });
            if (temp) {
                const totalPages = Math.ceil(temp.count / perPage);
                return {
                    total: id != null ? 1 : temp.count,
                    totalPages: id != null ? 1 : totalPages,
                    currentPage: id != null ? 1 : pageNumber,
                    data: temp.rows
                };
            }
            else {
                throw new CategoryFailure()
            }
        } catch (error) {
            throw error
        }

        // } catch (error) {

        //     return null;
        // }
    }
    static async getAllCategoriesDetails() {

        try {
            const temp = await category.findAll();
            if (temp) {
                let items = new Array();
                temp.forEach(element => {
                    items.push(element.dataValues);
                });
                return items;
            }
            else {
                return new CategoryFailure();
            }
        } catch (error) {
            throw error
        }


    }
    static async updateCategoryDetails(body) {
        try {
            const temp = await category.update(body, {
                where: {
                    Id: body.Id
                }
            });
            if (temp[0] === 1) {
                const updatedCategory = await category.findOne({
                    where: {
                        Id: body.Id
                    }
                });
                return { ...updatedCategory.dataValues };
            } else {
                throw new CategoryNotExist();
            }
        } catch (error) {
            throw error;
        }
    }
    static async deleteCategory(id) {
        try {
            const temp = await category.destroy({
                where: {
                    Id: id
                }
            });
            if (temp) {
                return true;
            }
            else {
                throw new CategoryNotExist();
            }
        } catch (error) {
            throw error
        }
    }
}
module.exports = CategoryRepo;
