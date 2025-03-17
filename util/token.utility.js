const jwt = require('jsonwebtoken');

class TokenUtility {

    static JWT_SECRET = 'NQMALL@sy.com_!@#$%12345';
    static generateSecurityToken(payload) {
        return jwt.sign({ payload }, this.JWT_SECRET, { expiresIn: '7d' });
    }
    static validateToken(token) {
        try {
            const verified = jwt.verify(token, this.JWT_SECRET);
            return verified;
        } catch (error) {
            return null;
        }
    }
}
module.exports = TokenUtility