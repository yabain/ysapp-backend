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
import { CreateContactDTO } from "../dtos";
import { ContactsService } from "../services";
export declare class ContactController {
    private contactsService;
    constructor(contactsService: ContactsService);
    addContact(request: Request, createContactDTO: CreateContactDTO): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: import("../models").Contact & {
            _id: import("mongoose").Types.ObjectId;
        };
    }>;
    getContactById(request: Request, id: string): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: import("../models").Contact & {
            _id: import("mongoose").Types.ObjectId;
        };
    }>;
    updateContactById(request: Request, id: string): Promise<void>;
}
