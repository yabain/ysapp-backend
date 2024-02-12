import { IsArray, IsBoolean, IsDate, IsDefined, IsEnum, IsMongoId, IsNotEmptyObject, IsObject, IsOptional, IsString } from "class-validator";
import { ObjectId } from "mongoose";
import { Transform, Type } from "class-transformer";
import { MessageType } from "../models";
import { MessageBodyDTO } from "./message-body.dto";

/**
 * @apiDefine PostNewMessageDTO Post d'un nouveau message
 * @apiBody {String} type Type de message. les types suivants sont accepté: `text` pour les message textuelle,
 *   `image` pour les images, `document` pour tout type de document (word, excel, powerpoint...) et `conctact` dans le cas où le message est un partage de contact
 * @apiBody {Array} [contactsID] Tableau d'identifiant de contacts sur lesquels envoyé les messages. 
 * @apiBody {Array} [groupsID] Tableau d'identifiant de groupes de contacts sur lesquels envoyé les messages 
 * @apiBody {String} isSentToNow Est définis sur `true` si le message est instantané et sur `false` si l'envoi est programmé a une date ultérieur
 * @apiBody {String} [dateToSend] Date d'envoi du message. utilisé si l'envoi du message est programmé à une date ultérieur
 * @apiBody {String} [country] Pays d'habitation du contact
 * @apiBody {Object} body contenu du message
 * @apiBody {String} [body.text] Contenu textuel du message. Est utilisé en tant que description du fichier dans le cas où l'attribut `fileUrl` est définis 
 * @apiBody {String} [body.fileUrl] Url du fichier multimédia attaché au message 
 */
export class PostNewMessageDTO
{
    @IsEnum(MessageType)
    type:MessageType;

    @IsOptional()
    // @IsMongoId({each:true})
    // @IsString({each:true})
    contactsID: any; //ObjectId[] | string

    @IsOptional()
    @IsMongoId({each:true})
    groupsID:ObjectId[];

    @IsString()
    isSentToNow:boolean;

    @IsOptional()
    @Transform(({value})=> value && new Date(value))
    @IsDate()
    dateToSend:Date;
    
    @IsOptional()
    @IsMongoId()
    messageTemplateId:ObjectId;

    // @IsOptional()
    // @IsDefined()
    // @IsNotEmptyObject()
    // @Type(()=>MessageBodyDTO)
    // body:MessageBodyDTO ;

    @IsOptional()
    @IsString()
    bodyText:string;

    @IsOptional()
    @IsString()
    bodyFiles:Express.Multer.File[];

    email:string
}