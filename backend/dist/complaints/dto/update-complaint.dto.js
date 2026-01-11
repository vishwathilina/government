"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateComplaintDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_complaint_dto_1 = require("./create-complaint.dto");
class UpdateComplaintDto extends (0, swagger_1.PartialType)(create_complaint_dto_1.CreateComplaintDto) {
}
exports.UpdateComplaintDto = UpdateComplaintDto;
//# sourceMappingURL=update-complaint.dto.js.map