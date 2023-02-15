import mongoose, { Document, HydratedDocument } from "mongoose";
export declare type ContactDocument = HydratedDocument<Contact>;
export declare class Contact extends Document {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    whatsappContact: string;
    skype: string;
    websiteLink: string;
    profilePicture: string;
    country: string;
    location: string;
    groups: any[];
    createdAt: Date;
}
export declare const ContactSchema: mongoose.Schema<Contact, mongoose.Model<Contact, any, any, any, any>, {}, {}, {}, {}, "type", Contact>;
