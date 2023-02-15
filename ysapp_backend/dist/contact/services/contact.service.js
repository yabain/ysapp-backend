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
exports.ContactsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const models_1 = require("../models");
const database_1 = require("../../shared/services/database");
const services_1 = require("../../user/services");
let ContactsService = class ContactsService extends database_1.DataBaseService {
    constructor(contactModel, connection, usersService) {
        super(contactModel, connection);
        this.contactModel = contactModel;
        this.usersService = usersService;
    }
    async createNewContact(createContactDTO, userId) {
        let user = await this.usersService.findOneByField({ "_id": userId });
        let contact = new this.contactModel(createContactDTO);
        user.contacts.push(contact);
        await user.save();
        return contact.save();
    }
};
ContactsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(models_1.Contact.name)),
    __param(1, (0, mongoose_1.InjectConnection)()),
    __metadata("design:paramtypes", [mongoose_2.Model, mongoose_2.default.Connection, services_1.UsersService])
], ContactsService);
exports.ContactsService = ContactsService;
//# sourceMappingURL=contact.service.js.map