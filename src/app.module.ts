import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ApplicationModule } from './application/application.module';
import { FinancialTransactionModule } from './financial-transaction/financial-transaction.module';
import configuration from './shared/config/configuration';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal:true
    }),
    MongooseModule.forRootAsync({
      imports:[ConfigModule],
      inject:[ConfigService],
      useFactory:async (configService:ConfigService)=>({
        uri:configService.get<string>("mongoURI")
      })
    }),
    ApplicationModule,
    UserModule,
    FinancialTransactionModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
