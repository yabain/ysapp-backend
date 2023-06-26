import { Controller, Post, UseGuards, Body, HttpStatus, Req,Get } from "@nestjs/common";
import { Request } from "express";
import { PostNewMessageDTO } from "../dtos";
import { MessageService, WhatsappAnnouncementService } from "../services";
import { UsersService } from "src/user/services";

@Controller("message")
export class MessageController
{
    constructor(
        private messageService:MessageService,
        private whatsAppAnnouncementService:WhatsappAnnouncementService,
        private usersService:UsersService
        ){}


    /**
     * 
     * @api {get} /message/qr-code Génération d'un nouveau QR-Code
     * @apiDescription Génération d'un noveau QR-Code basé sur les informations de l'utilisateur courant
     * @apiName Génération d'un nouveau QR-Code
     * @apiGroup Gestion de message
     * @apiUse apiSecurity
     * @apiUse apiDefaultResponse
     * 
     * @apiSuccess (200 Ok) {Number} statusCode status code
     * @apiSuccess (200 Ok) {String} Response Description
     * @apiSuccess (200 Ok) {String} data QR-Code générer sous forme de chaine de carractére
     * @apiError (Error 4xx) 401-Unauthorized Token not supplied/invalid token 
     * @apiUse apiError
     */
    @Get("qr-code")
    async getQRCode(@Req() request:Request) 
    {
        return {
            statusCode:HttpStatus.OK,
            message:"Qr-Code generated successfully",
            data:await this.whatsAppAnnouncementService.initWhatsAppSession(request["user"]["email"])
        }
    }

     /**
     * 
     * @api {get} /message/qr-code/state Etat de synchronization du Qr-Code avec WhatsApp
     * @apiDescription Etat de synchronization du Qr-Code avec l'application WhatsApp
     * @apiName Etat de synchronization du Qr-Code
     * @apiGroup Gestion de message
     * @apiUse apiSecurity
     * @apiUse apiDefaultResponse
     * 
     * @apiSuccess (200 Ok) {Number} statusCode status code
     * @apiSuccess (200 Ok) {String} Response Description
     * @apiSuccess (200 Ok) {String} data est définis sur `true` si la synchronization est bien etabli et `false` dans le cas contraire
     * @apiError (Error 4xx) 401-Unauthorized Token not supplied/invalid token 
     * @apiUse apiError
     */
    @Get("qr-code/state")
    async getQrCodeState(request:Request)
    {
        return {
            statusCode:HttpStatus.OK,
            message:"Etat de synchronnization du qr-code avec WhatsApp",
            data: (await this.usersService.findOneByField({"email":request["user"]["email"]})).hasSyncWhatsApp
        }
    }

    /**
     * 
     * @api {post} /message/post Envoi d'un nouveau message
     * @apiDescription Envoi d'un nouveau message. si le message n'est pas un message instantané l'envoi est programmé pour la date précisé dans les arguments de la requête
     * @apiName Envoi d'un nouveau message
     * @apiGroup Gestion de message
     * @apiUse apiSecurity
     * @apiUse apiDefaultResponse
     * @apiUse PostNewMessageDTO
     * 
     * @apiSuccess (201 Created) {Number} statusCode status code
     * @apiSuccess (201 Created) {String} Response Description
     * @apiSuccess (201 Created) {Object} data response data
     * @apiSuccess (201 Created) {String} data.type Type de message. les types suivants sont accepté: `text` pour les message textuelle,
     *   `image` pour les images, `document` pour tout type de document (word, excel, powerpoint...) et `conctact` dans le cas où le message est un partage de contact
     * @apiSuccess (201 Created) {Array} data.contacts Tableau d'identifiant de contacts sur lesquels envoyé les messages. 
     * @apiSuccess (201 Created) {Array} data.groups Tableau d'identifiant de groupes de contacts sur lesquels envoyé les messages 
     * @apiSuccess (201 Created) {String} data.isSentToNow Est définis sur `true` si le message est instantané et sur `false` si l'envoi est programmé a une date ultérieur
     * @apiSuccess (201 Created) {String} data.dateToSend Date d'envoi du message. utilisé si l'envoi du message est programmé à une date ultérieur
     * @apiSuccess (201 Created) {String} data.country Pays d'habitation du contact
     * @apiSuccess (201 Created) {Object} data.body contenu du message
     * @apiSuccess (201 Created) {String} data.body.text Contenu textuel du message. Est utilisé en tant que description du fichier dans le cas où l'attribut `fileUrl` est définis 
     * @apiSuccess (201 Created) {String} data.body.fileUrl Url du fichier multimédia attaché au message 
     * 
     * @apiError (Error 4xx) 401-Unauthorized Token not supplied/invalid token 
     * @apiUse apiError
     * 
     */
    @Post("post")
    async postNewMessage(@Req() request:Request, @Body() postNewMessageDTO:PostNewMessageDTO,)
    {
        return {
            statusCode:HttpStatus.OK,
            message:"Messsage send successfully",
            data:await this.messageService.postNewMessage(postNewMessageDTO,request["user"]["email"])
        }
    }

    
}