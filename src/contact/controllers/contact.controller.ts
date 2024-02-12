import { Body, Controller, Post, UseGuards,Req, HttpStatus, Get, Param, ParseUUIDPipe,MethodNotAllowedException, Put, Delete,NotFoundException, UnprocessableEntityException, UseInterceptors, UploadedFiles } from "@nestjs/common";
import { Request } from "express";
import { CreateContactDTO, DeleteContactsDTO, UpdateContactDTO } from "../dtos";
import { ContactsService } from "../services";
import { UsersService } from "src/user/services";
import { GroupService } from "src/group/services/group.service";
import { ObjectIDValidationPipe } from "src/shared/pipes";
import { FilesInterceptor } from "@nestjs/platform-express";
import * as path from "path";
import { Readable } from "stream";
import * as Papa from "papaparse"
import { WhatsappClientServiceWS } from "src/message/services/whatsapp-client-ws.service";
import { WhatsappAnnouncementService } from "src/message/services";
import { Contact } from "whatsapp-web.js";



@Controller("contacts")
export class ContactController
{
    constructor(
        private contactsService:ContactsService,
        private usersService:UsersService,
        private groupService:GroupService, 
        private whatsappAnnouncementService:WhatsappAnnouncementService
    ){}

    /**
     * 
     * @api {post} /contacts/ Creation d'un contact
     * @apiDescription Creation d'un nouveau contact
     * @apiName Creation d'un contact
     * @apiGroup Gestion de contact
     * @apiUse apiSecurity
     * @apiUse apiDefaultResponse
     * @apiUse CreateContactDTO
     * 
     * @apiSuccess (201 Created) {Number} statusCode status code
     * 
     * @apiSuccess (201 Created) {Number} statusCode status code
     * @apiSuccess (201 Created) {String} Response Description
     * @apiSuccess (201 Created) {Object} data response data
     * @apiSuccess (201 Created)  {String {4..65}} data.firstName Prenom du contact
     * @apiSuccess (201 Created)  {String {4..65}} data.lastName Nom du contact
     * @apiSuccess (201 Created)  {String} data.email Email du contact
     * @apiSuccess (201 Created)  {String} data.profilePicture Lien de la photo de profil du contact
     * @apiSuccess (201 Created)  {String} data.country Pays d'habitation du contact
     * @apiSuccess (201 Created)  {String} data.whatsappContact Numero whatsapp du contact
     * @apiSuccess (201 Created)  {String} data.skype Contact skype 
     * @apiSuccess (201 Created)  {String} data.websiteLink Lien du site web du contact 
     * @apiSuccess (201 Created)  {String} data.address addresse de localisation du contact
     * @apiSuccess (201 Created)  {String} data.phoneNumber Autre numéro de téléphone du contact
     * @apiSuccess (201 Created)  {String} data.gender Sexe du contact
     * @apiSuccess (201 Created)  {String} data.about Biographie du contact
     * @apiSuccess (201 Created)  {String} data.organization Organisation du contact
     * @apiSuccess (201 Created)  {String} data.city Ville de résidence du contact
     * @apiSuccess (201 Created)  {String} data.birthday Date d'anniversaire du contact
     * @apiSuccess (201 Created)  {Array} data.groups Group de contact
     * @apiSuccess (201 Created)  {String {4..65}} data.groups.name Nom du group de contact
     * @apiSuccess (201 Created)  {String {4..65}} data.groups.description Description du groupe de contact
     * @apiSuccess (201 Created)  {String} data.groups.profilePicture Lien de la photo de groupe
     * 
     * @apiError (Error 4xx) 401-Unauthorized Token not supplied/invalid token 
     * @apiUse apiError
     * 
     */
    @Post()    
    async addContact(@Req() request:Request, @Body() createContactDTO:CreateContactDTO)
    {
        let data=await this.contactsService.createNewContact(createContactDTO,request["user"]['email'])
        return {
            statusCode:HttpStatus.CREATED,
            message:"Contact add successfully",
            data
        }        
    }

