const category = require('../models/category.model')
// const Sequelize = require('../config/sequelize.config');
const { sequelize, Sequelize } = require('../config/sequelize.config');
const Product = require('../models/product.model');
const Brand = require('../models/brand.model');

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
                return false;
            }
        } catch (error) {
            return null;
        }
    } static async getCategoryBrands(categoryId) {
        // the returned value isn't unique you need to solve this section with also the brand category section
        // try {
        const data = await Product.findAll({
            attributes: [],
            distinct: true,
            // attributes: [
            //     // specify an array where the first element is the SQL function and the second is the alias
            //     [Sequelize.fn('DISTINCT', Sequelize.col('country')), 'country'],
            // ],
            where: {
                categoryId: categoryId
            }
            , include: [Brand]
            // , group: ['brand.id',]6
        });

        // console.log(data);
        if (data) {
            return data.map((element, index) => element.dataValues.brand);
        }
        else {
            return false;
        }
        // } catch (error) {
        //     return null;
        // }
    }
    static async addCategory(body) {
        try {

            const temp = await category.create(body);
            return { ...temp.dataValues };
        } catch (error) {
            return null;
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

        // try {
        // console.log(id != null);
        const temp = await category.findAndCountAll({
            where: whereCondition, // Apply search condition if query exists
            distinct: true,
            limit: id != null ? 1 : perPage,
            offset: id != null ? 0 : offset,
            order: [
                ['Id', 'DESC']
            ]
        });
        // return { ...temp.dataValues };
        const totalPages = Math.ceil(temp.count / perPage);
        return {
            total: id != null ? 1 : temp.count,
            totalPages: id != null ? 1 : totalPages,
            currentPage: id != null ? 1 : pageNumber,
            data: temp.rows
        };

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
                return false;
            }
        } catch (error) {
            return null
        }


    }
    static async updateCategoryDetails(body) {
        console.log(body.Id);
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
                return null
            }
        } catch (error) {

            return null;
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
                return false;
            }
        } catch (error) {
            return null
        }
    }
}
module.exports = CategoryRepo;
