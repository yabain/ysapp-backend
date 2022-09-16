import {MaxLength,Min,IsEnum,IsNumberString,IsMongoId, MinLength,IsString,IsOptional,IsUrl,IsNotEmpty, IsJSON } from "class-validator";
import { FinancialTransactionState, FinancialTransactionType, PaymentMoneyCode, PaymentStrategyType } from "../enum";



export class CreateFinancialTransactionDTO
{

    @Min(1)
    @IsNumberString()
    amount:number;

    @IsNotEmpty()
    @IsEnum(FinancialTransactionType)
    type:FinancialTransactionType;
    
   
    @IsNotEmpty()
    @IsEnum(PaymentStrategyType)
    paiementMode:PaymentStrategyType;

    @IsOptional()
    @IsEnum(FinancialTransactionState)
    state:FinancialTransactionState;

    @IsMongoId()
    application:string;

    @IsEnum(PaymentMoneyCode)
    moneyCode:string;

    @IsJSON()
    userRef:{
        fullName:String,
        account: String
    };


}