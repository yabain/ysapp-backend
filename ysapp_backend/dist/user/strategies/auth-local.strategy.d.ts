import { Strategy } from 'passport-local';
import { AuthService } from "../services";
declare const AuthLocalStrategy_base: new (...args: any[]) => Strategy;
export declare class AuthLocalStrategy extends AuthLocalStrategy_base {
    private authService;
    constructor(authService: AuthService);
    validate(username: string, password: string): Promise<any>;
}
export {};
