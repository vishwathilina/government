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
exports.BillResponseDto = exports.PaymentSummaryDto = exports.BillTaxDto = exports.BillDetailDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
class BillDetailDto {
}
exports.BillDetailDto = BillDetailDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Slab range description',
        example: '0-60 units',
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], BillDetailDto.prototype, "slabRange", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Number of units consumed in this slab',
        example: 60,
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Number)
], BillDetailDto.prototype, "unitsInSlab", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Rate per unit for this slab',
        example: 7.85,
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Number)
], BillDetailDto.prototype, "ratePerUnit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Total amount for units in this slab',
        example: 471.0,
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Number)
], BillDetailDto.prototype, "amount", void 0);
class BillTaxDto {
}
exports.BillTaxDto = BillTaxDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Name of the tax',
        example: 'VAT (Value Added Tax)',
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], BillTaxDto.prototype, "taxName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Tax rate percentage',
        example: 15.0,
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Number)
], BillTaxDto.prototype, "ratePercent", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Taxable base amount',
        example: 2536.0,
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Number)
], BillTaxDto.prototype, "taxableAmount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Calculated tax amount',
        example: 380.4,
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Number)
], BillTaxDto.prototype, "taxAmount", void 0);
class PaymentSummaryDto {
}
exports.PaymentSummaryDto = PaymentSummaryDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Payment ID',
        example: 1,
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Number)
], PaymentSummaryDto.prototype, "paymentId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Payment date',
        example: '2024-02-15T10:30:00Z',
    }),
    (0, class_transformer_1.Expose)(),
    (0, class_transformer_1.Type)(() => Date),
    __metadata("design:type", Date)
], PaymentSummaryDto.prototype, "paymentDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Payment amount',
        example: 2979.8,
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Number)
], PaymentSummaryDto.prototype, "paymentAmount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Payment method',
        example: 'CARD',
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], PaymentSummaryDto.prototype, "paymentMethod", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Transaction reference number',
        example: 'TXN-20240215-001234',
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], PaymentSummaryDto.prototype, "transactionRef", void 0);
class BillResponseDto {
}
exports.BillResponseDto = BillResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Bill ID',
        example: 1,
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Number)
], BillResponseDto.prototype, "billId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Meter ID',
        example: 1,
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Number)
], BillResponseDto.prototype, "meterId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Meter serial number',
        example: 'ELEC-001-2024',
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], BillResponseDto.prototype, "meterSerialNo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Customer full name',
        example: 'Amal Kumara Perera',
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], BillResponseDto.prototype, "customerName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Customer email address',
        example: 'amal.perera@gmail.com',
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], BillResponseDto.prototype, "customerEmail", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Connection address',
        example: '45/2, Gregory Road, Cinnamon Gardens, Colombo 7',
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], BillResponseDto.prototype, "connectionAddress", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Tariff category name',
        example: 'Residential Standard',
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], BillResponseDto.prototype, "tariffCategoryName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Utility type name',
        example: 'Electricity',
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], BillResponseDto.prototype, "utilityTypeName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Billing period start date',
        example: '2024-01-01',
    }),
    (0, class_transformer_1.Expose)(),
    (0, class_transformer_1.Type)(() => Date),
    __metadata("design:type", Date)
], BillResponseDto.prototype, "billingPeriodStart", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Billing period end date',
        example: '2024-01-31',
    }),
    (0, class_transformer_1.Expose)(),
    (0, class_transformer_1.Type)(() => Date),
    __metadata("design:type", Date)
], BillResponseDto.prototype, "billingPeriodEnd", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Bill generation date',
        example: '2024-02-01',
    }),
    (0, class_transformer_1.Expose)(),
    (0, class_transformer_1.Type)(() => Date),
    __metadata("design:type", Date)
], BillResponseDto.prototype, "billDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Payment due date',
        example: '2024-03-01',
    }),
    (0, class_transformer_1.Expose)(),
    (0, class_transformer_1.Type)(() => Date),
    __metadata("design:type", Date)
], BillResponseDto.prototype, "dueDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Total imported units (consumption)',
        example: 150.0,
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Number)
], BillResponseDto.prototype, "totalImportUnit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Total exported units (solar)',
        example: 0.0,
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Number)
], BillResponseDto.prototype, "totalExportUnit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Energy charge amount (from tariff slabs)',
        example: 2436.0,
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Number)
], BillResponseDto.prototype, "energyChargeAmount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Fixed charge amount',
        example: 100.0,
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Number)
], BillResponseDto.prototype, "fixedChargeAmount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Subsidy amount applied',
        example: 0.0,
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Number)
], BillResponseDto.prototype, "subsidyAmount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Solar export credit amount',
        example: 0.0,
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Number)
], BillResponseDto.prototype, "solarExportCredit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Bill detail breakdown by tariff slabs',
        type: [BillDetailDto],
    }),
    (0, class_transformer_1.Expose)(),
    (0, class_transformer_1.Type)(() => BillDetailDto),
    __metadata("design:type", Array)
], BillResponseDto.prototype, "details", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Tax breakdown',
        type: [BillTaxDto],
    }),
    (0, class_transformer_1.Expose)(),
    (0, class_transformer_1.Type)(() => BillTaxDto),
    __metadata("design:type", Array)
], BillResponseDto.prototype, "taxes", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Total amount payable (computed)',
        example: 2979.8,
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Number)
], BillResponseDto.prototype, "totalAmount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Total tax amount (computed)',
        example: 443.8,
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Number)
], BillResponseDto.prototype, "taxAmount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Whether the bill has been fully paid',
        example: false,
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Boolean)
], BillResponseDto.prototype, "isPaid", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Whether the bill is overdue',
        example: false,
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Boolean)
], BillResponseDto.prototype, "isOverdue", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'List of payments made against this bill',
        type: [PaymentSummaryDto],
    }),
    (0, class_transformer_1.Expose)(),
    (0, class_transformer_1.Type)(() => PaymentSummaryDto),
    __metadata("design:type", Array)
], BillResponseDto.prototype, "payments", void 0);
//# sourceMappingURL=bill-response.dto.js.map