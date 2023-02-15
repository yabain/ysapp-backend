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
import { AddContactToGroupDTO, CreateGroupDTO } from "../dtos";
import { Request } from "express";
import { GroupService } from "../services/group.service";
export declare class GroupController {
    private groupsService;
    constructor(groupsService: GroupService);
    addGroup(request: Request, createGroupDTO: CreateGroupDTO): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: import("../models").Group & {
            _id: import("mongoose").Types.ObjectId;
        };
    }>;
    addContactToGroup(request: Request, addContactToGroupDTO: AddContactToGroupDTO): Promise<{
        statusCode: HttpStatus;
        message: string;
    }>;
    getGroupById(request: Request, id: string): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: import("../models").Group & {
            _id: import("mongoose").Types.ObjectId;
        };
    }>;
    updateGroupById(request: Request, id: string): Promise<void>;
}
