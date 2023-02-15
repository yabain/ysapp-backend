"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateUserDTO = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_contact_dto_1 = require("./create-contact.dto");
class UpdateUserDTO extends (0, mapped_types_1.PartialType)(create_contact_dto_1.CreateContactDTO) {
}
exports.UpdateUserDTO = UpdateUserDTO;
//# sourceMappingURL=update-contact.dto.js.map