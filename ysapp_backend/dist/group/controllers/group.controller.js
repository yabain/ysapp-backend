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
exports.GroupController = void 0;
const common_1 = require("@nestjs/common");
const dtos_1 = require("../dtos");
const group_service_1 = require("../services/group.service");
const guards_1 = require("../../user/guards");
let GroupController = class GroupController {
    constructor(groupsService) {
        this.groupsService = groupsService;
    }
    async addGroup(request, createGroupDTO) {
        let data = await this.groupsService.createNewGroup(createGroupDTO, request.user["userId"]);
        return {
            statusCode: common_1.HttpStatus.CREATED,
            message: "Group add successfully",
            data
        };
    }
    async addContactToGroup(request, addContactToGroupDTO) {
        await this.groupsService.addContactToGroup(request.user["userId"], addContactToGroupDTO.contactId, addContactToGroupDTO.groupId);
        return {
            statusCode: common_1.HttpStatus.OK,
            message: "Contact add to group successfully"
        };
    }
    async getGroupById(request, id) {
        let data = await this.groupsService.findOneByField({ "groups.id": id });
        return {
            statusCode: common_1.HttpStatus.OK,
            message: "Group details",
            data
        };
    }
    async updateGroupById(request, id) {
        let data = await this.groupsService.update({ "_id": id }, {});
    }
};
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, dtos_1.CreateGroupDTO]),
    __metadata("design:returntype", Promise)
], GroupController.prototype, "addGroup", null);
__decorate([
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.Post)("contact"),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, dtos_1.AddContactToGroupDTO]),
    __metadata("design:returntype", Promise)
], GroupController.prototype, "addContactToGroup", null);
__decorate([
    (0, common_1.Get)(":id"),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)("ref", new common_1.ParseUUIDPipe({ version: "4" }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], GroupController.prototype, "getGroupById", null);
__decorate([
    (0, common_1.Put)(":id"),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)("ref", new common_1.ParseUUIDPipe({ version: "4" }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], GroupController.prototype, "updateGroupById", null);
GroupController = __decorate([
    (0, common_1.UseGuards)(guards_1.UserJwtAuthGuard),
    (0, common_1.Controller)("groups"),
    __metadata("design:paramtypes", [group_service_1.GroupService])
], GroupController);
exports.GroupController = GroupController;
//# sourceMappingURL=group.controller.js.map