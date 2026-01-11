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
exports.RefundResponseDto = exports.RefundDto = exports.BankDetailsDto = exports.RefundMethod = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
var RefundMethod;
(function (RefundMethod) {
    RefundMethod["CASH"] = "CASH";
    RefundMethod["BANK_TRANSFER"] = "BANK_TRANSFER";
})(RefundMethod || (exports.RefundMethod = RefundMethod = {}));
class BankDetailsDto {
}
exports.BankDetailsDto = BankDetailsDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Bank name', example: 'Bank of Ceylon' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], BankDetailsDto.prototype, "bankName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Account number', example: '1234567890' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], BankDetailsDto.prototype, "accountNumber", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Branch name', example: 'Colombo Fort' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BankDetailsDto.prototype, "branchName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Account holder name', example: 'John Doe' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BankDetailsDto.prototype, "accountHolderName", void 0);
class RefundDto {
}
exports.RefundDto = RefundDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID of the payment to refund',
        example: 1,
    }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Payment ID is required' }),
    (0, class_validator_1.IsNumber)({}, { message: 'Payment ID must be a number' }),
    (0, class_validator_1.Min)(1, { message: 'Payment ID must be a positive number' }),
    __metadata("design:type", Number)
], RefundDto.prototype, "paymentId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Amount to refund. Must be positive and <= original payment amount',
        example: 500.0,
    }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Refund amount is required' }),
    (0, class_validator_1.IsNumber)({ maxDecimalPlaces: 2 }, { message: 'Refund amount must be a valid decimal number with at most 2 decimal places' }),
    (0, class_validator_1.Min)(0.01, { message: 'Refund amount must be greater than 0' }),
    __metadata("design:type", Number)
], RefundDto.prototype, "refundAmount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Reason for the refund',
        example: 'Duplicate payment by customer',
        maxLength: 500,
    }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Refund reason is required' }),
    (0, class_validator_1.IsString)({ message: 'Refund reason must be a string' }),
    (0, class_validator_1.MaxLength)(500, { message: 'Refund reason cannot exceed 500 characters' }),
    __metadata("design:type", String)
], RefundDto.prototype, "refundReason", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Method for processing the refund',
        enum: RefundMethod,
        example: RefundMethod.CASH,
    }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Refund method is required' }),
    (0, class_validator_1.IsEnum)(RefundMethod, {
        message: `Refund method must be one of: ${Object.values(RefundMethod).join(', ')}`,
    }),
    __metadata("design:type", String)
], RefundDto.prototype, "refundMethod", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Additional notes for the refund',
        example: 'Customer requested refund via phone',
        maxLength: 500,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(500),
    __metadata("design:type", String)
], RefundDto.prototype, "notes", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Bank details for bank transfer refunds',
        type: BankDetailsDto,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => BankDetailsDto),
    __metadata("design:type", BankDetailsDto)
], RefundDto.prototype, "bankDetails", void 0);
class RefundResponseDto {
}
exports.RefundResponseDto = RefundResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Refund ID',
        example: 1,
    }),
    __metadata("design:type", Number)
], RefundResponseDto.prototype, "refundId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Original payment ID',
        example: 123,
    }),
    __metadata("design:type", Number)
], RefundResponseDto.prototype, "paymentId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Refund amount',
        example: 500.0,
    }),
    __metadata("design:type", Number)
], RefundResponseDto.prototype, "refundAmount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Refund reason',
        example: 'Duplicate payment by customer',
    }),
    __metadata("design:type", String)
], RefundResponseDto.prototype, "refundReason", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Refund method',
        enum: RefundMethod,
        example: RefundMethod.CASH,
    }),
    __metadata("design:type", String)
], RefundResponseDto.prototype, "refundMethod", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Date and time of refund',
        example: '2026-01-03T15:30:00Z',
        type: Date,
    }),
    __metadata("design:type", Date)
], RefundResponseDto.prototype, "refundDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Employee who processed the refund',
        example: 'Sunil Fernando',
    }),
    __metadata("design:type", String)
], RefundResponseDto.prototype, "processedBy", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Refund reference number',
        example: 'REF-2026-00001',
    }),
    __metadata("design:type", String)
], RefundResponseDto.prototype, "refundReference", void 0);
//# sourceMappingURL=refund.dto.js.map