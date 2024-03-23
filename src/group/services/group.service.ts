import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { DataBaseService } from 'src/shared/services/database';
import { UsersService } from 'src/user/services';
import { CreateGroupDTO, UpdateGroupDTO } from '../dtos';
import { Group, GroupDocument } from '../models';
import { ContactsService } from 'src/contact/services';

@Injectable()
export class GroupService extends DataBaseService<GroupDocument> {
  
  constructor(
    @InjectModel(Group.name) private groupModel: Model<GroupDocument>,
    @InjectConnection() connection: mongoose.Connection,
    private usersService: UsersService,
    private contactService:ContactsService
  ) {
    super(groupModel, connection);
  }
  
  async createNewGroup(
    createContactDTO: CreateGroupDTO,
    userEmail: string,
  ): Promise<GroupDocument> {
    const user = await this.usersService.findOneByField({ email: userEmail });
    
    let listOfContact=[]
    if(createContactDTO.contacts && createContactDTO.contacts.length>0)
    {
      listOfContact = await Promise.all(createContactDTO.contacts.map((contactID)=>this.contactService.findOneByField({_id:contactID})))
    }
    
    return this.executeWithTransaction(async (session)=>{

      const group = await this.create(createContactDTO,session);
        user.groups.push(group);
      
      await Promise.all(listOfContact.map((contact)=>{
        contact.groups=[...contact.groups,group];
        return contact.save({session})
      }))
      await user.save({session});
      group.contacts=[...listOfContact.map((contact)=>contact._id)];
      return group.save({session});
    })
  }

  async updateGroup(id: string, updateGroupDTO: UpdateGroupDTO) {
    let group= await this.findOneByField({"_id":id})
    if(!group) throw new NotFoundException({
        statusCode: 404,
        error:"ContactGroup/NotFound",
        message:["Contact group not found"]
    })
    let listOfContact=[]
    if(updateGroupDTO.contacts && updateGroupDTO.contacts.length>0)
    {
      listOfContact = await Promise.all(updateGroupDTO.contacts.map((contactID)=>this.contactService.findOneByField({_id:contactID})))
    }

    return this.executeWithTransaction(async (session)=>{
      let listOfOldContact = (await group.populate("contacts")).contacts;

      let listOfOldContactGroupToRemoved = listOfOldContact.filter((oContact)=>!listOfContact.some((nContact)=>nContact._id==oContact._id)),
      listOfNewContactGroupToAdd = listOfContact.filter((nContact)=>!listOfOldContact.some((oContact)=>nContact._id==oContact._id));

      group =await this.update({"_id":id},{...updateGroupDTO,contats:listOfContact.map((value)=>value._id)},session)

      await Promise.all(listOfOldContactGroupToRemoved.map((contact)=>{
        let groupPos = contact.groups.findIndex((fgroup)=>fgroup._id!=group.id)
        if(groupPos>-1) contact.groups.splice(groupPos,1);
        return contact.save({session})
      }))


      await Promise.all(listOfNewContactGroupToAdd.map((contact)=>{
        contact.groups.push(group);
        return contact.save({session})
      }))

      return group
    })


  }

  async addContactToGroup(userEmail: string, contactId: string, groupId: string) {
    let user = await this.usersService.findOneByField({ email: userEmail });
    let contact = user.contacts.find((c) => c.id == contactId);
    let group = user.groups.find((g) => g.id == groupId);
    contact.groups.push(group);
    group.contacts.push(contact);

    return this.executeWithTransaction(async (session)=>{
      await contact.save({session});
      return group.save({session});
    })
  }

    
}
