import { Controller, Post, UseGuards, Body, HttpStatus, Req,Get, UnprocessableEntityException, UploadedFiles, UseInterceptors, Put, Delete, Param } from "@nestjs/common";
import { Request } from "express";
import { UsersService } from "src/user/services";
import { FilesInterceptor } from "@nestjs/platform-express";
import * as path from "path";
import { PlanificationService } from "../services";
import { UpdatePlanificationDTO, UpdateStatePlanificationDTO } from "../dtos";
import { ObjectIDValidationPipe } from "src/shared/pipes";

@Controller("planifications")
export class PlanificationController
{
    constructor(
        private planificationService:PlanificationService,
        ){}

    /**
     * 
     * @api {get} /planification/ Obtention des planifications de l'utilisateur connecté
     * @apiDescription Obtention des contacts de l'utilisateur connecté
     * @apiName Obtention des contacts de l'utilisateur connecté
     * @apiGroup Gestion de contact
     * @apiUse apiSecurity
     * @apiUse apiDefaultResponse
     * 
     * @apiSuccess (200 Ok) {Number} statusCode status code
     * @apiSuccess (200 Ok) {String} Response Description
     * @apiSuccess (200 Ok) {Array} data response data
     * 
     * @apiError (Error 4xx) 401-Unauthorized Token not supplied/invalid token 
     * @apiUse apiError
     * 
     */
    @Get()
    async getAllUserContact(@Req() request:Request)
    {
        let plans = await this.planificationService.findByField({"owner.email":request["user"]["email"]});
        return {
            statusCode:HttpStatus.OK,
            message:"List des plannifications de l'utilisateur courant",
            data:plans
        }        
    }

    
    @Put(":planificationID")
    async updatePlanification(@Param("planificationID",ObjectIDValidationPipe) planificationID:string, @Body() updatePlanfication:UpdatePlanificationDTO)
    {
        return {
            statusCode:HttpStatus.OK,
            message:"Etat status de la synchronisation modifié avec success",
            data: await this.planificationService.updatePlanfication(updatePlanfication,planificationID)
        }
    }
    
    
    @Delete(':planificationID')
    async removePlanification(@Param("planificationID",ObjectIDValidationPipe) planificationID:string)
    {
        await this.planificationService.removePlanification(planificationID);
        return {
            statusCode:HttpStatus.OK,
            message:"Planification supprimer avec success",
        } 
    }
    
}