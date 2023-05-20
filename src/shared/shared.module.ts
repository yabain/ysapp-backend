import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import configuration from "./config/configuration";
import { SecurityModule } from "./security/security.module";
import { AuthGuard, KeycloakConnectModule, ResourceGuard, RoleGuard } from "nest-keycloak-connect";
import { APP_GUARD } from "@nestjs/core";

@Module({
    imports:[
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
        SecurityModule,
        KeycloakConnectModule.registerAsync({
          imports:[ConfigModule],
          inject:[ConfigModule],
          useFactory: async (configService:ConfigService)=>({
              authServerUrl: configService.get("KEYCLOAK_SERVER_URI"), // might be http://localhost:8080/auth for older keycloak versions
              realm: configService.get("KEYCLOAK_SERVER_REALM"),
              clientId: configService.get("KEYCLOAK_SERVER_CLIENT_ID"),
              secret: configService.get("KEYCLOAK_SERVER_SECRET"),   
            })
        })
    ],    
    providers: [
      {
        provide: APP_GUARD,     
        useClass: AuthGuard,
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
    exports:[
      SecurityModule,
      ConfigModule,
      MongooseModule,
      KeycloakConnectModule
  ],
})
export class SharedModule{}