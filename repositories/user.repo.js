

const { log } = require('winston');
const { sequelize, Sequelize } = require('../config/sequelize.config');
const AuthMiddleware = require('../middlewares/auth.middleware');
const Product = require('../models/product.model');
const User = require('../models/user.model');
const user = require('../models/user.model');
const PasswordEncryptionUtility = require('../util/passwordEncryption.utility');
const TokenUtility = require('../util/token.utility');
const ResponseModel = require('../models/response.model');
const EmailUsed = require('../exceptions/EmailUsed');
const PhoneNumberUsed = require('../exceptions/PhoneNumberUsed');
const UserNotFound = require('../exceptions/UserNotExists');
const NotificationService = require('../services/notification.service');
const ApplicationTopics = require('../util/Application_topics');
const AdminPrev = require('../models/admin_prev.model');
const Section = require('../models/section.model');
const AppConfig = require('../models/app_config');
class UserRepo {
    static async addUser(body) {
        const transaction = await sequelize.transaction(); // Start transaction
        try {
            const userDate = {
                Email: body.Email,
                PasswordHash: await PasswordEncryptionUtility.encrypt(body.Password),
                FullName: body.FullName,
                Address: body.Address,
                PhoneNumber: body.PhoneNumber,
                Role: body.Role,

            }
            const validateEmail = await User.findOne({
                where: {
                    Email: userDate.Email
                }
            })
            if (validateEmail) {
                throw new EmailUsed();
            }
            const validatePhoneNumber = await User.findOne({
                where: {
                    PhoneNumber: userDate.PhoneNumber
                }
            })
            if (validatePhoneNumber) {
                throw new PhoneNumberUsed();
            }

            const temp = await user.create(userDate, { transaction });
            const token = TokenUtility.generateSecurityToken({
                Id: temp.Id,
            });
            const updatedUser = { ...temp.dataValues, Token: token }
            const finalUserData = await User.update(updatedUser, {
                where: {
                    Id: updatedUser.Id
                }, transaction
            })
            await transaction.commit();
            return { ...updatedUser };
        } catch (error) {
            await transaction.rollback()
            throw error;

        }
    }
    static async AddAdmin(body) {
        const transaction = await sequelize.transaction(); // Start transaction
        try {
            const userDate = {
                Email: body.Email,
                PasswordHash: await PasswordEncryptionUtility.encrypt(body.Password),
                FullName: body.FullName,
                Address: body.Address,
                PhoneNumber: body.PhoneNumber,
                Role: "admin",

            }
            const validateEmail = await User.findOne({
                where: {
                    Email: userDate.Email
                }
            })
            if (validateEmail) {
                throw new EmailUsed();
            }
            const validatePhoneNumber = await User.findOne({
                where: {
                    PhoneNumber: userDate.PhoneNumber
                }
            })
            if (validatePhoneNumber) {
                throw new PhoneNumberUsed();
            }

            const temp = await user.create(userDate, { transaction });
            const token = TokenUtility.generateSecurityToken({
                Id: temp.Id,
            });
            const updatedUser = { ...temp.dataValues, Token: token }
            const finalUserData = await User.update(updatedUser, {
                where: {
                    Id: updatedUser.Id
                }, transaction
            })
            await transaction.commit();
            return { ...updatedUser };
        } catch (error) {
            await transaction.rollback()
            throw error;

        }
    }
    static async logIn(body,lang) {       
        try {
            const userDate = {
                Email: body.username,
                PhoneNumber: body.username,
                Password: body.password,
            }
            const validateUser = await User.findOne({
                where: {
                    [Sequelize.Op.or]: {
                        PhoneNumber: userDate.PhoneNumber,
                        Email: userDate.Email
                    },
                }
            })

            if (validateUser) {
                const passwordValid = await PasswordEncryptionUtility.compare({ hashedPassword: validateUser.dataValues.PasswordHash, password: userDate.Password });
                if (!passwordValid) {
                    return false;
                }
                const token = TokenUtility.generateSecurityToken({
                    Id: validateUser.Id,
                });

                const updatedUser = {
                    ...validateUser.dataValues, Token: token, FcmToken: body.fcmToken, Lang: lang
                }
                if (updatedUser.FcmToken != null && updatedUser.FcmToken != "") {
                    if (updatedUser.Role === "admin") {
                        NotificationService.subscribeToTopic([updatedUser.FcmToken], ApplicationTopics.admins);
                    }
                    else {
                        NotificationService.subscribeToTopic([updatedUser.FcmToken], ApplicationTopics.users);
                    }
                }

                const finalUserData = await User.update(updatedUser, {
                    where: {
                        Id: updatedUser.Id
                    },
                });


                const appConfig = await AppConfig.findAll();
                const finalAppConfig = appConfig.map(item => item.dataValues);

                if (updatedUser.Role === "admin") {
                    const finalUser = await User.findOne({
                        where: {
                            Id: updatedUser.Id
                        }, include: [{ model: AdminPrev, include: [{ model: Section }] }]
                    })
                    return { ...finalUser.dataValues, appConfig: finalAppConfig[0] };
                } else {
                    return { ...updatedUser, appConfig: finalAppConfig[0] };
                }

            }
            else {
                return false
            }
        } catch (error) {
            throw error;
        }
    }
    static async getUserDetails(id) {
        try {
            const temp = await user.findOne({
                where: {
                    Id: id
                }
            });
            if (temp)
                return { ...temp.dataValues };
            else throw new UserNotFound();
        } catch (error) {
            throw error

        }
    }

    static async updateUserDetails(body) {
        try {
            const token = TokenUtility.generateSecurityToken({
                Id: body.Id,
            });
            let updatedData = { ...body, PasswordHash: await PasswordEncryptionUtility.encrypt(body.PasswordHash), Token: token };
            const temp = await user.update(updatedData, {
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
                throw new UserNotFound()
            }
        } catch (error) {
            throw error;
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
                throw new UserNotFound()
            }
        } catch (error) {
            throw error
        }

    }
}
module.exports = UserRepo;