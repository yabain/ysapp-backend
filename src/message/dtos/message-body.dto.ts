import { IsOptional, IsObject, IsString, IsUrl } from "class-validator"

export class MessageBodyDTO
{
    @IsOptional()
    @IsString()
    text:string;
    
    @IsOptional()
    @IsUrl()
    fileUrl:string
}