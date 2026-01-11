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
exports.PaymentResponseDto = exports.PaymentBillDetailsDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const payment_entity_1 = require("../../database/entities/payment.entity");
class PaymentBillDetailsDto {
}
exports.PaymentBillDetailsDto = PaymentBillDetailsDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Billing period description',
        example: '2025-12-01 to 2025-12-31',
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], PaymentBillDetailsDto.prototype, "period", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Type of utility',
        example: 'Electricity',
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], PaymentBillDetailsDto.prototype, "utilityType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Meter serial number',
        example: 'ELEC-001-2024',
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], PaymentBillDetailsDto.prototype, "meterSerialNo", void 0);
class PaymentResponseDto {
}
exports.PaymentResponseDto = PaymentResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Payment ID',
        example: 1,
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Number)
], PaymentResponseDto.prototype, "paymentId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Bill ID',
        example: 1,
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Number)
], PaymentResponseDto.prototype, "billId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Customer ID (snapshot)',
        example: 1,
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Object)
], PaymentResponseDto.prototype, "customerId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Employee ID who recorded the payment',
        example: 5,
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Object)
], PaymentResponseDto.prototype, "employeeId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Date and time of payment',
        example: '2026-01-03T10:30:00Z',
        type: Date,
    }),
    (0, class_transformer_1.Expose)(),
    (0, class_transformer_1.Type)(() => Date),
    __metadata("design:type", Date)
], PaymentResponseDto.prototype, "paymentDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Payment amount',
        example: 1500.0,
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Number)
], PaymentResponseDto.prototype, "paymentAmount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Payment method used',
        enum: payment_entity_1.PaymentMethod,
        example: payment_entity_1.PaymentMethod.CASH,
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], PaymentResponseDto.prototype, "paymentMethod", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Payment channel',
        enum: payment_entity_1.PaymentChannel,
        example: payment_entity_1.PaymentChannel.OFFICE,
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Object)
], PaymentResponseDto.prototype, "paymentChannel", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'External transaction reference',
        example: 'TXN-20260103-123456',
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Object)
], PaymentResponseDto.prototype, "transactionRef", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Notes about the payment',
        example: 'Customer reference: Monthly bill payment',
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Object)
], PaymentResponseDto.prototype, "notes", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Bill number/reference',
        example: 'BILL-2025-00001',
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], PaymentResponseDto.prototype, "billNumber", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Customer full name',
        example: 'Amal Kumara Perera',
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], PaymentResponseDto.prototype, "customerName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Customer email address',
        example: 'amal.perera@gmail.com',
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Object)
], PaymentResponseDto.prototype, "customerEmail", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Total bill amount',
        example: 2500.0,
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Number)
], PaymentResponseDto.prototype, "billAmount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Outstanding amount before this payment',
        example: 2500.0,
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Number)
], PaymentResponseDto.prototype, "billOutstanding", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'New outstanding amount after this payment',
        example: 1000.0,
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Number)
], PaymentResponseDto.prototype, "newOutstanding", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Generated receipt number',
        example: 'RCP-2026-00001',
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], PaymentResponseDto.prototype, "receiptNumber", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Name of employee who recorded the payment',
        example: 'Sunil Fernando',
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Object)
], PaymentResponseDto.prototype, "recordedByName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Bill details',
        type: PaymentBillDetailsDto,
    }),
    (0, class_transformer_1.Expose)(),
    (0, class_transformer_1.Type)(() => PaymentBillDetailsDto),
    __metadata("design:type", PaymentBillDetailsDto)
], PaymentResponseDto.prototype, "billDetails", void 0);
//# sourceMappingURL=payment-response.dto.js.map