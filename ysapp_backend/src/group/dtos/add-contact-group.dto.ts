import { IsMongoId } from "class-validator";

export class AddContactToGroupDTO
{
    @IsMongoId()
    groupId:string;

    @IsMongoId()
    contactId:string;
}