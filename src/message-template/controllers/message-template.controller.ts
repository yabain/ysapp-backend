import { Body, Controller, Post, Req, HttpStatus, Get, Param, Put, Delete,NotFoundException } from "@nestjs/common";
import { Request } from "express";
import { CreateMessageTemplateDTO, DeleteMessageTemplatesDTO, UpdateMessageTemplateDTO } from "../dtos";
import { MessageTemplatesService } from "../services";
import { UsersService } from "src/user/services";
import { ObjectIDValidationPipe } from "src/shared/pipes";



@Controller("message-template")
export class MessageTemplateController
{
    constructor(
        private messageTemplateService:MessageTemplatesService,
        private usersService:UsersService,
    ){}

    /**
     * 
     * @api {post} /message-template/ Creation d'un template de message
     * @apiDescription Creation d'un nouveau template de message
     * @apiName Creation d'un template de message
     * @apiGroup Gestion de template de message
     * @apiUse apiSecurity
     * @apiUse apiDefaultResponse
     * @apiUse CreateMessageTemplateDTO
     * 
     * @apiSuccess (201 Created) {Number} statusCode status code
     * 
     * @apiSuccess (201 Created) {Number} statusCode status code
     * @apiSuccess (201 Created) {String} Response Description
     * @apiSuccess (201 Created) {Object} data response data
     * @apiSuccess (201 Created)  {String {2..}} data.title Titre du template
     * @apiSuccess (201 Created)  {String {2..}} data.description Description du template
     * @apiSuccess (201 Created)  {String} data.content Contenu du template
     * 
     * @apiError (Error 4xx) 401-Unauthorized Token not supplied/invalid token 
     * @apiUse apiError
     * 
     */
    @Post()    
    async addMessageTemplate(@Req() request:Request, @Body() createMessageTemplateDTO:CreateMessageTemplateDTO)
    {
        let data=await this.messageTemplateService.createNewMessageTemplate(createMessageTemplateDTO,request["user"]['email'])
        return {
            statusCode:HttpStatus.CREATED,
            message:"MessageTemplate add successfully",
            data
        }        
    }



    /**
     * 
     * @api {get} /message-template/ Obtention des message-template de l'utilisateur connecté
     * @apiDescription Obtention des message-template de l'utilisateur connecté
     * @apiName Obtention des message-template de l'utilisateur connecté
     * @apiGroup Gestion de template de message
     * @apiUse apiSecurity
     * @apiUse apiDefaultResponse
     * 
     * @apiSuccess (200 Ok) {Number} statusCode status code
     * @apiSuccess (200 Ok) {String} Response Description
     * @apiSuccess (200 Ok) {Array} data response data
     * @apiSuccess (200 Ok)  {String {2..}} data.title Titre du template
     * @apiSuccess (200 Ok)  {String {2..}} data.description Description du template
     * @apiSuccess (200 Ok)  {String} data.content Contenu du template
     * 
     * @apiError (Error 4xx) 401-Unauthorized Token not supplied/invalid token 
     * @apiUse apiError
     * 
     */
    @Get()
    async getAllUserMessageTemplate(@Req() request:Request)
    {
        let user = await this.usersService.findOneByField({email:request["user"]["email"]});
        
        return {
            statusCode:HttpStatus.OK,
            message:"List des messges templates de l'utilisateur courant",
            data: await this.messageTemplateService.findByField({owner:user.id})
        }
        
    }

    /**
     * 
     * @api {get} /message-template/:id Obtention d'un message template
     * @apiDescription Obtention d'un template a partir de son ID 
     * @apiParam {String} id Identifiant du template
     * @apiName Obtention d'un template à partir de son ID
     * @apiGroup Gestion de template de message
     * @apiUse apiSecurity
     * @apiUse apiDefaultResponse
     * 
     * @apiSuccess (200 Ok) {Number} statusCode status code
     * @apiSuccess (200 Ok) {String} Response Description
     * @apiSuccess (200 Ok) {Object} data response data
     * @apiSuccess (200 Ok)  {String {2..}} data.title Titre du template
     * @apiSuccess (200 Ok)  {String {2..}} data.description Description du template
     * @apiSuccess (200 Ok)  {String} data.content Contenu du template
     * 
     * @apiError (Error 4xx) 401-Unauthorized Token not supplied/invalid token 
     * @apiUse apiError
     * 
     */
    @Get(":id")    
    async getMessageTemplateById(@Req() request:Request, @Param("id",ObjectIDValidationPipe) id:string)
    {
        let data=await this.messageTemplateService.findOneByField({"_id":id})
        return {
            statusCode:HttpStatus.OK,
            message:"MessageTemplate details",
            data
        }        
    }


