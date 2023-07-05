import { Controller, UseGuards,Get, Req, Param, Body, Delete, HttpStatus, NotFoundException, Put } from "@nestjs/common";
import { ObjectIDValidationPipe } from "src/shared/pipes";
import { Request } from "express"
import { UpdateUserDTO } from "../dtos";
import { UsersService } from "../services";
import { Resource, Scopes } from "nest-keycloak-connect";
import { User } from "../models";

// @UseGuards(UserJwtAuthGuard)
@Resource(User.name)
@Controller("/user/profil")
export class UserProfilController
{
    constructor(
        private userService:UsersService
    ){}
    
    /**
     * @api {post} /user/profil/:id Get user by id
     * @apidescription Get user details by id
     * @apiParam {String} id User unique ID
     * @apiName Get profil
     * @apiGroup User
     * @apiUse apiSecurity
     * @apiSuccess (200 Ok) {Number} statusCode HTTP status code
     * @apiSuccess (200 Ok) {String} Response Description
     * @apiSuccess (200 Ok) {Object} data response data
     * @apiSuccess (200 Ok) {Object} data.user User information
     * @apiSuccess (200 Ok) {String} data.user._id User id
     * @apiSuccess (200 Ok) {String} data.user.firstName User firstname
     * @apiSuccess (200 Ok) {String} data.user.lastName User lastname
     * @apiSuccess (200 Ok) {String} data.user.email User email
     * @apiSuccess (200 Ok) {Boolean} data.user.emailConfirmed is it a valid user account?
     * @apiSuccess (200 Ok) {String} data.user.profilPicture user picture profile
     * @apiSuccess (200 Ok) {String} data.user.country user country
     * @apiSuccess (200 Ok) {String} data.user.location user location
     * @apiSuccess (200 Ok) {String} data.user.permissions user permission
     * @apiSuccess (200 Ok) {String} data.user.createAt Account creation date
     * 
     * @apiError (Error 4xx) 401-Unauthorized Token not supplied/invalid token 
     * @apiError (Error 4xx) 404-NotFound User not found
     * @apiUse apiError
     */
    @Get(":id")
    @Scopes("View")
    async getUserProfilById( @Param("id",ObjectIDValidationPipe) id:string)
    {
        let data = await this.userService.findOneByField({"_id":id})
        if(!data) throw new NotFoundException({
            statusCode: 404,
            error:"NotFound",
            message:["User not found"]
        })
        return {
            statusCode:HttpStatus.OK,
            message:"User details",
            data
        }
    }

    /**
     * @api {delete} /user/profil/:id delete user by id
     * @apidescription Delete user profile
     * @apiParam {String} id Users unique ID
     * @apiName Delete usser
     * @apiGroup User
     * @apiUse apiSecurity
     * @apiSuccess (200 Ok) {Number} statusCode HTTP status code
     * @apiSuccess (200 Ok) {String} Response Description
     * 
     * @apiError (Error 4xx) 401-Unauthorized Token not supplied/invalid token 
     * @apiError (Error 4xx) 404-NotFound User not found
     * @apiUse apiError
     */
    @Delete(":id")
    async deleteUserById(@Param("id",ObjectIDValidationPipe) id:string)
    {
        let data = await this.userService.findOneByField({"_id":id});
        if(!data || (data && data.isDeleted)) throw new NotFoundException({
            statusCode: HttpStatus.NOT_FOUND,
            error:"NotFound",
            message:["User not found"]
        })

        await this.userService.update({"_id":id},{isDeleted:true})
        
        return {
            statusCode:HttpStatus.OK,
            message:"User deleted successfully ",
        }
    }


    /**
     * @api {put} /user/profil/:id update user profil by id
     * @apidescription Update user profil by id
     * @apiParam {String} id Users unique ID
     * @apiName Update profil
     * @apiGroup User
     * @apiUse apiSecurity
     * @apiSuccess (200 Ok) {Number} statusCode HTTP status code
     * @apiSuccess (200 Ok) {String} Response Description
     * @apiSuccess (200 Ok) {Object} data response data
     * @apiSuccess (200 Ok) {Object} data.user User information
     * @apiSuccess (200 Ok) {String} data.user._id User id
     * @apiSuccess (200 Ok) {String} data.user.firstName User firstname
     * @apiSuccess (200 Ok) {String} data.user.lastName User lastname
     * @apiSuccess (200 Ok) {String} data.user.email User email
     * @apiSuccess (200 Ok) {Boolean} data.user.emailConfirmed is it a valid user account?
     * @apiSuccess (200 Ok) {String} data.user.profilPicture user picture profile
     * @apiSuccess (200 Ok) {String} data.user.country user country
     * @apiSuccess (200 Ok) {String} data.user.location user location
     * @apiSuccess (200 Ok) {String} data.user.permissions user permission
     * @apiSuccess (200 Ok) {String} data.user.createAt Account creation date
     * @apiSuccess (200 Ok) {String} data.user.userSetting Account settings
     * @apiSuccess (200 Ok) {String} data.user.userSetting.language Account language
     * @apiSuccess (200 Ok) {String} data.user.userSetting.theme Account theme
     * @apiSuccess (200 Ok) {String} data.user.userSetting.currency Account currency
     * @apiSuccess (200 Ok) {String} data.user.userSetting.isEnglishTimeFormatFor accounts whose date respects the English format
     * @apiSuccess (200 Ok) {String} data.user.createAt Account creation date
     * 
     * @apiError (Error 4xx) 401-Unauthorized Token not supplied/invalid token 
     * @apiError (Error 4xx) 404-NotFound User not found
     * @apiUse apiError
     */
    @Put(":id")
    async updateUserById(@Param("id",ObjectIDValidationPipe) id:string, @Body() updateUser:UpdateUserDTO)
    {
        let data = await this.userService.findOneByField({"_id":id});
        if(!data) throw new NotFoundException({
            statusCode: HttpStatus.NOT_FOUND,
            error:"NotFound",
            message:["User not found"]
        })

        data=await this.userService.update({"_id":id},updateUser)
        
        return {
            statusCode:HttpStatus.OK,
            message:"User updated successfully ",
            data
        }
    }
}