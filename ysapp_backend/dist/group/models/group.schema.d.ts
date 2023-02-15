import mongoose, { Document, HydratedDocument } from "mongoose";
export declare type GroupDocument = HydratedDocument<Group>;
export declare class Group extends Document {
    name: string;
    description: string;
    contacts: any[];
    isDeleted: boolean;
    createdAt: Date;
}
export declare const GroupSchema: mongoose.Schema<Group, mongoose.Model<Group, any, any, any, any>, {}, {}, {}, {}, "type", Group>;
