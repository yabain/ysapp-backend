import mongoose, { Model } from "mongoose";
import { UserDocument } from "../models";
import { DataBaseService } from "src/shared/services/database";
export declare class UsersService extends DataBaseService<UserDocument> {
    private userModel;
    constructor(userModel: Model<UserDocument>, connection: mongoose.Connection);
    findAll(): Promise<UserDocument[]>;
    findByField(entityObj: Record<string, any>): Promise<UserDocument[]>;
    findOneByField(entityObj: Record<string, any>): Promise<UserDocument>;
}
