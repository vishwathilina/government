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
exports.CreateMeterReadingDto = exports.IsNotFutureConstraint = exports.ReadingSourceDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const swagger_1 = require("@nestjs/swagger");
var ReadingSourceDto;
(function (ReadingSourceDto) {
    ReadingSourceDto["MANUAL"] = "MANUAL";
    ReadingSourceDto["SMART_METER"] = "SMART_METER";
    ReadingSourceDto["ESTIMATED"] = "ESTIMATED";
})(ReadingSourceDto || (exports.ReadingSourceDto = ReadingSourceDto = {}));
let IsNotFutureConstraint = class IsNotFutureConstraint {
    validate(date) {
        if (!date)
            return true;
        return new Date(date) <= new Date();
    }
    defaultMessage(args) {
        return `${args.property} cannot be in the future`;
    }
};
exports.IsNotFutureConstraint = IsNotFutureConstraint;
exports.IsNotFutureConstraint = IsNotFutureConstraint = __decorate([
    (0, class_validator_1.ValidatorConstraint)({ name: 'isNotFuture', async: false })
], IsNotFutureConstraint);
class CreateMeterReadingDto {
}
exports.CreateMeterReadingDto = CreateMeterReadingDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Meter ID',
        example: 1,
    }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Meter ID is required' }),
    (0, class_validator_1.IsNumber)({}, { message: 'Meter ID must be a number' }),
    __metadata("design:type", Number)
], CreateMeterReadingDto.prototype, "meterId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Reading date and time',
        example: '2025-12-31T10:30:00Z',
    }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Reading date is required' }),
    (0, class_transformer_1.Type)(() => Date),
    (0, class_validator_1.Validate)(IsNotFutureConstraint, { message: 'Reading date cannot be in the future' }),
    __metadata("design:type", Date)
], CreateMeterReadingDto.prototype, "readingDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Source of the reading',
        enum: ReadingSourceDto,
        example: ReadingSourceDto.MANUAL,
    }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Reading source is required' }),
    (0, class_validator_1.IsEnum)(ReadingSourceDto, {
        message: `Reading source must be one of: ${Object.values(ReadingSourceDto).join(', ')}`,
    }),
    __metadata("design:type", String)
], CreateMeterReadingDto.prototype, "readingSource", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Import reading (consumption from grid)',
        example: 12500.5,
    }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Import reading is required' }),
    (0, class_validator_1.IsNumber)({}, { message: 'Import reading must be a number' }),
    (0, class_validator_1.Min)(0, { message: 'Import reading must be non-negative' }),
    __metadata("design:type", Number)
], CreateMeterReadingDto.prototype, "importReading", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Export reading (for solar/net metering)',
        example: 500.25,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)({}, { message: 'Export reading must be a number' }),
    (0, class_validator_1.Min)(0, { message: 'Export reading must be non-negative' }),
    __metadata("design:type", Number)
], CreateMeterReadingDto.prototype, "exportReading", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Mobile device ID used for reading',
        example: 'DEV-001',
        maxLength: 80,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Device ID must be a string' }),
    (0, class_validator_1.MaxLength)(80, { message: 'Device ID must not exceed 80 characters' }),
    __metadata("design:type", String)
], CreateMeterReadingDto.prototype, "deviceId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Additional notes about the reading',
        example: 'Customer reported meter access issue',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Notes must be a string' }),
    (0, class_validator_1.MaxLength)(500, { message: 'Notes must not exceed 500 characters' }),
    __metadata("design:type", String)
], CreateMeterReadingDto.prototype, "notes", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Whether to auto-generate a bill after creating this reading. Default is true.',
        example: true,
        default: true,
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreateMeterReadingDto.prototype, "autoGenerateBill", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Minimum days between bills for auto-generation. Default is 25 days.',
        example: 25,
        default: 25,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)({}, { message: 'minDaysBetweenBills must be a number' }),
    (0, class_validator_1.Min)(1, { message: 'minDaysBetweenBills must be at least 1' }),
    __metadata("design:type", Number)
], CreateMeterReadingDto.prototype, "minDaysBetweenBills", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Number of days from bill date until due date. Default is 15 days.',
        example: 15,
        default: 15,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)({}, { message: 'dueDaysFromBillDate must be a number' }),
    (0, class_validator_1.Min)(1, { message: 'dueDaysFromBillDate must be at least 1' }),
    __metadata("design:type", Number)
], CreateMeterReadingDto.prototype, "dueDaysFromBillDate", void 0);
//# sourceMappingURL=create-meter-reading.dto.js.map