    /**
     * 
     * @api {post} /contacts/import Importer une liste de contacts
     * @apiDescription Importation d'un liste de contact contenu dans un fichier au format csv. Le contenu du fichier csv
     *   contient les colones suivantes: 
     *   `firstName,lastName,email,profilePicture,phoneNumber,gender,country,whatsappContact,websiteLink,address,birthday,about,organization,city`
     * @apiName Importation de contacts
     * @apiGroup Gestion de contact
     * @apiUse apiSecurity
     * @apiUse apiDefaultResponse
     * @apiUse CreateContactDTO
     * 
     * @apiSuccess (201 Created) {Number} statusCode status code
     * 
     * @apiSuccess (201 Created) {Number} statusCode status code
     * @apiSuccess (201 Created) {String} Response Description
     
     * 
     * @apiError (Error 4xx) 401-Unauthorized Token not supplied/invalid token 
     * @apiUse apiError
     * 
     */
    @Post("import")
    @UseInterceptors(FilesInterceptor('files',20,{
        fileFilter:(req, file, callback) => {
            let ext = path.extname(file.originalname);
            if (!['.csv'].includes(ext.toLowerCase())) {
              return callback(new UnprocessableEntityException({
                statusCode:HttpStatus.UNPROCESSABLE_ENTITY,
                error:"Unprocessable entity",
                message:['Invalid file type']
            }), false);
            }
          
            return callback(null, true);
          }
    }))   
    async addContacts(@UploadedFiles() files:Express.Multer.File[],@Req() request:Request,)
    {
        //format:
        let data:any = await new Promise((resolve,reject)=>{
            Papa.parse(Readable.from(files[0].buffer), {
                header: true,
                skipEmptyLines:true,
                transformHeader: (header)=>header.toLowerCase(),
                complete:(results)=>{
                    resolve(results.data)                    
                },
                errors: (error)=>reject(error)
              });

        })
        await this.contactsService.createBulkContact(data,request["user"]['email'])
        return {
            statusCode:HttpStatus.CREATED,
            message:"Liste de contact importé avec succés",
        }
    }


