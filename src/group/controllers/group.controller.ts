import { Body, Controller, Get, HttpCode, HttpStatus, NotFoundException, Param, ParseUUIDPipe, Post, Put, Req, UseGuards } from "@nestjs/common";
import { AddContactToGroupDTO, CreateGroupDTO, UpdateGroupDTO } from "../dtos";
import { Request } from "express";
import { GroupService } from "../services/group.service";

@Controller("groups")
export class GroupController
{
    constructor(private groupsService:GroupService){}

    /**
     * 
     * @api {post} /groups/ Creation d'un groupe de contacts
     * @apiDescription Creation d'un nouveau groupe de contacts
     * @apiName Creation d'un nouveau groupe
     * @apiGroup Gestion de groupe
     * @apiUse apiSecurity
     * @apiUse apiDefaultResponse
     * @apiUse CreateGroupDTO
     * 
     * @apiSuccess (201 Created) {Number} statusCode status code
     * @apiSuccess (201 Created) {String} Response Description
     * @apiSuccess (201 Created) {Object} data response data
     * @apiSuccess (201 Created)  {String {4..65}} data.firstName Prenom du contact
     * @apiSuccess (201 Created)  {String {4..65}} data.lastName Nom du contact
     * @apiSuccess (201 Created)  {String} emaildata. Email du contact
     * @apiSuccess (201 Created)  {String} data.profilePicture Lien de la photo de profil du contact
     * @apiSuccess (201 Created)  {String} data.country Pays d'habitation du contact
     * @apiSuccess (201 Created)  {String} data.whatsappContact Numero whatsapp du contact
     * @apiSuccess (201 Created)  {String} data.skype Contact skype 
     * @apiSuccess (201 Created)  {String} data.websiteLink Lien du site web du contact 
     * @apiSuccess (201 Created)  {String} data.location Zone de localisation du contact
     * @apiSuccess (201 Created)  {String} data.phoneNumber Autre numéro de téléphone du contact
     * 
     * @apiError (Error 4xx) 401-Unauthorized Token not supplied/invalid token 
     * @apiUse apiError
     * 
     */
    @Post()    
    async addGroup(@Req() request:Request, @Body() createGroupDTO:CreateGroupDTO)
    {
        let data=await this.groupsService.createNewGroup(createGroupDTO,request["user"]["email"])
        return {
            statusCode:HttpStatus.CREATED,
            message:"Group add successfully",
            data
        }        
    }

    /**
     * 
     * @api {get} /groups/:idGroup/contacts Obtention des contacts d'un groupe
     * @apiDescription Obtention des contacts d'un groupe
     * @apiName Obtention des contacts d'un groupe
     * @apiGroup Gestion de groupe
     * @apiUse apiSecurity
     * @apiUse apiDefaultResponse
     * 
     * @apiSuccess (200 Ok) {Number} statusCode status code
     * @apiSuccess (200 Ok) {String} Response Description
     * @apiSuccess (200 Ok) {Array} data response data
     * @apiSuccess (200 Ok)  {String {4..65}} data.firstName Prenom du contact
     * @apiSuccess (200 Ok)  {String {4..65}} data.lastName Nom du contact
     * @apiSuccess (200 Ok)  {String} data.email Email du contact
     * @apiSuccess (200 Ok)  {String} data.profilePicture Lien de la photo de profil du contact
     * @apiSuccess (200 Ok)  {String} data.country Pays d'habitation du contact
     * @apiSuccess (200 Ok)  {String} data.whatsappContact Numero whatsapp du contact
     * @apiSuccess (200 Ok)  {String} data.skype Contact skype 
     * @apiSuccess (200 Ok)  {String} data.websiteLink Lien du site web du contact 
     * @apiSuccess (200 Ok)  {String} data.address addresse de localisation du contact
     * @apiSuccess (200 Ok)  {String} data.phoneNumber Autre numéro de téléphone du contact
     * @apiSuccess (200 Ok)  {String} data.gender Sexe du contact
     * @apiSuccess (200 Ok)  {String} data.about Biographie du contact
     * @apiSuccess (200 Ok)  {String} data.organization Organisation du contact
     * @apiSuccess (200 Ok)  {String} data.city Ville de résidence du contact
     * @apiSuccess (200 Ok)  {String} data.birthday Date d'anniversaire du contact
     * @apiSuccess (200 Ok)  {Array} data.groups Group de contact
     * @apiSuccess (200 Ok)  {String {4..65}} data.groups.name Nom du group de contact
     * @apiSuccess (200 Ok)  {String {4..65}} data.groups.description Description du groupe de contact
     * @apiSuccess (200 Ok)  {String} data.groups.profilePicture Lien de la photo de groupe
     * 
     * @apiError (Error 4xx) 401-Unauthorized Token not supplied/invalid token 
     * @apiUse apiError
     * 
     */
    @Get(":idGroup/contacts")
    async getAllllGroupContact(@Param("idGroup",new ParseUUIDPipe({version:"4"})) idGroup:string)
    {
        let data=await this.groupsService.findOneByField({"_id":idGroup})
        if(!data) throw new NotFoundException({
            statusCode: 404,
            error:"ContactGroup/NotFound",
            message:["Contact group not found"]
        })

        return {
            statusCode:HttpStatus.OK,
            message:"List des contacts du groupe",
            data:data.contacts
        }
    }

