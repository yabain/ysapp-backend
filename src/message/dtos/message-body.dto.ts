import { IsOptional, IsObject, IsString } from "class-validator"

export class MessageBodyDTO
{
    @IsOptional()
    @IsString()
    text:string;
    
    @IsOptional()
    @IsObject()
    file:Record<any,any>
}