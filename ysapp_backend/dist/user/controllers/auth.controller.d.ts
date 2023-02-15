/// <reference types="passport" />
/// <reference types="mongoose/types/aggregate" />
/// <reference types="mongoose/types/callback" />
/// <reference types="mongoose/types/collection" />
/// <reference types="mongoose/types/connection" />
/// <reference types="mongoose/types/cursor" />
/// <reference types="mongoose/types/document" />
/// <reference types="mongoose/types/error" />
/// <reference types="mongoose/types/expressions" />
/// <reference types="mongoose/types/helpers" />
/// <reference types="mongoose/types/middlewares" />
/// <reference types="mongoose/types/indexes" />
/// <reference types="mongoose/types/models" />
/// <reference types="mongoose/types/mongooseoptions" />
/// <reference types="mongoose/types/pipelinestage" />
/// <reference types="mongoose/types/populate" />
/// <reference types="mongoose/types/query" />
/// <reference types="mongoose/types/schemaoptions" />
/// <reference types="mongoose/types/schematypes" />
/// <reference types="mongoose/types/session" />
/// <reference types="mongoose/types/types" />
/// <reference types="mongoose/types/utility" />
/// <reference types="mongoose/types/validation" />
/// <reference types="mongoose/types/virtuals" />
/// <reference types="mongoose" />
/// <reference types="mongoose/types/inferschematype" />
import { HttpStatus } from "@nestjs/common";
import { Request } from "express";
import { CreateUserDTO } from "../dtos";
import { AuthService, UsersService } from "../services";
export declare class AuthController {
    private readonly usersService;
    private authService;
    constructor(usersService: UsersService, authService: AuthService);
    register(createUserDTO: CreateUserDTO): Promise<{
        statusCode: number;
        message: string;
        data: import("mongoose").Document<unknown, any, import("../models").User> & import("../models").User & {
            _id: import("mongoose").Types.ObjectId;
        };
    }>;
    login(request: Request): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: {
            user: Express.User;
            access_token: string;
        };
    }>;
    refreshToken(): Promise<void>;
    logout(): Promise<void>;
}
