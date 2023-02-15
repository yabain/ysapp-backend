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
exports.DataBaseService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
let DataBaseService = class DataBaseService {
    constructor(entityModel, connection) {
        this.entityModel = entityModel;
        this.connection = connection;
    }
    async create(createEntityDTO, session = null) {
        return new this.entityModel(createEntityDTO).save({ session });
    }
    async findAll() {
        return this.entityModel.find().sort({ createdAt: 1 }).exec();
    }
    async findByField(entityObj) {
        return this.entityModel.find({ where: entityObj }).sort({ createdAt: 1 }).exec();
    }
    async findOneByField(entityObj) {
        return this.entityModel.findOne(entityObj).exec();
    }
    async update(filter, toUpdate, session = null) {
        return this.entityModel.findOneAndUpdate(filter, toUpdate, { session, new: true });
    }
    async delete(filter, session = null) {
        await this.entityModel.findOneAndDelete(filter, { session });
    }
    async executeWithTransaction(functionToExecute) {
        const transaction = await this.connection.startSession();
        transaction.startTransaction();
        let result = null;
        try {
            result = await functionToExecute(transaction);
            await transaction.commitTransaction();
        }
        catch (err) {
            await transaction.abortTransaction();
            throw err;
        }
        finally {
            transaction.endSession();
        }
        return result;
    }
};
DataBaseService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [mongoose_1.Model, mongoose_1.default.Connection])
], DataBaseService);
exports.DataBaseService = DataBaseService;
//# sourceMappingURL=database.service.js.map