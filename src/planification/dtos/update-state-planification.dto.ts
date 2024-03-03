import { ArrayMinSize, IsArray, IsBoolean, IsDate, IsDefined, IsEnum, IsMongoId, IsNotEmptyObject, IsObject, IsOptional, IsString, ValidateNested } from "class-validator";
import { ObjectId } from "mongoose";
import { Transform, Type } from "class-transformer";
import { CreatePlanificationDTO } from "src/planification/dtos";


export class UpdateStatePlanificationDTO
{
    @IsMongoId()
    @IsString()
    planificationID: ObjectId; 
    
    @IsBoolean()
    status:Boolean;
}