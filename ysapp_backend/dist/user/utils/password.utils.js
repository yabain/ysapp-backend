"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PasswordUtil = void 0;
const bcrypt = require("bcryptjs");
class PasswordUtil {
    static hash(password) {
        return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
    }
    static compare(savedPassword, newPassword) {
        return bcrypt.compareSync(newPassword, savedPassword);
    }
}
exports.PasswordUtil = PasswordUtil;
//# sourceMappingURL=password.utils.js.map