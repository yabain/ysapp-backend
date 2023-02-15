import { MaxLength,MinLength,IsOptional,IsUrl,IsNotEmpty,IsString, Matches, IsPhoneNumber } from "class-validator";


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