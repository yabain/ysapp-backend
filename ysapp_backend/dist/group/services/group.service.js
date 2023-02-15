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
exports.GroupService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const database_1 = require("../../shared/services/database");
const services_1 = require("../../user/services");
const models_1 = require("../models");
let GroupService = class GroupService extends database_1.DataBaseService {
    constructor(groupModel, connection, usersService) {
        super(groupModel, connection);
        this.groupModel = groupModel;
        this.usersService = usersService;
    }
    async createNewGroup(createContactDTO, userId) {
        let user = await this.usersService.findOneByField({ "_id": userId });
        let group = new this.groupModel(createContactDTO);
        user.groups.push(group);
        await user.save();
        return group.save();
    }
    async addContactToGroup(userId, contactId, groupId) {
        let user = await this.usersService.findOneByField({ "_id": userId });
        let contact = user.contacts.find((c) => c.id == contactId);
        let group = user.groups.find((g) => g.id == groupId);
        contact.groups.push(group);
        group.contacts.push(contact);
        await contact.save();
        await group.save();
        return true;
    }
};
GroupService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(models_1.Group.name)),
    __param(1, (0, mongoose_1.InjectConnection)()),
    __metadata("design:paramtypes", [mongoose_2.Model, mongoose_2.default.Connection, services_1.UsersService])
], GroupService);
exports.GroupService = GroupService;
//# sourceMappingURL=group.service.js.map