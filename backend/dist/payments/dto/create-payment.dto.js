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
exports.CreatePaymentDto = exports.IsNotFutureDateConstraint = exports.TransactionRefRequiredForMethodConstraint = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const swagger_1 = require("@nestjs/swagger");
const payment_entity_1 = require("../../database/entities/payment.entity");
let TransactionRefRequiredForMethodConstraint = class TransactionRefRequiredForMethodConstraint {
    validate(_value, args) {
        const dto = args.object;
        const requiresRef = payment_entity_1.PAYMENT_METHODS_REQUIRING_REF.includes(dto.paymentMethod);
        if (requiresRef) {
            return dto.transactionRef !== undefined && dto.transactionRef.trim().length > 0;
        }
        return true;
    }
    defaultMessage(args) {
        const dto = args.object;
        return `Transaction reference is required for ${dto.paymentMethod} payments`;
    }
};
exports.TransactionRefRequiredForMethodConstraint = TransactionRefRequiredForMethodConstraint;
exports.TransactionRefRequiredForMethodConstraint = TransactionRefRequiredForMethodConstraint = __decorate([
    (0, class_validator_1.ValidatorConstraint)({ name: 'transactionRefRequiredForMethod', async: false })
], TransactionRefRequiredForMethodConstraint);
let IsNotFutureDateConstraint = class IsNotFutureDateConstraint {
    validate(value) {
        if (!value) {
            return true;
        }
        const paymentDate = new Date(value);
        const now = new Date();
        return paymentDate <= now;
    }
    defaultMessage() {
        return 'Payment date cannot be in the future';
    }
};
exports.IsNotFutureDateConstraint = IsNotFutureDateConstraint;
exports.IsNotFutureDateConstraint = IsNotFutureDateConstraint = __decorate([
    (0, class_validator_1.ValidatorConstraint)({ name: 'isNotFutureDate', async: false })
], IsNotFutureDateConstraint);
class CreatePaymentDto {
}
exports.CreatePaymentDto = CreatePaymentDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID of the bill this payment is for',
        example: 1,
    }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Bill ID is required' }),
    (0, class_validator_1.IsNumber)({}, { message: 'Bill ID must be a number' }),
    (0, class_validator_1.Min)(1, { message: 'Bill ID must be a positive number' }),
    __metadata("design:type", Number)
], CreatePaymentDto.prototype, "billId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Payment amount in the local currency',
        example: 1500.0,
        minimum: 0.01,
    }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Payment amount is required' }),
    (0, class_validator_1.IsNumber)({ maxDecimalPlaces: 2 }, { message: 'Payment amount must be a valid decimal number with at most 2 decimal places' }),
    (0, class_validator_1.Min)(0.01, { message: 'Payment amount must be greater than 0' }),
    __metadata("design:type", Number)
], CreatePaymentDto.prototype, "paymentAmount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Method of payment',
        enum: payment_entity_1.PaymentMethod,
        example: payment_entity_1.PaymentMethod.CASH,
    }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Payment method is required' }),
    (0, class_validator_1.IsEnum)(payment_entity_1.PaymentMethod, {
        message: `Payment method must be one of: ${Object.values(payment_entity_1.PaymentMethod).join(', ')}`,
    }),
    __metadata("design:type", String)
], CreatePaymentDto.prototype, "paymentMethod", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Channel through which payment was received',
        enum: payment_entity_1.PaymentChannel,
        example: payment_entity_1.PaymentChannel.OFFICE,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(payment_entity_1.PaymentChannel, {
        message: `Payment channel must be one of: ${Object.values(payment_entity_1.PaymentChannel).join(', ')}`,
    }),
    __metadata("design:type", String)
], CreatePaymentDto.prototype, "paymentChannel", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'External transaction reference. Required for ONLINE, BANK_TRANSFER, MOBILE_MONEY payments',
        example: 'TXN-20260103-123456',
        maxLength: 120,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Transaction reference must be a string' }),
    (0, class_validator_1.MaxLength)(120, { message: 'Transaction reference cannot exceed 120 characters' }),
    (0, class_validator_1.Validate)(TransactionRefRequiredForMethodConstraint),
    __metadata("design:type", String)
], CreatePaymentDto.prototype, "transactionRef", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Date and time of payment. Defaults to current time if not provided',
        example: '2026-01-03T10:30:00Z',
        type: Date,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Date),
    (0, class_validator_1.IsDate)({ message: 'Payment date must be a valid date' }),
    (0, class_validator_1.Validate)(IsNotFutureDateConstraint),
    __metadata("design:type", Date)
], CreatePaymentDto.prototype, "paymentDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Additional notes about the payment',
        example: 'Customer reference: Monthly bill payment',
        maxLength: 500,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Notes must be a string' }),
    (0, class_validator_1.MaxLength)(500, { message: 'Notes cannot exceed 500 characters' }),
    __metadata("design:type", String)
], CreatePaymentDto.prototype, "notes", void 0);
//# sourceMappingURL=create-payment.dto.js.map