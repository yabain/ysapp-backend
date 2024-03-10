import { Prop, Schema, SchemaFactory, raw } from "@nestjs/mongoose";
import mongoose, { Document,HydratedDocument } from "mongoose";
import { Message } from "src/message/models";
import { User } from "src/user/models";
import { CRON_JOB_RECCURENT_TYPE, CRON_JOB_TYPE } from "../enums";

export type PlanificationDocument = HydratedDocument<Planification>;

export type PlanificationType = {
  type:CRON_JOB_TYPE,
  time:string,
  startDate?:Date,
  endDate?:Date,
  every?:number,
  recurency?:CRON_JOB_RECCURENT_TYPE,
  dayOfWeek?:number,
  monthOfYear?:number,
  date?:Date,
  subJobId:string,
  dates?:Date[]
}

@Schema({
    toObject: {
        transform: function (doc, ret) {
          delete ret.__v;
        }
      },
      toJSON: {
        transform: function (doc, ret) {
          delete ret.__v;

        }
      }
})
export class Planification extends Document{
    @Prop({type:mongoose.Schema.Types.ObjectId,ref:User.name,default:null})
    owner:User;

    @Prop({type:mongoose.Schema.Types.ObjectId,ref:Message.name,default:null})
    message:Message;

    @Prop({default:""})
    title:string;
    
    @Prop({
      type:
      [{
        type:Object,
        default:{
          type:"",
          time:"",
          startDate:new Date(),
          endDate:new Date(),
          every:0,
          recurency:CRON_JOB_RECCURENT_TYPE.MONTH,
          dayOfWeek:0,
          monthOfYear:0,
          date:new Date(),
          subJobId:"",
          dates:[]
        }
      }]
    })
    planning:PlanificationType[]

  
    @Prop({default:true})
    isActive:Boolean;
    
    @Prop({default:Date.now(),required:true})
    createdAt:Date;
}
export const PlanificationSchema = SchemaFactory.createForClass(Planification)