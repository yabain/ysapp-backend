import { Body, Controller, Post, UseGuards,Req, HttpStatus, Get, Param, ParseUUIDPipe, Put } from "@nestjs/common";
import { Request } from "express";
import { CreateContactDTO } from "../dtos";
import { ContactsService } from "../services";



@Controller("contacts")
export class ContactController
{
    constructor(private contactsService:ContactsService){}

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
     * @api {get} /contacts/:id Mise à jour d'un contact
     * @apiDescription Mise à jour d'un contact a partir de son ID 
     * @apiParam {String} id Identifiant du contact
     * @apiName Obtention d'un contact à partir de son ID
     * @apiGroup Gestion de contact
     * @apiUse apiSecurity
     * @apiUse apiDefaultResponse
     * @apiPermission GameCompetitionPerms.OWNER
     * 
     * @apiSuccess (200 Ok) {Number} statusCode status code
     * @apiSuccess (200 Ok) {String} Response Description
     * @apiSuccess (200 Ok) {Object} data response data
     * @apiSuccess (200 Ok) {String {4..65}} data.name Game competition name
     * @apiSuccess (200 Ok) {String {4..65}} data.description Game competition description
     * @apiSuccess (200 Ok) {Number} level level of games
     * @apiSuccess (200 Ok) {Boolean} isSinglePart It's set to true if it's a one-party competition
     * @apiSuccess (200 Ok) {Boolean} [canRegisterPlayer] is set to true if players can register for the competition
     * @apiSuccess (200 Ok) {String} localisation  competition location area
     * @apiSuccess (200 Ok) {Number} maxPlayerLife  Maximum number of lives of a player in the competition
     * @apiSuccess (200 Ok) {Number} maxTimeToPlay  Number of times defined in seconds to rent to a player to enter a word.
     * @apiSuccess (200 Ok) {Date} startDate game start date
     * @apiSuccess (200 Ok) {Date} endDate game end date
     * @apiSuccess (200 Ok) {Number} maxOfWinners  Maximum number of winners per competition
     * @apiSuccess (200 Ok) {String} lang Language of the competition. it can be "en" for English and "fr" for French
     * @apiSuccess (200 Ok) {String} [parentCompetition] In case it is a sub competition, this value represents the parent competition
     * @apiSuccess (200 Ok) {String[]} gameWinnerCriterias competition winning criteria ID table
     * @apiSuccess (200 Ok) {String[]} gameJudgesID competition judge ID 
     * @apiSuccess (200 Ok) {CreateGamePartDTO[]} gameJudges competition judges ID table
     * 
     * @apiError (Error 4xx) 401-Unauthorized Token not supplied/invalid token 
     * @apiUse apiError
     * 
     */
    @Get(":id")    
    async getContactById(@Req() request:Request, @Param("ref",new ParseUUIDPipe({version:"4"})) id:string)
    {
        let data=await this.contactsService.findOneByField({"contacts.id":id})
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
     * @apiUse UpdateGameCompetitionGameDTO
     * @apiPermission GameCompetitionPerms.CREATE
     * 
     * @apiSuccess (200 Ok) {Number} statusCode status code
     * @apiSuccess (200 Ok) {String} Response Description
     * @apiSuccess (200 Ok) {Object} data response data
     * @apiSuccess (200 Ok) {Number} statusCode status code
     * @apiSuccess (200 Ok) {String} Response Description
     * @apiSuccess (200 Ok) {Object} data response data
     * @apiSuccess (200 Ok)  {String {4..65}} data.firstName Prenom du contact
     * @apiSuccess (200 Ok)  {String {4..65}} data.lastName Nom du contact
     * @apiSuccess (200 Ok)  {String} emaildata. Email du contact
     * @apiSuccess (200 Ok)  {String} data.profilePicture Lien de la photo de profil du contact
     * @apiSuccess (200 Ok)  {String} data.country Pays d'habitation du contact
     * @apiSuccess (200 Ok)  {String} data.whatsappContact Numero whatsapp du contact
     * @apiSuccess (200 Ok)  {String} data.skype Contact skype 
     * @apiSuccess (200 Ok)  {String} data.websiteLink Lien du site web du contact 
     * @apiSuccess (200 Ok)  {String} data.location Zone de localisation du contact
     * @apiSuccess (200 Ok)  {String} data.phoneNumber Autre numéro de téléphone du contact
     * 
     * @apiError (Error 4xx) 401-Unauthorized Token not supplied/invalid token 
     * @apiUse apiError
     * 
     */
    @Put(":id")
    async updateContactById(@Req() request:Request, @Param("ref",new ParseUUIDPipe({version:"4"})) id:string)
    {
        let data=await this.contactsService.update({"_id":id},{})
    }
}