import { PartialType } from "@nestjs/mapped-types";
import { CreateMessageTemplateDTO } from "./create-template-message.dto";

export class UpdateMessageTemplateDTO extends PartialType(CreateMessageTemplateDTO){}