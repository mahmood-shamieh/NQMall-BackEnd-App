const brand = require('../models/brand.model');
const { sequelize, Sequelize } = require('../config/sequelize.config');
const { all } = require('../routes/user.routes');



class BrandRepo {

    static async addBrand(body) {
        try {

            const temp = await brand.create(body);
            if (temp) {
                return { ...temp.dataValues };
            }
            else {
                return false;
            }
        } catch (error) {
            return null;
        }
    }
    static async getBrandDetails(id, page, limit, searchQuery) {
        const pageNumber = parseInt(page) || 1;
        const perPage = parseInt(limit) || 10;
        const offset = (pageNumber - 1) * perPage;

        let whereCondition;
        if (id) {
            whereCondition: {
                Id: id
            }
        }
        else {
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
        const temp = await brand.findAndCountAll({
            where: whereCondition, // Apply search condition if query exists
            limit: id != null ? 1 : perPage,
            offset: id != null ? 0 : offset,
            order: [
                ['Id', 'DESC']
            ]
        });
        console.log(whereCondition);
        const totalPages = Math.ceil(temp.count / perPage);
        return {
            total: id != null ? 1 : temp.count,
            totalPages: id != null ? 1 : totalPages,
            currentPage: id != null ? 1 : pageNumber,
            data: temp.rows
        };
        // try {

        //     let temp;
        //     let allBrand = [];
        //     if (id) {
        //         temp = await brand.findOne({
        //             where: {
        //                 Id: id
        //             }
        //         });
        //         if (temp) {
        //             return { ...temp.dataValues };
        //         }
        //         else {
        //             return false;
        //         }

        //     }
        //     else {
        //         temp = await brand.findAll();

        //         temp.forEach(element => {
        //             allBrand.push(element.dataValues);
        //         });
        //     }
        //     if (temp) {
        //         return allBrand;
        //     }
        //     else {
        //         return false
        //     }
        // } catch (error) {
        //     return null;
        // }
    }
    static async getAllBrandDetails() {

        try {
            const temp = await brand.findAll();
            if (temp) {
                let items = new Array();
                temp.forEach(element => {
                    items.push(element.dataValues);
                });
                return items;

            } else {
                return false;

            }

        } catch (error) {
            return null;
        }


    }
    static async updateBrandDetails(body) {
        try {

            const temp = await brand.update(body, {
                where: {
                    Id: body.Id
                }
            });
            if (temp) {
                const updatedBrand = await brand.findOne({
                    where: {
                        Id: body.Id
                    }
                });
                return { ...updatedBrand.dataValues };
            }
            else {
                return false;
            }
        } catch (error) {
            return null;
        }
    }
    static async deleteBrand(id) {
        try {

            const temp = await brand.destroy({
                where: {
                    Id: id
                }
            });
            if (temp) {
                return true;
            }
            else {
                return false
            }
        } catch (error) {
            return null;
        }
    }
}
module.exports = BrandRepo;