"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EncryptionSecurityService = void 0;
const crypto_1 = require("crypto");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
let EncryptionSecurityService = class EncryptionSecurityService {
    constructor(configService) {
        this.configService = configService;
        this.secretKey = "";
        this.algoritm = '';
        this.secretKey = this.configService.get("SECRET_ENCRIPTION_KEY");
        this.algoritm = this.configService.get("SECRET_ENCRIPTION_ALGORITHM");
    }
    generateRandomKey() {
        let str = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$%&/()=?^"!|[]{}*+-:.;,_@#<>';
        return str.split('').sort((a, b) => { return Math.random() - 0.5; }).join('');
    }
    cipher(str) {
        let sha256 = crypto_1.default.createHash('sha256');
        sha256.update(this.secretKey);
        let initVector = crypto_1.default.randomBytes(16);
        let cipher = crypto_1.default.createCipheriv(this.algoritm, sha256.digest(), initVector);
        let cipherText = cipher.update(Buffer.from(str));
        let encrypted = Buffer.concat([initVector, cipherText, cipher.final()]).toString('base64');
        return encrypted;
    }
    decipher(encrypted) {
        let sha256 = crypto_1.default.createHash('sha256');
        sha256.update(this.secretKey);
        let input = Buffer.from(encrypted, "base64");
        let initVector = input.slice(0, 16);
        let decipher = crypto_1.default.createDecipheriv(this.algoritm, sha256.digest(), initVector);
        let cipherText = input.slice(16);
        let plainText = Buffer.concat([decipher.update(cipherText), decipher.final()]);
        return plainText.toString();
    }
};
EncryptionSecurityService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], EncryptionSecurityService);
exports.EncryptionSecurityService = EncryptionSecurityService;
//# sourceMappingURL=encryption-security.service.js.map