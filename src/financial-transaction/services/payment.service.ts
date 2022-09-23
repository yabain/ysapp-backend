import { HttpException, HttpStatus, Injectable, NotFoundException } from "@nestjs/common";
import { FinancialPaymentService } from "src/financial-payment/services";
import { CreateFinancialTransactionDTO } from "../dtos";
import { FinancialTransactionService } from "./financial-transaction.service";
import mongoose from "mongoose"
import { InjectConnection } from "@nestjs/mongoose";
import { FinancialTransactionState } from "../enum";

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
            throw err
        }
        finally
        {
            transaction.endSession();
        }     
        return  financialTransaction;
    }

    async checkPayment(financialTransactionRef)
    {
        let financialTransaction=await this.financialTransactionService.findOneByField({ref:financialTransactionRef})
        if(!financialTransaction) throw new NotFoundException({
            status:HttpStatus.NOT_FOUND,
            message:`Transaction id ${financialTransactionRef} not found`
        });
        if(financialTransaction.state==FinancialTransactionState.FINANCIAL_TRANSACTION_ERROR || financialTransaction.state==FinancialTransactionState.FINANCIAL_TRANSACTION_SUCCESS)
            return financialTransaction;
            
        financialTransaction= await this.financialTransactionService.update(
            {_id:financialTransaction._id},
            await this.paymentService.checkPaiement(financialTransaction),
        );
        return financialTransaction;
    }
}