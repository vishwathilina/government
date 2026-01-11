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
exports.OverpaymentDto = exports.AllocationResultDto = exports.PaymentAllocationResultDto = exports.ReconciliationReportDto = exports.ReconciliationDiscrepancyDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const payment_summary_dto_1 = require("./payment-summary.dto");
class ReconciliationDiscrepancyDto {
}
exports.ReconciliationDiscrepancyDto = ReconciliationDiscrepancyDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Category (payment method)',
        example: 'CASH',
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], ReconciliationDiscrepancyDto.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Expected amount',
        example: 50000.0,
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Number)
], ReconciliationDiscrepancyDto.prototype, "expectedAmount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Actual amount recorded',
        example: 49500.0,
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Number)
], ReconciliationDiscrepancyDto.prototype, "actualAmount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Variance (actual - expected)',
        example: -500.0,
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Number)
], ReconciliationDiscrepancyDto.prototype, "variance", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Variance percentage',
        example: -1.0,
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Number)
], ReconciliationDiscrepancyDto.prototype, "variancePercent", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Whether variance exceeds threshold',
        example: true,
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Boolean)
], ReconciliationDiscrepancyDto.prototype, "exceedsThreshold", void 0);
class ReconciliationReportDto {
}
exports.ReconciliationReportDto = ReconciliationReportDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Reconciliation date',
        example: '2026-01-03',
        type: Date,
    }),
    (0, class_transformer_1.Expose)(),
    (0, class_transformer_1.Type)(() => Date),
    __metadata("design:type", Date)
], ReconciliationReportDto.prototype, "date", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Total expected amount',
        example: 100000.0,
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Number)
], ReconciliationReportDto.prototype, "expectedTotal", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Total actual amount',
        example: 99500.0,
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Number)
], ReconciliationReportDto.prototype, "actualTotal", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Total variance',
        example: -500.0,
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Number)
], ReconciliationReportDto.prototype, "totalVariance", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Total number of payments',
        example: 50,
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Number)
], ReconciliationReportDto.prototype, "totalPayments", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Breakdown by payment method',
        type: [payment_summary_dto_1.PaymentBreakdownDto],
    }),
    (0, class_transformer_1.Expose)(),
    (0, class_transformer_1.Type)(() => payment_summary_dto_1.PaymentBreakdownDto),
    __metadata("design:type", Array)
], ReconciliationReportDto.prototype, "byMethod", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Discrepancies found',
        type: [ReconciliationDiscrepancyDto],
    }),
    (0, class_transformer_1.Expose)(),
    (0, class_transformer_1.Type)(() => ReconciliationDiscrepancyDto),
    __metadata("design:type", Array)
], ReconciliationReportDto.prototype, "discrepancies", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Whether reconciliation has variances',
        example: true,
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Boolean)
], ReconciliationReportDto.prototype, "hasVariances", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Reconciliation status',
        example: 'NEEDS_REVIEW',
        enum: ['BALANCED', 'NEEDS_REVIEW', 'DISCREPANCY_FOUND'],
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], ReconciliationReportDto.prototype, "status", void 0);
class PaymentAllocationResultDto {
}
exports.PaymentAllocationResultDto = PaymentAllocationResultDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Bill ID',
        example: 1,
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Number)
], PaymentAllocationResultDto.prototype, "billId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Bill outstanding before allocation',
        example: 2500.0,
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Number)
], PaymentAllocationResultDto.prototype, "outstandingBefore", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Amount allocated to this bill',
        example: 2500.0,
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Number)
], PaymentAllocationResultDto.prototype, "allocatedAmount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Bill outstanding after allocation',
        example: 0.0,
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Number)
], PaymentAllocationResultDto.prototype, "outstandingAfter", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Whether bill is now fully paid',
        example: true,
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Boolean)
], PaymentAllocationResultDto.prototype, "isFullyPaid", void 0);
class AllocationResultDto {
}
exports.AllocationResultDto = AllocationResultDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Total payment amount',
        example: 5000.0,
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Number)
], AllocationResultDto.prototype, "totalPaymentAmount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Total amount allocated',
        example: 4500.0,
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Number)
], AllocationResultDto.prototype, "totalAllocated", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Excess amount (if any)',
        example: 500.0,
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Number)
], AllocationResultDto.prototype, "excessAmount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Allocation breakdown per bill',
        type: [PaymentAllocationResultDto],
    }),
    (0, class_transformer_1.Expose)(),
    (0, class_transformer_1.Type)(() => PaymentAllocationResultDto),
    __metadata("design:type", Array)
], AllocationResultDto.prototype, "allocations", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Payment IDs created',
        type: [Number],
        example: [1, 2, 3],
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Array)
], AllocationResultDto.prototype, "paymentIds", void 0);
class OverpaymentDto {
}
exports.OverpaymentDto = OverpaymentDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Payment ID',
        example: 1,
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Number)
], OverpaymentDto.prototype, "paymentId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Bill ID',
        example: 1,
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Number)
], OverpaymentDto.prototype, "billId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Customer ID',
        example: 1,
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Object)
], OverpaymentDto.prototype, "customerId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Customer name',
        example: 'Amal Kumara Perera',
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], OverpaymentDto.prototype, "customerName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Bill total amount',
        example: 2000.0,
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Number)
], OverpaymentDto.prototype, "billAmount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Total paid amount',
        example: 2500.0,
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Number)
], OverpaymentDto.prototype, "totalPaid", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Overpayment amount',
        example: 500.0,
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Number)
], OverpaymentDto.prototype, "overpaymentAmount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Payment date',
        example: '2026-01-03T10:30:00Z',
        type: Date,
    }),
    (0, class_transformer_1.Expose)(),
    (0, class_transformer_1.Type)(() => Date),
    __metadata("design:type", Date)
], OverpaymentDto.prototype, "paymentDate", void 0);
//# sourceMappingURL=payment-advanced.dto.js.map