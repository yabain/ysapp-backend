import { Body, Controller, Post, UseGuards,Req, HttpStatus, Get, Param, ParseUUIDPipe } from "@nestjs/common";
import { Request } from "express";
import { AuthJwtGuard as AppAuthJwtGuard } from "src/application/guards"
import { CreateFinancialTransactionDTO } from "../dtos"
import { PaymentService } from "../services"

@Controller("payment")
export class PaymentController
{
    constructor(private paymentService:PaymentService){}

    @UseGuards(AppAuthJwtGuard)
    @Post("pay")    
    async makePayment(@Req() request:Request, @Body() createFinancialTransactionDTO:CreateFinancialTransactionDTO)
    {
        let data=await this.paymentService.makePayment(createFinancialTransactionDTO,request.user["userId"])
        return {
            statusCode:HttpStatus.CREATED,
            message:"Payment initiated with success",
            data
        }        
    }

    @UseGuards(AppAuthJwtGuard)
    @Get("check/:ref")    
    async checkPayment(@Req() request:Request, @Param("ref",new ParseUUIDPipe({version:"4"})) ref:string)
    {
        let data=await this.paymentService.checkPayment(ref)
        return {
            statusCode:HttpStatus.OK,
            message:"Payment details",
            data
        }        
    }
}