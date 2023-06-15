import { MaxLength,MinLength,IsOptional,IsUrl,IsNotEmpty,IsString, Matches, IsPhoneNumber } from "class-validator";


/**
 * @apiDefine CreateGroupDTO Creation d'un nouveau groupe
 * @apiBody {String {4..65}} name Nom du groupe
 * @apiBody {String {4..65}} description description du groupe
 * @apiBody {String} [profilePicture] Lien de la photo de profil du groupe
 */
export class CreateGroupDTO
{
    @IsNotEmpty()
    @MinLength(4)
    @MaxLength(65)
    @IsString()
    name:string;

    @IsNotEmpty()
    @MinLength(4)
    @IsString()
    @MaxLength(65)
    description:string;

    @IsOptional()
    @IsString()
    @IsUrl()
    profilePicture:string;

}