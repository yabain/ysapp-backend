import { MaxLength,MinLength,IsOptional,IsUrl,IsNotEmpty,IsString, Matches, IsPhoneNumber, IsMobilePhone, IsFQDN } from "class-validator";


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

    @IsNotEmpty()
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