    /**
     * 
     * @api {get} /contacts/ Obtention des contacts de l'utilisateur connecté
     * @apiDescription Obtention des contacts de l'utilisateur connecté
     * @apiName Obtention des contacts de l'utilisateur connecté
     * @apiGroup Gestion de contact
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
    @Get()
    async getAllUserContact(@Req() request:Request)
    {
        let user = await this.usersService.findOneByField({email:request["user"]["email"]});
        return {
            statusCode:HttpStatus.OK,
            message:"List des contacts de l'utilisateur courant",
            data:user.contacts
        }
        
    }

    /**
     * 
     * @api {get} /contacts/:id Obtention d'un contact
     * @apiDescription Obtention d'un contact a partir de son ID 
     * @apiParam {String} id Identifiant du contact
     * @apiName Obtention d'un contact à partir de son ID
     * @apiGroup Gestion de contact
     * @apiUse apiSecurity
     * @apiUse apiDefaultResponse
     * 
     * @apiSuccess (200 Ok) {Number} statusCode status code
     * @apiSuccess (200 Ok) {String} Response Description
     * @apiSuccess (200 Ok) {Object} data response data
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
    @Get(":id")    
    async getContactById(@Req() request:Request, @Param("id",ObjectIDValidationPipe) id:string)
    {
        let data=await this.contactsService.findOneByField({"_id":id})
        return {
            statusCode:HttpStatus.OK,
            message:"Contact details",
            data
        }        
    }

    /**
     * 
     * @api {put} /contacts/:id Mise a jour du contact
     * @apiDescription Mettre a jour un contact a partir de son id
     * @apiParam {String} id Identifiant unique du contact
     * @apiName Mise à jour d'un contact
     * @apiGroup Gestion de contact
     * @apiUse apiSecurity
     * @apiUse apiDefaultResponse
     * @apiUse UpdateContactDTO
     * 
     * @apiSuccess (200 Ok) {Number} statusCode status code
     * @apiSuccess (200 Ok) {String} Response Description
     * @apiSuccess (200 Ok) {Object} data response data
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
    @Put(":id")
    async updateContactById(@Req() request:Request, @Param("id",ObjectIDValidationPipe) id:string,@Body() updateContactDTO:UpdateContactDTO)
    {
        let data=await this.contactsService.update({"_id":id},updateContactDTO)
        return {
            statusCode:HttpStatus.OK,
            message:"Contact updated successfully",
            data
        }
    }

    /**
     * 
     * @api {delete} /contacts/ Suppression d'une liste de contacts
     * @apiDescription Suppression d'une liste de contacts
     * @apiUse DeleteContactDTO
     * @apiName Suppression de contact
     * @apiGroup Gestion de contact
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
    async deleteContacts(@Req() request:Request,@Body() deleteContactDTO:DeleteContactsDTO)
    {

        await this.contactsService.executeWithTransaction(async (session)=> {
            deleteContactDTO.contactsID.forEach(async (contactID)=>{
                const contact=await this.contactsService.findOneByField({"_id":contactID})
            console.log("Contact",contact)

                if(!contact) return Promise.resolve();
                await Promise.all(contact.groups.map(async (group)=>{
                    let fGroup=await this.groupService.findOneByField({_id:group._id})
                    console.log("Group ",fGroup)
                    if(fGroup) {
                        let indexContact = fGroup.contacts.findIndex((fc)=>fc._id==contact._id);
                        if(indexContact>-1) {
                            fGroup.contacts.splice(indexContact,1);
                            await fGroup.save({session})
                        }
                    }
                    return Promise.resolve();
                }))   
                return await  this.contactsService.delete({_id:contact._id},session);  
            })
                      
        })
        return {
            statusCode:HttpStatus.OK,
            message:"Contacts supprimés avec success"
        }
    }

    /**
     * 
     * @api {delete} /contacts/:idContact Suppression de contact
     * @apiDescription Suppression d'un contact a parti de son id
     * @apiParam {String} idContact Identifiant du contact
     * @apiName Suppression de contact
     * @apiGroup Gestion de contact
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
    async deleteContactById(@Req() request:Request,@Param("id",ObjectIDValidationPipe) id:string)
    {
        let contact=await this.contactsService.findOneByField({"_id":id})
        if(!contact) throw new NotFoundException({
            statusCode: 404,
            error:"Contact/NotFound",
            message:["Contact not found"]
        })

        await this.contactsService.executeWithTransaction(async (session)=> {
            await Promise.all(contact.groups.map(async (group)=>{
                let fGroup=await this.groupService.findOneByField({_id:group._id})
                if(fGroup) {
                    let indexContact = fGroup.contacts.findIndex((fc)=>fc._id==contact._id);
                    if(indexContact>-1) {
                        fGroup.contacts.splice(indexContact,1);
                       return fGroup.save({session})
                    }
                }
                return Promise.resolve();
            }))

            return await this.contactsService.delete({_id:contact._id},session);
        })

        return {
            statusCode:HttpStatus.OK,
            message:"Contact supprimé avec success"
        }
    }

    /**
     * 
     * @api {post} /contacts/sync-whatsapp Synchronization  de contact
     * @apiDescription Synchroniser les contacts depuis whatsapp
     * @apiName Synchronisation de contact
     * @apiGroup Gestion de contact
     * @apiUse apiSecurity
     * @apiUse apiDefaultResponse
     * 
     * @apiSuccess (200 Ok) {Number} statusCode status code
     * @apiSuccess (200 Ok) {String} Response Description
     * 
     * @apiError (Error 4xx) 401-Unauthorized Token not supplied/invalid token 
     * @apiUse apiError
     * 
     */
    @Post("sync-whatsapp")
    async syncContactFromWhatsapp(@Req() request:Request)
    {
        let user = await this.usersService.findOneByField({email:request["user"]["email"]});
        console.log("client ",this.whatsappAnnouncementService.clientsWhatsApp.size)
        if(!this.whatsappAnnouncementService.clientsWhatsApp.has(user._id.toString())) throw new NotFoundException({
            statusCode: 404,
            error:"UserSync/NotFound",
            message:["User sync not found"]
        })

        let userWhatsappSync:WhatsappClientServiceWS = this.whatsappAnnouncementService.clientsWhatsApp.get(user._id.toString());
        if(!(await userWhatsappSync.isConnected())) throw new MethodNotAllowedException({
            statusCode: HttpStatus.METHOD_NOT_ALLOWED,
            error:"UserSync/NotFound",
            message:["User sync not found"]
        })

        let userContactLists:any[] = await userWhatsappSync.getContacts();

        await this.contactsService.createBulkContact(userContactLists.map((contact)=>{
            return {
                fullName:contact.name,
                avatar:contact.avatar,
                emails:[],
                phoneNumbers:[{phoneNumber:contact.number,label:"whatsapp",country:contact.countryCode}],
                websiteLink:"",
                address:"",
                birthday:"",
                about:"",
                jobTitle:"",
                organization:"",
                company:""
            }
        }),user.email);

        return {
            statusCode:HttpStatus.OK,
            message:"Contacts synchronisés avec success"
        }
    }  
}