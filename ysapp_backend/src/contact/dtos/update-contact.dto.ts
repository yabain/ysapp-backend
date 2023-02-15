import { PartialType } from "@nestjs/mapped-types";
import { CreateContactDTO } from "./create-contact.dto";

export class UpdateUserDTO extends PartialType(CreateContactDTO){}