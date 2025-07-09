const { Sequelize } = require("../config/sequelize.config");
const User = require("../models/user.model");
const UserRepo = require("../repositories/user.repo");
const TokenUtility = require("../util/token.utility");
const Section = require("../models/section.model");
const AdminPrev = require("../models/admin_prev.model");
const ActionsUtility = require("../util/Action.utility");
const ResponseModel = require("../models/response.model");
const MyLogger = require("../util/logging.utility");

class AuthMiddleware {
    // static validate(req, res, next) {
    //     const errors = validationResult(req);
    //     if (!errors.isEmpty()) {
    //         return res.status(500).json({ errors: errors.array() });
    //     }
    //     next();
    // }

    static async Auth(req, res, next, section, action) {
        const token = req.headers.authorization?.split(' ')[1] ?? req.headers.authorization?.split(' ')[1] ?? null;
        const lang = req.headers.lang || 'en';

        if (!token) {
            const temp = ResponseModel.getUnauthorizedResponse(
                lang === "en" ? "Access denied, no token provided" : "تم رفض الوصول، لم يتم تقديم رمز",
                null
            );
            MyLogger.info(`${temp.code}|${temp.message}|${JSON.stringify(temp.data)}`);
            return res.status(401).json(temp);
        }

        const validate = TokenUtility.validateToken(token);
        if (validate) {
            req.headers.userId = validate.payload.Id;
            const temp = await User.findOne({
                where: {
                    Id: validate.payload.Id
                }
            });

            if (temp) {
                let user = temp.dataValues;
                if (user.IsActive) {
                    req.user = user;
                    next();
                } else {
                    const temp = ResponseModel.getUnauthorizedResponse(
                        lang === "en" ? "Access denied, your account has been temporarily disabled" : "تم رفض الوصول، تم تعطيل حسابك مؤقتًا",
                        null
                    );
                    MyLogger.info(`${temp.code}|${temp.message}|${JSON.stringify(temp.data)}`);
                    res.status(401).json(temp);
                }
            } else {
                const temp = ResponseModel.getUnauthorizedResponse(
                    lang === "en" ? "Access denied, the token provided isn't valid" : "تم رفض الوصول، الرمز المقدم غير صالح",
                    null
                );
                MyLogger.info(`${temp.code}|${temp.message}|${JSON.stringify(temp.data)}`);
                res.status(401).json(temp);
            }
        } else {
            const temp = ResponseModel.getUnauthorizedResponse(
                lang === "en" ? "Access denied, the token provided isn't valid" : "تم رفض الوصول، الرمز المقدم غير صالح",
                null
            );
            MyLogger.info(`${temp.code}|${temp.message}|${JSON.stringify(temp.data)}`);
            res.status(401).json(temp);
        }
    }
    static async AuthAdminAndVendor(req, res, next, section, action) {
        const token = req.headers.authorization?.split(' ')[1] ?? req.headers.authorization?.split(' ')[1] ?? null;
        const lang = req.headers.lang || 'en';

        if (!token) {
            const temp = ResponseModel.getUnauthorizedResponse(
                lang === "en" ? "Access denied, no token provided" : "تم رفض الوصول، لم يتم تقديم رمز",
                null
            );
            MyLogger.info(`${temp.code}|${temp.message}|${JSON.stringify(temp.data)}`);
            return res.status(401).json(temp);
        }

        const validate = TokenUtility.validateToken(token);
        if (validate) {
            req.headers.userId = validate.payload.Id;

            const temp = await User.findOne({
                where: {
                    [Sequelize.Op.and]: [
                        { Id: validate.payload.Id },
                        {
                            [Sequelize.Op.or]: [
                                { Role: "admin" },
                                { Role: "vendor" }
                            ]
                        }
                    ]
                }
            });

            if (temp) {
                let user = temp.dataValues;
                if (user.IsActive) {
                    req.user = user;

                    const adminPrev = await AdminPrev.findAll({ where: { UserId: user.Id }, include: [Section] });
                    let validAccess = false;
                    adminPrev.map(item => {
                        const temp = item.get({ plain: true });
                        if (temp.section.NameEn === section) {
                            switch (action) {
                                case ActionsUtility.read:
                                    validAccess = !!temp.Read;
                                    break;
                                case ActionsUtility.add:
                                    validAccess = !!temp.Add;
                                    break;
                                case ActionsUtility.edit:
                                    validAccess = !!temp.Edit;
                                    break;
                                case ActionsUtility.delete:
                                    validAccess = !!temp.Delete;
                                    break;
                                default:
                                    break;
                            }
                        }
                    });

                    if (!validAccess) {
                        const temp = ResponseModel.getForbiddenResponse(
                            lang === "en" ? "Access denied, you don't have permission to access this section" : "تم رفض الوصول، ليس لديك إذن للوصول إلى هذا القسم",
                            null
                        );
                        MyLogger.info(`${temp.code}|${temp.message}|${JSON.stringify(temp.data)}`);
                        res.status(403).json(temp);
                    } else {
                        next();
                    }
                } else {
                    const temp = ResponseModel.getUnauthorizedResponse(
                        lang === "en" ? "Access denied, your account has been temporarily disabled" : "تم رفض الوصول، تم تعطيل حسابك مؤقتًا",
                        null
                    );
                    MyLogger.info(`${temp.code}|${temp.message}|${JSON.stringify(temp.data)}`);
                    res.status(401).json(temp);
                }
            } else {
                const temp = ResponseModel.getUnauthorizedResponse(
                    lang === "en" ? "Access denied, the token provided isn't valid" : "تم رفض الوصول، الرمز المقدم غير صالح",
                    null
                );
                MyLogger.info(`${temp.code}|${temp.message}|${JSON.stringify(temp.data)}`);
                res.status(401).json(temp);
            }
        } else {
            const temp = ResponseModel.getUnauthorizedResponse(
                lang === "en" ? "Access denied, the token provided isn't valid" : "تم رفض الوصول، الرمز المقدم غير صالح",
                null
            );
            MyLogger.info(`${temp.code}|${temp.message}|${JSON.stringify(temp.data)}`);
            res.status(401).json(temp);
        }
    }
}
module.exports = AuthMiddleware