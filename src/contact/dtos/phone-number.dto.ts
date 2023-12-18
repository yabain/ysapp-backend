import { IsMobilePhone, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class PhoneNumberDTO
{
    @IsMobilePhone()
    phoneNumber:string;

    @IsNotEmpty()
    @IsString()
    country:string

    @IsNotEmpty()
    @IsString()
    label:string
}