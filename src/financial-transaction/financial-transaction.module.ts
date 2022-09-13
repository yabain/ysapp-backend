import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { FinancialTransaction, FinancialTransactionSchema } from "./models";

@Module({
    imports:[MongooseModule.forFeature([{name:FinancialTransaction.name,schema:FinancialTransactionSchema}])],
    controllers:[],
    providers:[]
})
export class FinancialTransactionModule{}