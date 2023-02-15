import mongoose, { ClientSession, Document, Model } from "mongoose";
export declare abstract class DataBaseService<T extends Document> {
    entityModel: Model<T>;
    connection: mongoose.Connection;
    constructor(entityModel: Model<T>, connection: mongoose.Connection);
    create(createEntityDTO: any, session?: any): Promise<T>;
    findAll(): Promise<T[]>;
    findByField(entityObj: Record<string, any>): Promise<T[]>;
    findOneByField(entityObj: Record<string, any>): Promise<T>;
    update(filter: Record<string, any>, toUpdate: Record<string, any>, session?: any): Promise<T>;
    delete(filter: any, session?: any): Promise<void>;
    executeWithTransaction(functionToExecute: (session: ClientSession) => any): Promise<any>;
}
