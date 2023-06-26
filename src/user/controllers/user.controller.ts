import { Controller, Get, Req } from "@nestjs/common";
import { Request } from "express";
import { UsersService } from "../services";

@Controller("/user")
export class UserController
{
    constructor(private userService:UsersService){}
    @Get()
    async getUsersList(@Req() request:Request)
    {
        // console.log(request["user"])
        return {
            mgs:"Voici la liste",
            data:await this.userService.findAll()
        }
    }    
}