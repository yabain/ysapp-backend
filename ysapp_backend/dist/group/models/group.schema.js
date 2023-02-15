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
exports.GroupSchema = exports.Group = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let Group = class Group extends mongoose_2.Document {
};
__decorate([
    (0, mongoose_1.Prop)({ required: true, default: "" }),
    __metadata("design:type", String)
], Group.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, default: "" }),
    __metadata("design:type", String)
], Group.prototype, "description", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [{ type: mongoose_2.default.Schema.Types.ObjectId, ref: 'Contact' }] }),
    __metadata("design:type", Array)
], Group.prototype, "contacts", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], Group.prototype, "isDeleted", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: Date.now(), required: true }),
    __metadata("design:type", Date)
], Group.prototype, "createdAt", void 0);
Group = __decorate([
    (0, mongoose_1.Schema)({
        toObject: {
            transform: function (doc, ret) {
                delete ret.__v;
            }
        },
        toJSON: {
            transform: function (doc, ret) {
                delete ret.__v;
            }
        }
    })
], Group);
exports.Group = Group;
exports.GroupSchema = mongoose_1.SchemaFactory.createForClass(Group);
//# sourceMappingURL=group.schema.js.map