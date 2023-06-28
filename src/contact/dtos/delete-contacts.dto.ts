import {   IsMongoId} from "class-validator";
import { ObjectId } from "mongoose";
/**
 * @apiDefine DeleteContactDTO Creation d'un nouveau contact
 * @apiBody {Array} contactsID Liste des ID des contacts a supprimer
 */
export class DeleteContactsDTO
{
    @IsMongoId({each:true})
    contactsID:ObjectId[];
}