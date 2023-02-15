"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateGroupDTO = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_group_dto_1 = require("./create-group.dto");
class UpdateGroupDTO extends (0, mapped_types_1.PartialType)(create_group_dto_1.CreateGroupDTO) {
}
exports.UpdateGroupDTO = UpdateGroupDTO;
//# sourceMappingURL=update-group.dto.js.map