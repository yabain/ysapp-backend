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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserProfilController = void 0;
const common_1 = require("@nestjs/common");
const pipes_1 = require("../../shared/pipes");
const guards_1 = require("../guards");
const dtos_1 = require("../dtos");
const services_1 = require("../services");
let UserProfilController = class UserProfilController {
    constructor(userService) {
        this.userService = userService;
    }
    async getUserProfilById(id) {
        let data = await this.userService.findOneByField({ "_id": id });
        if (!data)
            throw new common_1.NotFoundException({
                statusCode: 404,
                error: "NotFound",
                message: ["User not found"]
            });
        return {
            statusCode: common_1.HttpStatus.OK,
            message: "User details",
            data
        };
    }
    async deleteUserById(id) {
        let data = await this.userService.findOneByField({ "_id": id });
        if (!data || (data && data.isDeleted))
            throw new common_1.NotFoundException({
                statusCode: common_1.HttpStatus.NOT_FOUND,
                error: "NotFound",
                message: ["User not found"]
            });
        await this.userService.update({ "_id": id }, { isDeleted: true });
        return {
            statusCode: common_1.HttpStatus.OK,
            message: "User deleted successfully ",
        };
    }
    async updateUserById(id, updateUser) {
        let data = await this.userService.findOneByField({ "_id": id });
        if (!data)
            throw new common_1.NotFoundException({
                statusCode: common_1.HttpStatus.NOT_FOUND,
                error: "NotFound",
                message: ["User not found"]
            });
        data = await this.userService.update({ "_id": id }, updateUser);
        return {
            statusCode: common_1.HttpStatus.OK,
            message: "User updated successfully ",
            data
        };
    }
};
__decorate([
    (0, common_1.Get)(":id"),
    __param(0, (0, common_1.Param)("id", pipes_1.ObjectIDValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserProfilController.prototype, "getUserProfilById", null);
__decorate([
    (0, common_1.Delete)(":id"),
    __param(0, (0, common_1.Param)("id", pipes_1.ObjectIDValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserProfilController.prototype, "deleteUserById", null);
__decorate([
    (0, common_1.Put)(":id"),
    __param(0, (0, common_1.Param)("id", pipes_1.ObjectIDValidationPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dtos_1.UpdateUserDTO]),
    __metadata("design:returntype", Promise)
], UserProfilController.prototype, "updateUserById", null);
UserProfilController = __decorate([
    (0, common_1.UseGuards)(guards_1.UserJwtAuthGuard),
    (0, common_1.Controller)("/user/profil"),
    __metadata("design:paramtypes", [services_1.UsersService])
], UserProfilController);
exports.UserProfilController = UserProfilController;
//# sourceMappingURL=user-profil.controller.js.map