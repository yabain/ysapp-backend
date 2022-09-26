import { HttpService } from "@nestjs/axios";
import { ConfigService } from "@nestjs/config";
import { map } from "rxjs";
import { PaymentMethodStrategy } from "src/financial-payment/interfaces";
import { FinancialTransactionState, FinancialTransactionErrorType } from "src/financial-transaction/enum";
import { FinancialTransaction } from "src/financial-transaction/models";
import { ERROR_CODE } from "src/shared/config/errors";
import { MtnResponseStatus } from "../mtn-money";

export class OrangeMoneyStrategyPayment implements PaymentMethodStrategy
{
    constructor(private configService:ConfigService,private readonly httpService:HttpService){}
        
    getToken():Promise<string>
    {
        return new Promise((resolve,reject)=>{
            this.httpService.request({
                url:`${this.configService.get<string>("OM_API_PATH")}/token/`,
                method:"post",
                headers:{
                    Authorization:`Basic ${Buffer.from(this.configService.get<string>("OM_API_CONSUMER_KEY")+":"+this.configService.get<string>("OM_API_CONSUMER_SECRET")).toString('base64')}`,
                    "grant_type": "client_credentials"
                }
            })
            .pipe(
                map(response => response.data)
            )
            .subscribe(
                (data)=> resolve(data.access_token),
                (error)=> reject(error)
            )
        })
    }


    buy(financialTransaction: FinancialTransaction): Promise<any> {
        // console.log("Financial ",financialTransaction)
        return new Promise((resolve,reject)=>{
            let token="";
            this.getToken()
            .then((result)=>{
                token = result;
                this.httpService.request({
                    url:`${this.configService.get<string>("OM_API_PATH")}/mp/pay`,
                    method:"post",
                    headers:{
                        Authorization: `Bearer ${token}`,
                        "X-AUTH-TOKEN": Buffer.from(this.configService.get<string>("OM_API_USERNAME")+":"+this.configService.get<string>("OM_API_PASSWORD")).toString('base64'),
                    },
                    data:{
                        "amount": `${financialTransaction.amount}`,
                        "orderId": financialTransaction.ref,
                        "subscriberMsisdn": financialTransaction.userRef.account,
                        "payToken":token,
                        "description": `Une transaction de ${financialTransaction.amount} ${financialTransaction.moneyCode} a été fait depuis votre compte`,
                    }
                })
                .subscribe(
                    (data)=>{
                        // console.log("data ",data)
                        resolve({ error:FinancialTransactionErrorType.NO_ERROR })
                    },
                    (error)=>{reject(error)}
                )
            
            })
            .catch((error)=>  reject(error))
        }) 
    }

    check(financialTransaction: FinancialTransaction) {
        throw new Error("Method not implemented.");
    }
    withdrawal(financialTransaction: FinancialTransaction) {
        throw new Error("Method not implemented.");
    }
    checkWithdrawal(financialTransaction: FinancialTransaction) {
        throw new Error("Method not implemented.");
    }
 
    cancel(financialTransaction: FinancialTransaction): Promise<any> {
        throw new Error("Method not implemented.");
    }
    
    


}