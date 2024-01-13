import {   IsMongoId} from "class-validator";
import { ObjectId } from "mongoose";
/**
 * @apiDefine DeleteMessageTemplateDTO Creation d'un nouveau message-template
 * @apiBody {Array} messageTemplatesID Liste des ID des message-templates a supprimer
 */
export class DeleteMessageTemplatesDTO
{
    @IsMongoId({each:true})
    messageTemplatesID:ObjectId[];
}