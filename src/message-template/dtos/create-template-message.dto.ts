import { MinLength,IsOptional,IsNotEmpty,IsString } from "class-validator";

/**
 * @apiDefine CreateMessageTemplateDTO Creation d'un nouveau template de message
 * @apiBody {String {2..}} title Titre du template
 * @apiBody {String {2..}} [description] Description du template
 * @apiBody {String} content Contenu du template
 */
export class CreateMessageTemplateDTO
{
    @IsNotEmpty()
    @MinLength(2)
    @IsString()
    title:string;

    @IsOptional()
    @MinLength(2)
    @IsString()
    description:string;

    @IsNotEmpty()
    @IsString()
    content:string;
}