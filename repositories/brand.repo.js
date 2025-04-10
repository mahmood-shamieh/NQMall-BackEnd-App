const brand = require('../models/brand.model');
const { sequelize, Sequelize } = require('../config/sequelize.config');
const { all } = require('../routes/user.routes');
const CreateBrandFailed = require('../exceptions/CreateBrandFailed');
const BrandFailure = require('../exceptions/BrandFailure');
const UpdateBrandFailure = require('../exceptions/UpdateBrandFaileur');
const BrandNotExist = require('../exceptions/BrandNotExist');



class BrandRepo {
    static async getBrandForView() {
        try {
            const data = await brand.findAll({
                where: {
                    IsActive: true
                }
            });
            if (data) {
                return data;
            }
            else {
                return []
            }
        } catch (error) {
            throw error
        }
    }
    static async addBrand(body) {
        try {
            const temp = await brand.create(body);
            if (temp) {
                return { ...temp.dataValues };
            }
            else {
                throw new CreateBrandFailed()
            }
        } catch (error) {
            throw error
        }
    }
    static async getBrandDetails(id, page, limit, searchQuery) {
        const pageNumber = parseInt(page) || 1;
        const perPage = parseInt(limit) || 10;
        const offset = (pageNumber - 1) * perPage;
        let whereCondition;
        if (id) {
            whereCondition = {
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
        try {
            const temp = await brand.findAndCountAll({
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
            } else { throw new BrandFailure() }
        } catch (error) {
            throw error;
        }

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
                return []
            }
        } catch (error) {
            throw error
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
                throw new UpdateBrandFailure()
            }
        } catch (error) {
            throw error;
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
                throw new BrandNotExist()
            }
        } catch (error) {
            throw error
        }
    }
}
module.exports = BrandRepo;