import mongoose, { Model } from "mongoose";
import { DataBaseService } from "src/shared/services/database";
import { UsersService } from "src/user/services";
import { CreateGroupDTO } from "../dtos";
import { GroupDocument } from "../models";
export declare class GroupService extends DataBaseService<GroupDocument> {
    private groupModel;
    private usersService;
    constructor(groupModel: Model<GroupDocument>, connection: mongoose.Connection, usersService: UsersService);
    createNewGroup(createContactDTO: CreateGroupDTO, userId: string): Promise<GroupDocument>;
    addContactToGroup(userId: string, contactId: string, groupId: string): Promise<boolean>;
}
