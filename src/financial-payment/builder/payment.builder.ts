import { Injectable } from "@nestjs/common"
import { PaymentStrategyType } from "src/financial-transaction/enum";
import { PaymentMethodStrategy } from "../interfaces";
import { MtnMoneyStrategyPayment } from "../strategies/mtn-money";

@Injectable()
export class PaymentBuilder
{
    constructor(
        private mtnMoneyStrategyPayment:MtnMoneyStrategyPayment
    ){}
    getMethodPayment(method:PaymentStrategyType):PaymentMethodStrategy
    {
        let paiementMethodStrategi:PaymentMethodStrategy;
        switch(method)
        {
            // case PaiementStrategyType.BANK:
            //     throw new PaymentException(PaymentException.UNSUPPORTED_BANK_PAYMENT_METHOD, "Bank payment method not supported")
            case PaymentStrategyType.MTN_MONEY:
                paiementMethodStrategi=this.mtnMoneyStrategyPayment;
                break
            // case PaiementStrategyType.ORANGE_MONEY:
            //     paiementMethodStrategi=new OrangeMoneyStrategyPayement();
            //     break
            
        }
        return paiementMethodStrategi
    }
}