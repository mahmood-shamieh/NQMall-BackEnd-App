

const Product = require('../models/product.model');
const user = require('../models/user.model')
class UserRepo {
    static async addUser(body) {
        try {
            const temp = await user.create(body);
            return { ...temp.dataValues };
        } catch (error) {
            return null;

        }
    }
    static async getUserDetails(id) {
        try {
            const temp = await user.findOne({
                where: {
                    Id: id
                }
                , include: [Product]
            });
            return { ...temp.dataValues };;
        } catch (error) {
            return null;

        }
    }
    static async updateUserDetails(body) {
        try {


            const temp = await user.update(body, {
                where: {
                    Id: body.Id
                }
            });
            if (temp[0] === 1) {
                const updatedUser = await user.findOne({
                    where: {
                        Id: body.Id
                    }
                });
                return { ...updatedUser.dataValues };
            } else {
                return null
            }
        } catch (error) {
            return null;
        }
    }
    static async deleteUser(id) {
        try {
            const temp = await user.destroy({
                where: {
                    Id: id
                }
            });
            if (temp) {
                return true
            }
            else {
                return false;
            }
        } catch (error) {
            return false;

        }

    }
}
module.exports = UserRepo;