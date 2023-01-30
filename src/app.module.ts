import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import configuration from './shared/config/configuration';
import { SharedModule } from './shared/shared.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    SharedModule,
    UserModule
  ],
  controllers: [
    AppController
  ],
  providers: [],
})
export class AppModule {}
