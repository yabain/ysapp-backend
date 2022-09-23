import { Prop, Schema,raw, SchemaFactory } from "@nestjs/mongoose";
import mongoose , { Document } from "mongoose";
import { v4 as uuidv4 } from 'uuid';
import { FinancialTransactionErrorType, FinancialTransactionState, FinancialTransactionType, PaymentMoneyCode, PaymentStrategyType } from "./../enum";
import { Application } from "../../application/models";
import { Wallet } from "../../wallet/models";

export type FinancialTransactionDocument =  FinancialTransaction & Document;


@Schema({
    toObject: {
        transform: function (doc, ret) {
          delete ret.token;
          delete ret.__v;
        }
      },
      toJSON: {
        transform: function (doc, ret) {
          delete ret.token;
          delete ret.__v;

        }
      }
})
export class FinancialTransaction
{
    @Prop({required:true,enum:FinancialTransactionState,default:FinancialTransactionState.FINANCIAL_TRANSACTION_START})
    state:FinancialTransactionState;

    @Prop({required:true,type:Date,default:Date.now})
    startDate:string;

    @Prop({required:true,type:Date,default:Date.now})
    endDate:String;

    @Prop({required:true,default:0})
    amount:number;

    @Prop({required:true,enum:FinancialTransactionType,default:FinancialTransactionType.DEPOSIT})
    type:FinancialTransactionType;
    
    @Prop({required:true,default:uuidv4()})
    ref:string;

    @Prop({required:true,enum:FinancialTransactionErrorType,default:FinancialTransactionErrorType.NO_ERROR})
    error:FinancialTransactionErrorType;

    @Prop({required:true,enum:PaymentStrategyType,default:PaymentStrategyType.BANK})
    paymentMode:PaymentStrategyType;

    @Prop({type:mongoose.Schema.Types.ObjectId,ref:Application.name, required:true})
    application:Application;

    @Prop({required:true,enum:PaymentMoneyCode,default:PaymentMoneyCode.XAF})
    moneyCode:string;

    @Prop(raw({
        fullName:{type:String},
        account:{type:Object}
    }))
    userRef:Record<string,any>;

    @Prop({type:mongoose.Schema.Types.ObjectId,ref:Wallet.name, required:true})
    wallet:Wallet;
}

export const FinancialTransactionSchema = SchemaFactory.createForClass(FinancialTransaction)
