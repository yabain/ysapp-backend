import { Controller, Post, UseGuards, Body, HttpStatus, Req,Get, UnprocessableEntityException, UploadedFiles, UseInterceptors, Put, Delete, Param } from "@nestjs/common";
import { Request } from "express";
import { UsersService } from "src/user/services";
import { FilesInterceptor } from "@nestjs/platform-express";
import * as path from "path";
import { PlanificationService } from "../services";
import { UpdateStatePlanificationDTO } from "../dtos";
import { ObjectIDValidationPipe } from "src/shared/pipes";

@Controller("planification")
export class PlanificationController
{
    constructor(
        private planificationService:PlanificationService,
        private usersService:UsersService
        ){}

     
    @Post("state")
    async updatePlanificationState(request:Request, @Body() updatePlanficationState:UpdateStatePlanificationDTO)
    {
        await this.planificationService.updatePlanfication(updatePlanficationState);
        return {
            statusCode:HttpStatus.OK,
            message:"Etat status de la synchronisation modifié avec success",
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