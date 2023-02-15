import { ArgumentMetadata, PipeTransform } from "@nestjs/common";
export declare class ObjectIDValidationPipe implements PipeTransform {
    transform(value: any, metadata: ArgumentMetadata): any;
}
