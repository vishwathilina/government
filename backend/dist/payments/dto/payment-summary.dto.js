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
exports.PaymentSummaryDto = exports.PaymentPeriodDto = exports.PaymentBreakdownDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
class PaymentBreakdownDto {
}
exports.PaymentBreakdownDto = PaymentBreakdownDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Category name (payment method or channel)',
        example: 'CASH',
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], PaymentBreakdownDto.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Number of payments in this category',
        example: 25,
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Number)
], PaymentBreakdownDto.prototype, "count", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Total amount in this category',
        example: 50000.0,
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Number)
], PaymentBreakdownDto.prototype, "amount", void 0);
class PaymentPeriodDto {
}
exports.PaymentPeriodDto = PaymentPeriodDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Period start date',
        example: '2026-01-01',
        type: Date,
    }),
    (0, class_transformer_1.Expose)(),
    (0, class_transformer_1.Type)(() => Date),
    __metadata("design:type", Date)
], PaymentPeriodDto.prototype, "start", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Period end date',
        example: '2026-01-31',
        type: Date,
    }),
    (0, class_transformer_1.Expose)(),
    (0, class_transformer_1.Type)(() => Date),
    __metadata("design:type", Date)
], PaymentPeriodDto.prototype, "end", void 0);
class PaymentSummaryDto {
}
exports.PaymentSummaryDto = PaymentSummaryDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Total number of payments',
        example: 50,
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Number)
], PaymentSummaryDto.prototype, "totalPayments", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Total amount collected',
        example: 125000.0,
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Number)
], PaymentSummaryDto.prototype, "totalAmount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Breakdown by payment method',
        type: [PaymentBreakdownDto],
        example: [
            { category: 'CASH', count: 25, amount: 50000 },
            { category: 'CARD', count: 15, amount: 45000 },
            { category: 'MOBILE_MONEY', count: 10, amount: 30000 },
        ],
    }),
    (0, class_transformer_1.Expose)(),
    (0, class_transformer_1.Type)(() => PaymentBreakdownDto),
    __metadata("design:type", Array)
], PaymentSummaryDto.prototype, "byMethod", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Breakdown by payment channel',
        type: [PaymentBreakdownDto],
        example: [
            { category: 'OFFICE', count: 30, amount: 75000 },
            { category: 'MOBILE_APP', count: 20, amount: 50000 },
        ],
    }),
    (0, class_transformer_1.Expose)(),
    (0, class_transformer_1.Type)(() => PaymentBreakdownDto),
    __metadata("design:type", Array)
], PaymentSummaryDto.prototype, "byChannel", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Breakdown by payment status',
        type: [PaymentBreakdownDto],
        example: [
            { category: 'COMPLETED', count: 45, amount: 120000 },
            { category: 'PENDING', count: 3, amount: 3000 },
            { category: 'FAILED', count: 2, amount: 2000 },
        ],
    }),
    (0, class_transformer_1.Expose)(),
    (0, class_transformer_1.Type)(() => PaymentBreakdownDto),
    __metadata("design:type", Array)
], PaymentSummaryDto.prototype, "byStatus", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Stripe payment success rate (percentage)',
        example: 95.5,
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Number)
], PaymentSummaryDto.prototype, "stripeSuccessRate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Count of failed payments',
        example: 2,
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Number)
], PaymentSummaryDto.prototype, "failedCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Total amount refunded',
        example: 5000.0,
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Number)
], PaymentSummaryDto.prototype, "refundedAmount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Summary period',
        type: PaymentPeriodDto,
    }),
    (0, class_transformer_1.Expose)(),
    (0, class_transformer_1.Type)(() => PaymentPeriodDto),
    __metadata("design:type", PaymentPeriodDto)
], PaymentSummaryDto.prototype, "period", void 0);
//# sourceMappingURL=payment-summary.dto.js.map