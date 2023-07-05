import { ExecutionContext, Inject, Injectable, Logger } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import KeycloakConnect from 'keycloak-connect';
import { AuthGuard, KEYCLOAK_CONNECT_OPTIONS, KEYCLOAK_INSTANCE, KEYCLOAK_LOGGER, KeycloakConnectConfig, } from 'nest-keycloak-connect';
// import { KeycloakMultiTenantService } from 'nest-keycloak-connect/services/keycloak-multitenant.service';
// import { extractRequest } from "nest-keycloak-connect"
import { UsersService } from '../services';
// import { KeycloakMultiTenantService } from 'nest-keycloak-connect/services/keycloak-multitenant.service';

@Injectable()
export class UserAuthGuard extends AuthGuard
{
    constructor(
        @Inject(KEYCLOAK_INSTANCE) singleTenant: KeycloakConnect.Keycloak,
        @Inject(KEYCLOAK_CONNECT_OPTIONS) keycloakOpts: KeycloakConnectConfig,
        @Inject(KEYCLOAK_LOGGER) logger: Logger,
        // multiTenant: KeycloakMultiTenantService,
        reflector: Reflector,
        private userService:UsersService
      ) {
        super(singleTenant, keycloakOpts,logger,null,reflector,
        )
      }
      
    async canActivate(context: ExecutionContext): Promise<boolean> {
        let result = await super.canActivate(context)

        const httpContext = context.switchToHttp();
        const request = httpContext.getRequest()
        if(result && request.user)
        {
            let user = await this.userService.findOneByField({email:request.user.email});
            // console.log("user",user)
            if(!user) await this.userService.create({email:request.user.email})
        }
        return result;
    }
}