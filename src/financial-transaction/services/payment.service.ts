import { HttpException, Injectable } from "@nestjs/common";
import { FinancialPaymentService } from "src/financial-payment/services";
import { CreateFinancialTransactionDTO } from "../dtos";
import { FinancialTransactionService } from "./financial-transaction.service";
import mongoose from "mongoose"
import { InjectConnection } from "@nestjs/mongoose";

@Injectable()
export class PaymentService
{
    constructor(
        private paymentService:FinancialPaymentService,
        private financialTransactionService:FinancialTransactionService    ,
        @InjectConnection() private readonly connection:mongoose.Connection
    ){}

    async makePayment(createFinancialTransactionDTO:CreateFinancialTransactionDTO,appID)
    {
        const transaction= await this.connection.startSession();
        transaction.startTransaction();
        let financialTransaction=null;
        try {    
            financialTransaction=await this.financialTransactionService.create(createFinancialTransactionDTO,appID,transaction);
            financialTransaction= await this.financialTransactionService.update(
                {_id:financialTransaction._id},
                await this.paymentService.makePaiement(financialTransaction),
                transaction
            );
            await transaction.commitTransaction();
        } 
        catch(err)
        {
            await transaction.abortTransaction();
            // let error={}

            // if(err.response)
            // {
            //     error={data:err.response.data,status:err.response.status}
            // }
            // else if (err.request)
            // {
            //     error={data:err.request,status:500}
            // }
            // else
            // {
            //     error={data:err.message,status:500}
            // }

            // // console.log("Error ",err)
            // // throw new HttpException(error["data"], error["status"]);
            // console.log("err",err.response.data)
            throw err
        }
        finally
        {
            transaction.endSession();
        }     
        return  financialTransaction;
    }
}