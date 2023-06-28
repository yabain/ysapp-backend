import { MaxLength,MinLength,IsOptional,IsUrl,IsNotEmpty,IsString, Matches, IsPhoneNumber, IsMobilePhone, IsFQDN, IsDate, Max } from "class-validator";
import { Transform, Type } from "class-transformer";


/**
 * @apiDefine CreateContactDTO Creation d'un nouveau contact
 * @apiBody {String {1..65}} firstName Prenom du contact
 * @apiBody {String {1..65}} lastName Nom du contact
 * @apiBody {String} [email] Email du contact
 * @apiBody {String} [profilePicture] Lien de la photo de profil du contact
 * @apiBody {String} [country] Pays d'habitation du contact
 * @apiBody {String} [whatsappContact] Numero whatsapp du contact
 * @apiBody {String} [skype] Contact skype 
 * @apiBody {String} [websiteLink] Lien du site web du contact 
 * @apiBody {String} [address] Addresse de localisation du contact
 * @apiBody {String} [phoneNumber] Autre numéro de téléphone du contact
 * @apiBody {String} [gender] Sexe du contact
 * @apiBody {String} [about] Biographie du contact
 * @apiBody {String} [organization] Organisation du contact
 * @apiBody {String} [city] Ville de résidence du contact
 * @apiBody {Date} [birthday] Date d'anniversaire du contact
 */
export class CreateContactDTO
{
    @IsNotEmpty()
    @MinLength(1)
    @MaxLength(65)
    @IsString()
    firstName:string;

    @IsNotEmpty()
    @MinLength(1)
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
    @IsString()
    address:string;

    @IsOptional()
    @IsMobilePhone()
    phoneNumber:string

    @IsOptional()
    @MinLength(4)
    @MaxLength(8)
    gender:string;

    @IsOptional()
    @Transform(({value})=> value && new Date(value))
    @IsDate()
    birthday:Date;

    @IsOptional()
    @IsString()
    @MaxLength(100)
    about:string;

    @IsOptional()
    @IsString()
    @MinLength(2)
    @MaxLength(64)
    organization:string;

    @IsOptional()
    @IsString()
    @MinLength(2)
    @MaxLength(65)
    city:string
}