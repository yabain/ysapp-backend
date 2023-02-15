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
exports.ContactController = void 0;
const common_1 = require("@nestjs/common");
const guards_1 = require("../../user/guards");
const dtos_1 = require("../dtos");
const services_1 = require("../services");
let ContactController = class ContactController {
    constructor(contactsService) {
        this.contactsService = contactsService;
    }
    async addContact(request, createContactDTO) {
        let data = await this.contactsService.createNewContact(createContactDTO, request.user["userId"]);
        return {
            statusCode: common_1.HttpStatus.CREATED,
            message: "Contact add successfully",
            data
        };
    }
    async getContactById(request, id) {
        let data = await this.contactsService.findOneByField({ "contacts.id": id });
        return {
            statusCode: common_1.HttpStatus.OK,
            message: "Contact details",
            data
        };
    }
    async updateContactById(request, id) {
        let data = await this.contactsService.update({ "_id": id }, {});
    }
};
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, dtos_1.CreateContactDTO]),
    __metadata("design:returntype", Promise)
], ContactController.prototype, "addContact", null);
__decorate([
    (0, common_1.Get)(":id"),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)("ref", new common_1.ParseUUIDPipe({ version: "4" }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], ContactController.prototype, "getContactById", null);
__decorate([
    (0, common_1.Put)(":id"),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)("ref", new common_1.ParseUUIDPipe({ version: "4" }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], ContactController.prototype, "updateContactById", null);
ContactController = __decorate([
    (0, common_1.UseGuards)(guards_1.UserJwtAuthGuard),
    (0, common_1.Controller)("contacts"),
    __metadata("design:paramtypes", [services_1.ContactsService])
], ContactController);
exports.ContactController = ContactController;
//# sourceMappingURL=contact.controller.js.map