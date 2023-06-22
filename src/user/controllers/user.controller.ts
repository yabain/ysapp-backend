import { Controller, Get, Req } from "@nestjs/common";
import { Request } from "express";

@Controller("/user")
export class UserController
{
    constructor(){}
    @Get()
    getUsersList(@Req() request:Request)
    {
        // console.log(request["user"])
        return {
            mgg:"Voici la liste"
        }
    }    
}