    /**
     * 
     * @api {put} /message-template/:id Mise a jour du message template
     * @apiDescription Mettre a jour d'un template a partir de son id
     * @apiParam {String} id Identifiant unique du template
     * @apiName Mise à jour d'un template
     * @apiGroup Gestion de template de message
     * @apiUse apiSecurity
     * @apiUse apiDefaultResponse
     * @apiUse UpdateMessageTemplateDTO
     * 
     * @apiSuccess (200 Ok) {Number} statusCode status code
     * @apiSuccess (200 Ok) {String} Response Description
     * @apiSuccess (200 Ok) {Object} data response data
     * @apiSuccess (200 Ok)  {String {2..}} data.title Titre du template
     * @apiSuccess (200 Ok)  {String {2..}} data.description Description du template
     * @apiSuccess (200 Ok)  {String} data.content Contenu du template
     * 
     * @apiError (Error 4xx) 401-Unauthorized Token not supplied/invalid token 
     * @apiUse apiError
     */
    @Put(":id")
    async updateMessageTemplateById(@Req() request:Request, @Param("id",ObjectIDValidationPipe) id:string,@Body() updateMessageTemplateDTO:UpdateMessageTemplateDTO)
    {
        let data=await this.messageTemplateService.update({"_id":id},updateMessageTemplateDTO)
        return {
            statusCode:HttpStatus.OK,
            message:"MessageTemplate updated successfully",
            data
        }
    }

    /**
     * 
     * @api {delete} /message-template/ Suppression d'une liste de message-template
     * @apiDescription Suppression d'une liste de message-template
     * @apiUse DeleteMessageTemplateDTO
     * @apiName Suppression de template de message
     * @apiGroup Gestion de template de message
     * @apiUse apiSecurity
     * @apiUse apiDefaultResponse
     * 
     * @apiSuccess (200 Ok) {Number} statusCode status code
     * @apiSuccess (200 Ok) {String} Response Description
     * @apiSuccess (200 Ok) {Object} data response data
     * 
     * @apiError (Error 4xx) 401-Unauthorized Token not supplied/invalid token 
     * @apiUse apiError
     * 
     */
    @Delete()
    async deleteMessageTemplates(@Req() request:Request,@Body() deleteMessageTemplateDTO:DeleteMessageTemplatesDTO)
    {

        await this.messageTemplateService.executeWithTransaction(async (session)=> {
            deleteMessageTemplateDTO.messageTemplatesID.forEach(async (contactID)=>{
                const messageTemplate=await this.messageTemplateService.findOneByField({"_id":contactID})
                // console.log("MessageTemplate",contact)

                if(!messageTemplate) return Promise.resolve();  
                return await  this.messageTemplateService.delete({_id:messageTemplate._id},session);  
            })
                      
        })
        return {
            statusCode:HttpStatus.OK,
            message:"MessageTemplates supprimés avec success"
        }
    }

    /**
     * 
     * @api {delete} /message-template/:idMessageTemplate Suppression de template de message
     * @apiDescription Suppression d'un template a parti de son id
     * @apiParam {String} idMessageTemplate Identifiant du template
     * @apiName Suppression de template
     * @apiGroup Gestion de template de message
     * @apiUse apiSecurity
     * @apiUse apiDefaultResponse
     * 
     * @apiSuccess (200 Ok) {Number} statusCode status code
     * @apiSuccess (200 Ok) {String} Response Description
     * @apiSuccess (200 Ok) {Object} data response data
     * 
     * @apiError (Error 4xx) 401-Unauthorized Token not supplied/invalid token 
     * @apiUse apiError
     * 
     */
    @Delete(":id")
    async deleteMessageTemplateById(@Req() request:Request,@Param("id",ObjectIDValidationPipe) id:string)
    {
        let contact=await this.messageTemplateService.findOneByField({"_id":id})
        if(!contact) throw new NotFoundException({
            statusCode: 404,
            error:"MessageTemplate/NotFound",
            message:["MessageTemplate not found"]
        })

        await this.messageTemplateService.delete({_id:contact._id});
        return {
            statusCode:HttpStatus.OK,
            message:"MessageTemplate supprimé avec success"
        }
    }

    
}