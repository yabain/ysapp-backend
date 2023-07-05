import { ExecutionContext, Inject, Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import KeycloakConnect from 'keycloak-connect';
import { AuthGuard, KEYCLOAK_CONNECT_OPTIONS, KEYCLOAK_INSTANCE, KEYCLOAK_LOGGER, KeycloakConnectConfig, } from 'nest-keycloak-connect';
import { KeycloakMultiTenantService } from 'nest-keycloak-connect/services/keycloak-multitenant.service';
// import { extractRequest } from "nest-keycloak-connect"
import { UsersService } from '../services';
// import { KeycloakMultiTenantService } from 'nest-keycloak-connect/services/keycloak-multitenant.service';

@Injectable()
export class UserCreateMiddleWare implements NestMiddleware
{
  constructor(private userService:UsersService) {}

  async use(req: any, res: any, next: (error?: any) => void) {
    console.log('ReqUser ',req.user)
    if(req.user)
    {
        let user = await this.userService.findOneByField({email:req.user.email});
        console.log("user",user)
        if(!user) await this.userService.create({email:req.user.email})
    }
    next();
  }
      
}