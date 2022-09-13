import { Model } from "mongoose";

/**
 * DOC: represente le document mongoose
 * DTO: represente le DTO
 * MODEL: represente le model mongoose
 */
export abstract class GenericCrudService<DOC extends Model<any> ,DTO,MODEL>
{
    constructor(protected documentModel:DOC){}
    
    async create(dtoObject:DTO):Promise<MODEL>
    {
        const createdDto=new this.documentModel(dtoObject);
        return createdDto.save()
    }

    async findAll():Promise<MODEL[]>
    {
        return this.documentModel.find().exec()
    }

    async findById(id):Promise<MODEL>
    {
        return this.documentModel.findById(id).exec()
    }
}