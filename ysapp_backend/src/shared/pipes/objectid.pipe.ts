import { ArgumentMetadata, BadRequestException, HttpStatus, Injectable, PipeTransform } from "@nestjs/common"
var ObjectId = require('mongoose').Types.ObjectId;

@Injectable()
export class ObjectIDValidationPipe implements PipeTransform
{
    transform(value: any, metadata: ArgumentMetadata) {
        if(ObjectId.isValid(value)) return value;
        throw new BadRequestException({
            statusCode:HttpStatus.BAD_REQUEST,
            messagge:"Invalid ID"
        });
        
    }

}