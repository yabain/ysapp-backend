import { Injectable } from "@nestjs/common";
import { UserDocument } from "src/user/models";
import { UsersService } from "src/user/services";
import { Client, LegacySessionAuth } from "whatsapp-web.js";

@Injectable()
export class QrCodeWhatsappService
{
    map:Map<string,any>=new Map()
    constructor(
        private userService:UsersService
    ){}

    
}
