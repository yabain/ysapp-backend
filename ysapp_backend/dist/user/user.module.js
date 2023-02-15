"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const passport_1 = require("@nestjs/passport");
const jwt_1 = require("@nestjs/jwt");
const controllers_1 = require("./controllers");
const models_1 = require("./models");
const services_1 = require("./services");
const strategies_1 = require("./strategies");
const utils_1 = require("./utils");
const config_1 = require("../shared/config");
const auth_jwt_strategy_1 = require("./strategies/auth-jwt.strategy");
let UserModule = class UserModule {
};
UserModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeatureAsync([
                {
                    name: models_1.User.name,
                    useFactory: () => {
                        const schema = models_1.UserSchema;
                        schema.pre("save", function (next) {
                            this.password = utils_1.PasswordUtil.hash(this.password);
                            next();
                        });
                        return schema;
                    }
                }
            ]),
            passport_1.PassportModule,
            jwt_1.JwtModule.register({
                secret: config_1.JWT_CONSTANT.secret,
                signOptions: { expiresIn: config_1.JWT_CONSTANT.expiresIn }
            })
        ],
        controllers: [controllers_1.AuthController, controllers_1.UserProfilController],
        providers: [services_1.UsersService, services_1.AuthService, strategies_1.AuthLocalStrategy, auth_jwt_strategy_1.AuthJwtStrategy],
        exports: [services_1.UsersService, services_1.AuthService, auth_jwt_strategy_1.AuthJwtStrategy, jwt_1.JwtModule]
    })
], UserModule);
exports.UserModule = UserModule;
//# sourceMappingURL=user.module.js.map