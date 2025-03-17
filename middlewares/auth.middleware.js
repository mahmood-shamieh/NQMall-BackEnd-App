const { Sequelize } = require("../config/sequelize.config");
const User = require("../models/user.model");
const UserRepo = require("../repositories/user.repo");
const TokenUtility = require("../util/token.utility");

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
        if (!token) {
            return res.status(401).json({ message: 'Access denied, no token provided' });
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
                    req.user = user
                    next();
                } else {
                    res.status(401).json({ message: 'Access denied, your account has been temporarily disabled' });
                }

            }
            /* else if (user === false) {
                res.status(401).json({ message: 'Access denied, the token provided isn\'t valid' });
            } */
            else {
                res.status(401).json({ message: 'Access denied, the token provided isn\'t valid' });
            }
        }
        else {
            res.status(401).json({ message: 'Access denied, the token provided isn\'t valid' });
        }
    }
    static async AuthAdminAndVendor(req, res, next, section, action) {
        const token = req.headers.authorization?.split(' ')[1] ?? req.headers.authorization?.split(' ')[1] ?? null;
        if (!token) {
            return res.status(401).json({ message: 'Access denied, no token provided' });
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
                    req.user = user
                    next();
                } else {
                    res.status(401).json({ message: 'Access denied, your account has been temporarily disabled' });
                }

            }
            /* else if (user === false) {
                res.status(401).json({ message: 'Access denied, the token provided isn\'t valid' });
            } */
            else {
                res.status(401).json({ message: 'Access denied, the token provided isn\'t valid' });
            }
        }
        else {
            res.status(401).json({ message: 'Access denied, the token provided isn\'t valid' });
        }
    }
}
module.exports = AuthMiddleware