    /**
     * 
     * @api {post} /groups/contact/ Ajout d'un contact a un groupe
     * @apiDescription Ajout d'un contact a un groupe en tant que membre
     * @apiName Ajout d'un contact a un groupe
     * @apiGroup Gestion de groupe
     * @apiUse apiSecurity
     * @apiUse apiDefaultResponse
     * @apiUse AddContactToGroupDTO
     * 
     * @apiSuccess (200 Ok) {Number} statusCode status code
     * @apiSuccess (200 Ok) {String} Response Description
     * @apiError (Error 4xx) 401-Unauthorized Token not supplied/invalid token 
     * @apiUse apiError
     * 
     */
    @HttpCode(HttpStatus.OK)
    @Post("contact")
    async addContactToGroup(@Req() request:Request, @Body() addContactToGroupDTO:AddContactToGroupDTO)
    {
        await this.groupsService.addContactToGroup(request["user"]["email"],addContactToGroupDTO.contactId,addContactToGroupDTO.groupId)
        return {
            statusCode:HttpStatus.OK,
            message:"Contact add to group successfully"
        }   
    }

    /**
     * 
     * @api {get} /groups/:id Obtention des informations d'un groupe a partir de son ID
     * @apiDescription Obtention des informations d'un groupe
     * @apiParam {String} id Identifiant du groupe
     * @apiName Obtention d'un groupe à partir de son ID
     * @apiGroup Gestion de groupe
     * @apiUse apiSecurity
     * @apiUse apiDefaultResponse
     * 
     * @apiSuccess (200 Ok) {Number} statusCode status code
     * @apiSuccess (200 Ok) {String} Response Description
     * @apiSuccess (200 Ok) {Object} data response data
     * @apiSuccess (200 Ok)  {String {4..65}} data.name Nom du group de contact
     * @apiSuccess (200 Ok)  {String {4..65}} data.description Description du groupe de contact
     * @apiSuccess (200 Ok)  {String} data.profilePicture Lien de la photo de groupe
     * 
     * @apiError (Error 4xx) 401-Unauthorized Token not supplied/invalid token 
     * @apiUse apiError
     * 
     */
    @Get(":id")    
    async getGroupById(@Req() request:Request, @Param("id",new ParseUUIDPipe({version:"4"})) id:string)
    {
        let data=await this.groupsService.findOneByField({"_id":id})
        if(!data) throw new NotFoundException({
            statusCode: 404,
            error:"ContactGroup/NotFound",
            message:["Contact group not found"]
        })
        return {
            statusCode:HttpStatus.OK,
            message:"Group details",
            data
        }        
    }

    /**
     * 
     * @api {put} /groups/:id Mise à jour des informations d'un groupe a partir de son ID
     * @apiDescription Mise à jour des informations d'un groupe à partir de son ID
     * @apiParam {String} id Identifiant du groupe
     * @apiName Mise à jour d'un groupe à partir de son ID
     * @apiGroup Gestion de groupe
     * @apiUse apiSecurity
     * @apiUse UpdateGroupDTO
     * @apiUse apiDefaultResponse
     * 
     * @apiSuccess (200 Ok) {Number} statusCode status code
     * @apiSuccess (200 Ok) {String} Response Description
     * @apiSuccess (200 Ok) {Object} data response data
     * @apiSuccess (200 Ok)  {String {4..65}} data.name Nom du group de contact
     * @apiSuccess (200 Ok)  {String {4..65}} data.description Description du groupe de contact
     * @apiSuccess (200 Ok)  {String} data.profilePicture Lien de la photo de groupe
     * 
     * @apiError (Error 4xx) 401-Unauthorized Token not supplied/invalid token 
     * @apiUse apiError
     * 
     */
    @Put(":id")
    async updateGroupById(@Req() request:Request, @Param("id",new ParseUUIDPipe({version:"4"})) id:string,updateGroupDTO:UpdateGroupDTO)
    {
        let data=await this.groupsService.update({"_id":id},updateGroupDTO);
        return {
            statusCode:HttpStatus.OK,
            message:"Group updated successfully",
            data
        }
    }

    
}