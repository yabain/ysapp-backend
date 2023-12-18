import { IsEmail, IsMobilePhone, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class ContactEmailDTO
{
    @IsEmail()
    email:string;

    @IsNotEmpty()
    @IsString()
    label:string
}