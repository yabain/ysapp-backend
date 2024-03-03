import { ArrayMinSize, IsArray, IsDate, IsDateString, IsEnum, IsIn, IsNumber, IsOptional, IsPositive, IsString, Max, Min } from "class-validator"
import { CRON_JOB_RECCURENT_TYPE, CRON_JOB_TYPE, ListOfDay, ListOfMonth } from "../enums"
import { Transform } from "class-transformer";

export class CreatePlanificationDTO
{
    @IsEnum(CRON_JOB_TYPE)
    type:CRON_JOB_TYPE;

    @IsString()
    time:string;

    @IsOptional()
    @Transform(({value})=> value && new Date(value))
    @IsDate()
    startDate:Date;

    @IsOptional()
    @Transform(({value})=> value && new Date(value))
    @IsDate()
    endDate:Date;

    @IsOptional()
    @IsPositive()
    @IsNumber()
    every:number;

    @IsOptional()
    @IsEnum(CRON_JOB_RECCURENT_TYPE)
    recurency:CRON_JOB_RECCURENT_TYPE;

    @IsOptional()
    // @IsIn(ListOfDay)
    @Min(0)
    @Max(6)
    dayOfWeek:number;

    @IsOptional()
    // @IsIn(ListOfMonth)
    @Min(0)
    @Max(11)
    monthOfYear:number;

    @IsOptional()
    @Transform(({value})=> value && new Date(value))
    @IsDate()
    date:Date;

    
    @IsOptional()
    @IsArray()
    @ArrayMinSize(1)
    @Transform(({value})=> value.map(date=>new Date(value)))
    @IsDateString({},{each:true})
    dates:Date[];
}