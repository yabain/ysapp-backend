import { ArrayMinSize, IsArray, IsBoolean, IsDate, IsDefined, IsEnum, IsMongoId, IsNotEmptyObject, IsObject, IsOptional, IsString, ValidateNested } from "class-validator";
import { ObjectId } from "mongoose";
import { Transform, Type } from "class-transformer";
import { CreatePlanificationDTO } from "src/planification/dtos";
import { PartialType } from "@nestjs/mapped-types";


export class UpdatePlanificationDTO extends PartialType(CreatePlanificationDTO){
    [x: string]: any;
}