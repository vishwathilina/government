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
exports.DailyCollectionReportDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const payment_response_dto_1 = require("./payment-response.dto");
const payment_summary_dto_1 = require("./payment-summary.dto");
class DailyCollectionReportDto {
}
exports.DailyCollectionReportDto = DailyCollectionReportDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Report date',
        example: '2026-01-03',
        type: Date,
    }),
    (0, class_transformer_1.Expose)(),
    (0, class_transformer_1.Type)(() => Date),
    __metadata("design:type", Date)
], DailyCollectionReportDto.prototype, "date", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Name of the cashier/employee',
        example: 'Sunil Fernando',
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], DailyCollectionReportDto.prototype, "cashierName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Cashier/Employee ID',
        example: 5,
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Number)
], DailyCollectionReportDto.prototype, "cashierId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Opening balance (cash on hand at start of day)',
        example: 5000.0,
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Number)
], DailyCollectionReportDto.prototype, "openingBalance", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Total amount collected during the day',
        example: 75000.0,
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Number)
], DailyCollectionReportDto.prototype, "totalCollected", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Collection breakdown by payment method',
        type: [payment_summary_dto_1.PaymentBreakdownDto],
        example: [
            { category: 'CASH', count: 20, amount: 45000 },
            { category: 'CARD', count: 10, amount: 25000 },
            { category: 'CHEQUE', count: 2, amount: 5000 },
        ],
    }),
    (0, class_transformer_1.Expose)(),
    (0, class_transformer_1.Type)(() => payment_summary_dto_1.PaymentBreakdownDto),
    __metadata("design:type", Array)
], DailyCollectionReportDto.prototype, "byMethod", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'List of all payments collected',
        type: [payment_response_dto_1.PaymentResponseDto],
    }),
    (0, class_transformer_1.Expose)(),
    (0, class_transformer_1.Type)(() => payment_response_dto_1.PaymentResponseDto),
    __metadata("design:type", Array)
], DailyCollectionReportDto.prototype, "paymentsList", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Closing balance (opening + cash collections)',
        example: 50000.0,
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Number)
], DailyCollectionReportDto.prototype, "closingBalance", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Total number of transactions',
        example: 32,
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Number)
], DailyCollectionReportDto.prototype, "totalTransactions", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Cash amount collected',
        example: 45000.0,
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Number)
], DailyCollectionReportDto.prototype, "cashCollected", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Non-cash amount collected (cards, transfers, etc.)',
        example: 30000.0,
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Number)
], DailyCollectionReportDto.prototype, "nonCashCollected", void 0);
//# sourceMappingURL=daily-collection-report.dto.js.map