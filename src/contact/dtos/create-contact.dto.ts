import { MaxLength,MinLength,IsOptional,IsUrl,IsNotEmpty,IsString, Matches, IsPhoneNumber, IsMobilePhone, IsFQDN } from "class-validator";

/**
 * @apiDefine CreateContactDTO Creation d'un nouveau contact
 * @apiBody {String {4..65}} firstName Prenom du contact
 * @apiBody {String {4..65}} lastName Nom du contact
 * @apiBody {String} [email] Email du contact
 * @apiBody {String} [profilePicture] Lien de la photo de profil du contact
 * @apiBody {String} [country] Pays d'habitation du contact
 * @apiBody {String} [whatsappContact] Numero whatsapp du contact
 * @apiBody {String} [skype] Contact skype 
 * @apiBody {String} websiteLink Lien du site web du contact 
 * @apiBody {String} location Zone de localisation du contact
 * @apiBody {String} phoneNumber Autre numéro de téléphone du contact
 */
export class CreateContactDTO
{
    @IsNotEmpty()
    @MinLength(4)
    @MaxLength(65)
    @IsString()
    firstName:string;

    @IsNotEmpty()
    @MinLength(4)
    @IsString()
    @MaxLength(65)
    lastName:string;

    @IsOptional()
    @IsString()
    @Matches("([!#-'*+/-9=?A-Z^-~-]+(\.[!#-'*+/-9=?A-Z^-~-]+)*|\"\(\[\]!#-[^-~ \t]|(\\[\t -~]))+\")@([!#-'*+/-9=?A-Z^-~-]+(\.[!#-'*+/-9=?A-Z^-~-]+)*|\[[\t -Z^-~]*])")
    email:string;

    
    @IsOptional()
    @IsString()
    @IsUrl()
    profilePicture:string;

    @IsOptional()
    @MinLength(4)
    @IsString()
    country:string;

    @IsOptional()
    @IsMobilePhone()
    whatsappContact:string;

    @IsOptional()
    @MinLength(4)
    @IsString()
    @MaxLength(65)
    skype:string;

    @IsOptional()
    @IsFQDN()
    websiteLink:string;

    @IsOptional()
    @MinLength(4)
    @IsString()
    location:string;

    @IsOptional()
    @IsMobilePhone()
    phoneNumber:string

}