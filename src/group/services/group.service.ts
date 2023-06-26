import { Injectable } from '@nestjs/common';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { DataBaseService } from 'src/shared/services/database';
import { UsersService } from 'src/user/services';
import { CreateGroupDTO } from '../dtos';
import { Group, GroupDocument } from '../models';

@Injectable()
export class GroupService extends DataBaseService<GroupDocument> {
  constructor(
    @InjectModel(Group.name) private groupModel: Model<GroupDocument>,
    @InjectConnection() connection: mongoose.Connection,
    private usersService: UsersService
  ) {
    super(groupModel, connection);
  }
  
  async createNewGroup(
    createContactDTO: CreateGroupDTO,
    userEmail: string,
  ): Promise<GroupDocument> {
    const user = await this.usersService.findOneByField({ email: userEmail });
    const group = new this.groupModel(createContactDTO);
    user.groups.push(group);
    await user.save();
    return group.save();
  }

  async addContactToGroup(userEmail: string, contactId: string, groupId: string) {
    let user = await this.usersService.findOneByField({ email: userEmail });
    let contact = user.contacts.find((c) => c.id == contactId);
    let group = user.groups.find((g) => g.id == groupId);
    contact.groups.push(group);
    group.contacts.push(contact);

    console.log("Contact ",contact)
    await contact.save();
    await group.save();
    return true;
  }

    
}
