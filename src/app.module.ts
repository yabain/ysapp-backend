import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { ContactModule } from './contact/contact.module';
import { GroupModule } from './group';
import configuration from './shared/config/configuration';
import { SharedModule } from './shared/shared.module';
import { UserModule } from './user/user.module';
import { APP_GUARD } from '@nestjs/core';
import { ResourceGuard, RoleGuard } from 'nest-keycloak-connect';
import { UserAuthGuard } from './user/guards';
import { MessageModule } from './message/message.module';
import { MessageTemplateModule } from './message-template/message-template.module';
import { PlanificationModule } from './planification/planification.module';

@Module({
  imports: [
    SharedModule,
    UserModule,
    ContactModule,
    MessageModule,
    GroupModule,
    MessageTemplateModule,
    PlanificationModule
  ],
  controllers: [
    AppController
  ],
  providers: [
    {
      provide: APP_GUARD,     
      useClass: UserAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: ResourceGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RoleGuard,
    },
  ],
})
export class AppModule {}
