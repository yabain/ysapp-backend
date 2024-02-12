import { Injectable, InternalServerErrorException } from "@nestjs/common"
import mongoose, { ClientSession, Document, Model } from "mongoose";

@Injectable()
export abstract class DataBaseService<T extends Document>
{
    constructor(
        public entityModel:Model<T>,
        public connection:mongoose.Connection
        ){}

    createInstance(createEntityDTO)
    {
        return new this.entityModel(createEntityDTO);
    }
    
    async create(createEntityDTO,session=null):Promise<T>
    {
        return new this.entityModel(createEntityDTO).save({session});
    }

    async findAll(): Promise<T[]>
    {
        return this.entityModel.find<T>().sort({createdAt:1}).exec();
    }

 
    async findByField(entityObj:Record<string,any>):Promise<T[]>
    {
        return this.entityModel.find<T>({where:entityObj}).sort({createdAt:1}).exec();
    }

    async findOneByField(entityObj:Record<string,any>):Promise<T>
    {
        return this.entityModel.findOne<T>(entityObj).exec();
    }

  
    async update(filter:Record<string,any>,toUpdate:Record<string,any>,session=null):Promise<T>
    {
        return this.entityModel.findOneAndUpdate<T>(filter,toUpdate,{session,new:true});
    }

    async delete(filter,session=null)
    {
        await this.entityModel.findOneAndDelete(filter,{session});
    }

    async executeWithTransaction(functionToExecute:(session:ClientSession)=>any):Promise<any>
    {
        const transaction:ClientSession= await this.connection.startSession();   
        // return transaction.withTransaction(()=>functionToExecute(transaction))
        transaction.startTransaction();
        try {
            let result = await functionToExecute(transaction);
            await transaction.commitTransaction();
            return result;
        } catch (error) {
          await transaction.abortTransaction();
        } finally {
            transaction.endSession();
        }
        return false;
    }
}