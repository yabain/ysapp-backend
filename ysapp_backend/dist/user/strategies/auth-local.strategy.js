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
exports.AuthLocalStrategy = void 0;
const common_1 = require("@nestjs/common");
const passport_local_1 = require("passport-local");
const passport_1 = require("@nestjs/passport");
const services_1 = require("../services");
const dtos_1 = require("../dtos");
let AuthLocalStrategy = class AuthLocalStrategy extends (0, passport_1.PassportStrategy)(passport_local_1.Strategy) {
    constructor(authService) {
        super({ usernameField: "email" });
        this.authService = authService;
    }
    async validate(username, password) {
        let userLoginDTO = new dtos_1.LoginUserDTO();
        userLoginDTO.email = username;
        userLoginDTO.password = password;
        const user = await this.authService.validateUser(userLoginDTO);
        if (!user)
            throw new common_1.UnauthorizedException({
                statusCode: common_1.HttpStatus.UNAUTHORIZED,
                error: 'Authentification error',
                message: ['Email/password incorrect']
            });
        return user;
    }
};
AuthLocalStrategy = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [services_1.AuthService])
], AuthLocalStrategy);
exports.AuthLocalStrategy = AuthLocalStrategy;
//# sourceMappingURL=auth-local.strategy.js.map