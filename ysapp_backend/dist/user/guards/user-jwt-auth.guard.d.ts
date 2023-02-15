import { ExecutionContext } from '@nestjs/common';
declare const UserJwtAuthGuard_base: import("@nestjs/passport").Type<import("@nestjs/passport").IAuthGuard>;
export declare class UserJwtAuthGuard extends UserJwtAuthGuard_base {
    handleRequest<TUser = any>(err: any, user: any, info: any, context: ExecutionContext, status?: any): TUser;
}
export {};
