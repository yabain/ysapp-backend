import { IsMongoId } from "class-validator";

/**
 * @apiDefine AddContactToGroupDTO Ajout d'un membre a un groupe
 * @apiBody {String} groupId Identifiant du groupe
 * @apiBody {String} contactId Identifiant du contact
 */
export class AddContactToGroupDTO
{
    @IsMongoId()
    groupId:string;

    @IsMongoId()
    contactId:string;
}