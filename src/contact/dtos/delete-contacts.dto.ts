import {   IsMongoId} from "class-validator";
import { ObjectId } from "mongoose";
/**
 * @apiDefine DeleteContactsDTO Creation d'un nouveau contact
 * @apiBody {String {4..65}} contactsID Liste des contacts a supprimer
 */
export class DeleteContactsDTO
{
    @IsMongoId({each:true})
    contactsID:ObjectId[];
}