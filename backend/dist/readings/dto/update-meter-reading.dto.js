"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateMeterReadingDto = exports.UpdateReadingSourceDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
var UpdateReadingSourceDto;
(function (UpdateReadingSourceDto) {
    UpdateReadingSourceDto["MANUAL"] = "MANUAL";
    UpdateReadingSourceDto["SMART_METER"] = "SMART_METER";
    UpdateReadingSourceDto["ESTIMATED"] = "ESTIMATED";
    UpdateReadingSourceDto["CORRECTED"] = "CORRECTED";
})(UpdateReadingSourceDto || (exports.UpdateReadingSourceDto = UpdateReadingSourceDto = {}));
class UpdateMeterReadingDto {
}
exports.UpdateMeterReadingDto = UpdateMeterReadingDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Updated import reading value',
        example: 12550.75,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)({}, { message: 'Import reading must be a number' }),
    (0, class_validator_1.Min)(0, { message: 'Import reading must be non-negative' }),
    __metadata("design:type", Number)
], UpdateMeterReadingDto.prototype, "importReading", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Updated export reading value',
        example: 525.0,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)({}, { message: 'Export reading must be a number' }),
    (0, class_validator_1.Min)(0, { message: 'Export reading must be non-negative' }),
    __metadata("design:type", Number)
], UpdateMeterReadingDto.prototype, "exportReading", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Updated reading source (use CORRECTED for corrections)',
        enum: UpdateReadingSourceDto,
        example: UpdateReadingSourceDto.CORRECTED,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(UpdateReadingSourceDto, {
        message: `Reading source must be one of: ${Object.values(UpdateReadingSourceDto).join(', ')}`,
    }),
    __metadata("design:type", String)
], UpdateMeterReadingDto.prototype, "readingSource", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Updated notes',
        example: 'Corrected after verification',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Notes must be a string' }),
    (0, class_validator_1.MaxLength)(500, { message: 'Notes must not exceed 500 characters' }),
    __metadata("design:type", String)
], UpdateMeterReadingDto.prototype, "notes", void 0);
//# sourceMappingURL=update-meter-reading.dto.js.map