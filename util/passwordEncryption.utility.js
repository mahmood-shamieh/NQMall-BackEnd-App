const bcrypt = require('bcrypt');
const saltRounds = 10; // You can adjust this value as needed
class PasswordEncryptionUtility {
    static async encrypt(password) {
        try {
            const salt = await bcrypt.genSalt(saltRounds);
            const hashedPassword = await bcrypt.hash(password, salt);
            
            return hashedPassword;
        } catch (error) {
            return null;
        }
    }
    static async compare({ password, hashedPassword }) {
        try {
            const salt = await bcrypt.genSalt(saltRounds);
            const isMatch = await bcrypt.compare(password, hashedPassword);
            return isMatch;
        } catch (error) {
            return null;
        }
    }
}
module.exports = PasswordEncryptionUtility