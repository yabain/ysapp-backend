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
    jobName:string;
    
    @Prop(raw([
        {
            type:String,
            time:{default:"",type:String},
            startDate:{type:Date,default:new Date()},
            endDate:{type:Date,default:new Date()},
            every:{type:Number,default:0},
            recurency:{default:CRON_JOB_RECCURENT_TYPE.MONTH,enum:CRON_JOB_RECCURENT_TYPE},
            dayOfWeek:{type:Number,default:0},
            monthOfYear:{type:Number,default:0},
            date:{type:Date,default:new Date()},
            dates:{type:Array,default:[]},
        }
    ]))
    planning:PlanificationType[]

    @Prop({default:true})
    isActive:Boolean;

}
export const PlanificationSchema = SchemaFactory.createForClass(Planification)
