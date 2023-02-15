import mongoose, { HydratedDocument } from "mongoose";
import { Contact } from "src/contact/models";
import { Group } from "src/group/models/group.schema";
export declare type UserDocument = HydratedDocument<User>;
export declare class User {
    firstName: string;
    lastName: string;
    password: string;
    email: string;
    emailConfirmed: boolean;
    profilePicture: string;
    country: string;
    location: string;
    phoneNumber: string;
    permissions: string;
    contacts: Contact[];
    groups: Group[];
    isDeleted: boolean;
    createdAt: Date;
}
export declare const UserSchema: mongoose.Schema<User, mongoose.Model<User, any, any, any, any>, {}, {}, {}, {}, "type", User>;
