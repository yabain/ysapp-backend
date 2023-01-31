import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { ContactModule } from './contact/contact.module';
import { GroupModule } from './group';
import configuration from './shared/config/configuration';
import { SharedModule } from './shared/shared.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    SharedModule,
    UserModule,
    ContactModule,
    GroupModule
  ],
  controllers: [
    AppController
  ],
  providers: [],
})
export class AppModule {}
