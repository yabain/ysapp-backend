import { Body, Controller, Delete, Get, HttpCode, HttpStatus, NotFoundException, Param, ParseUUIDPipe, Post, Put, Req, UseGuards } from "@nestjs/common";
import { AddContactToGroupDTO, CreateGroupDTO, UpdateGroupDTO } from "../dtos";
import { Request } from "express";
import { GroupService } from "../services/group.service";
import { UsersService } from "src/user/services/users.service"
import { ObjectIDValidationPipe } from "src/shared/pipes";

@Controller("groups")
export class GroupController
{
    constructor(private groupsService:GroupService, private usersService:UsersService){}

    
    /**
     * 
     * @api {get} /groups/ Obtention des groups de contacts
     * @apiDescription Obtention des groupes de contacts
     * @apiName Obtention des groupes de contacts
     * @apiGroup Gestion de groupe
     * @apiUse apiSecurity
     * @apiUse apiDefaultResponse
     * 
     * @apiSuccess (200 Ok) {Number} statusCode status code
     * @apiSuccess (200 Ok) {String} Response Description
     * @apiSuccess (200 Ok) {Object} data response data
     * @apiSuccess (200 Ok) {String {4..65}} data.name Nom du group de contact
     * @apiSuccess (200 Ok) {String {4..65}} data.description Description du groupe de contact
     * @apiSuccess (200 Ok) {String} data.profilePicture Lien de la photo de groupe
     * @apiSuccess (200 Ok) {Array} data.contacts Liste des contacts du group
     * @apiSuccess (200 Ok) {String {4..65}} data.contacts.firstName Prenom du contact
     * @apiSuccess (200 Ok) {String {4..65}} data.contacts.lastName Nom du contact
     * @apiSuccess (200 Ok) {String} data.contacts.email Email du contact
     * @apiSuccess (200 Ok) {String} data.contacts.profilePicture Lien de la photo de profil du contact
     * @apiSuccess (200 Ok) {String} data.contacts.country Pays d'habitation du contact
     * @apiSuccess (200 Ok) {String} data.contacts.whatsappContact Numero whatsapp du contact
     * @apiSuccess (200 Ok) {String} data.contacts.skype Contact skype 
     * @apiSuccess (200 Ok) {String} data.contacts.websiteLink Lien du site web du contact 
     * @apiSuccess (200 Ok) {String} data.contacts.location Zone de localisation du contact
     * @apiSuccess (200 Ok) {String} data.contacts.phoneNumber Autre numéro de téléphone du contact
     * 
     * 
     * @apiError (Error 4xx) 401-Unauthorized Token not supplied/invalid token 
     * @apiUse apiError
     * 
     */
    @Get()    
    async getGroups(@Req() request:Request)
    {
        const user = await this.usersService.findOneByField({ email: request["user"]["email"] });
        // console.log("User ",user)
        return {
            statusCode:HttpStatus.CREATED,
            message:"Liste des groups de contacts",
            data: user.groups
        }        
    }

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
     * @apiSuccess (201 Created)  {String {4..65}} data.name Nom du group de contact
     * @apiSuccess (201 Created)  {String {4..65}} data.description Description du groupe de contact
     * @apiSuccess (201 Created)  {String} data.profilePicture Lien de la photo de groupe
     * @apiSuccess (201 Created)  {Array} data.contacts Liste des contacts du group
     * @apiSuccess (201 Created)  {String {4..65}} data.contacts.firstName Prenom du contact
     * @apiSuccess (201 Created)  {String {4..65}} data.contacts.lastName Nom du contact
     * @apiSuccess (201 Created)  {String} data.contacts.email Email du contact
     * @apiSuccess (201 Created)  {String} data.contacts.profilePicture Lien de la photo de profil du contact
     * @apiSuccess (201 Created)  {String} data.contacts.country Pays d'habitation du contact
     * @apiSuccess (201 Created)  {String} data.contacts.whatsappContact Numero whatsapp du contact
     * @apiSuccess (201 Created)  {String} data.contacts.skype Contact skype 
     * @apiSuccess (201 Created)  {String} data.contacts.websiteLink Lien du site web du contact 
     * @apiSuccess (201 Created)  {String} data.contacts.location Zone de localisation du contact
     * @apiSuccess (201 Created)  {String} data.contacts.phoneNumber Autre numéro de téléphone du contact
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
     * @apiParam {String} idGroup Identifiant du groupe
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
    async getAllllGroupContact(@Param("idGroup",ObjectIDValidationPipe) idGroup:string)
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
    async getGroupById(@Req() request:Request, @Param("id",ObjectIDValidationPipe) id:string)
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
    async updateGroupById(@Req() request:Request, @Param("id",ObjectIDValidationPipe) id:string,updateGroupDTO:UpdateGroupDTO)
    {
        let data=await this.groupsService.findOneByField({"_id":id})
        if(!data) throw new NotFoundException({
            statusCode: 404,
            error:"ContactGroup/NotFound",
            message:["Contact group not found"]
        })

        data=await this.groupsService.update({"_id":id},updateGroupDTO);
        return {
            statusCode:HttpStatus.OK,
            message:"Group updated successfully",
            data
        }
    }

    /**
     * 
     * @api {delete} /groups/:idGroup/:idGroupToTransfert Suppression de groupe
     * @apiDescription Suppression d'un groupe a partir de son ID. un autre ID optionnel supplémentaire peut-être envoyé et representant l'ID du groupe ou serons
     *  transferer les contacts du groupe en cours de suppression
     * @apiParam {String} idGroup Identifiant du groupe
     * @apiParam {String} [idGroupToTransfert] Identifiant du groupe vers lequel serons tranferer les contacts de l'ancien groupe
     * @apiName Suppression de groupe
     * @apiGroup Gestion de groupe
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
    @Delete(":idGroup/:idGroupToTransfert")
    async deleteGroupeById( @Param("idGroup",ObjectIDValidationPipe) idGroup:string,@Param("idGroupToTransfert",ObjectIDValidationPipe) idGroupToTransfert:string)
    {
        let group=await this.groupsService.findOneByField({"_id":idGroup})
        if(!group) throw new NotFoundException({
            statusCode: 404,
            error:"ContactGroup/NotFound",
            message:["Contact group not found"]
        })

        let groupToTransfert=null;
        if(idGroupToTransfert)
        {
            let groupToTransfert=await this.groupsService.findOneByField({"_id":idGroupToTransfert})
            if(!groupToTransfert) throw new NotFoundException({
                statusCode: 404,
                error:"ContactGroup/NotFound",
                message:["Contact group to transfert contact not found"]
            })
        }

        await this.groupsService.executeWithTransaction(async (session)=> { 
            await  Promise.all(
                group.contacts.map((contact)=>{
                    //retrait dans le groupe actuelle
                    let oldGroupIndex=contact.groups.findIndex((groupSearch)=>groupSearch._id==idGroup);
                    if(oldGroupIndex>-1) contact.groups.splice(oldGroupIndex,1);

                    //ajout dans le nouveau groupe
                    if(groupToTransfert) 
                    {
                        let newGroup = contact.groups.find((groupSearch)=>groupSearch._id==idGroupToTransfert);
                        if(!newGroup) 
                        {
                            contact.groups.push(groupToTransfert);
                            groupToTransfert.push(contact)
                            groupToTransfert.save({session})
                        }                                                
                    }                    
                    return contact.save({session})
                })
            )   
            
            //suppression du groupe
            this.groupsService.delete({"_id":group._id},session);
            return {
                statusCode:HttpStatus.OK,
                message:"Group deleted successfully",
            }
        })


    }


    
}