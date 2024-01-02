import { MaxLength,MinLength,IsOptional,IsUrl,IsNotEmpty,IsString, IsArray, ArrayMinSize, IsMobilePhone, IsFQDN, IsDate, Max, IsEmail, ValidateNested } from "class-validator";
import { Transform, Type } from "class-transformer";
import { PhoneNumberDTO } from "./phone-number.dto";
import { ContactEmailDTO } from "./contact-email.dto";


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
    @IsString()
    fullName:string;

    @IsArray()
    @ValidateNested({each:true})
    @ArrayMinSize(1)
    @Type(()=> ContactEmailDTO)
    emails:ContactEmailDTO[];

    @IsArray()
    @ValidateNested({each:true})
    @ArrayMinSize(1)
    @Type(()=> PhoneNumberDTO)
    phoneNumbers:PhoneNumberDTO[]

    @IsOptional()
    @IsString()
    @MaxLength(65)
    skype:string;

    @IsOptional()
    @IsUrl()
    websiteLink:string;

    @IsOptional()
    @IsString()
    @IsUrl()
    avatar:string;

    @IsOptional()
    @IsString()
    address:string;
   
    @IsOptional()
    @IsString()
    @MaxLength(100)
    about:string;
    
    @IsOptional()
    @IsString()
    @MaxLength(100)
    jobTitle:string;
    
    @IsOptional()
    @IsString()
    @MinLength(2)
    @MaxLength(64)
    organization:string;

    @IsOptional()
    @IsString()
    @MaxLength(64)
    company:string;

    @IsOptional()
    @Transform(({value})=> value && new Date(value))
    @IsDate()
    birthday:Date;
}