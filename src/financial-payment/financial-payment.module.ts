import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { PaymentBuilder } from "./builder/payment.builder";
import { FinancialPaymentService } from "./services";
import { MtnMoneyStrategyPayment } from "./strategies/mtn-money";

@Module({
    imports:[
        HttpModule
    ],
    providers:[
        FinancialPaymentService,
        MtnMoneyStrategyPayment,
        PaymentBuilder,
    ],
    exports:[ FinancialPaymentService ]
})
export class FinancialPaymentModule{}