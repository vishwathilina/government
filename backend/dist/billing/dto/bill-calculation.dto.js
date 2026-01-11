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
exports.BillCalculationDto = exports.TaxBreakdownDto = exports.SlabBreakdownDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
class SlabBreakdownDto {
}
exports.SlabBreakdownDto = SlabBreakdownDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Starting unit for this slab',
        example: 0,
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Number)
], SlabBreakdownDto.prototype, "from", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Ending unit for this slab (null means unlimited)',
        example: 60,
        nullable: true,
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Object)
], SlabBreakdownDto.prototype, "to", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Number of units in this slab',
        example: 60,
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Number)
], SlabBreakdownDto.prototype, "units", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Rate per unit for this slab',
        example: 7.85,
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Number)
], SlabBreakdownDto.prototype, "rate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Total amount for this slab',
        example: 471.0,
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Number)
], SlabBreakdownDto.prototype, "amount", void 0);
class TaxBreakdownDto {
}
exports.TaxBreakdownDto = TaxBreakdownDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Name of the tax',
        example: 'VAT (Value Added Tax)',
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], TaxBreakdownDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Tax rate percentage',
        example: 15.0,
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Number)
], TaxBreakdownDto.prototype, "rate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Calculated tax amount',
        example: 380.4,
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Number)
], TaxBreakdownDto.prototype, "amount", void 0);
class BillCalculationDto {
}
exports.BillCalculationDto = BillCalculationDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Starting meter reading',
        example: 100.0,
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Number)
], BillCalculationDto.prototype, "startReading", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Ending meter reading',
        example: 250.0,
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Number)
], BillCalculationDto.prototype, "endReading", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Total consumption in units',
        example: 150.0,
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Number)
], BillCalculationDto.prototype, "consumption", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Breakdown by tariff slabs',
        type: [SlabBreakdownDto],
    }),
    (0, class_transformer_1.Expose)(),
    (0, class_transformer_1.Type)(() => SlabBreakdownDto),
    __metadata("design:type", Array)
], BillCalculationDto.prototype, "slabBreakdown", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Total energy charge from all slabs',
        example: 2436.0,
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Number)
], BillCalculationDto.prototype, "energyCharge", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Fixed charge for the billing period',
        example: 100.0,
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Number)
], BillCalculationDto.prototype, "fixedCharge", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Subtotal (energy + fixed)',
        example: 2536.0,
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Number)
], BillCalculationDto.prototype, "subtotal", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Subsidy amount deducted',
        example: 0.0,
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Number)
], BillCalculationDto.prototype, "subsidy", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Solar export credit deducted',
        example: 0.0,
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Number)
], BillCalculationDto.prototype, "solarCredit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Amount before tax (subtotal - subsidy - credit)',
        example: 2536.0,
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Number)
], BillCalculationDto.prototype, "beforeTax", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Tax breakdown',
        type: [TaxBreakdownDto],
    }),
    (0, class_transformer_1.Expose)(),
    (0, class_transformer_1.Type)(() => TaxBreakdownDto),
    __metadata("design:type", Array)
], BillCalculationDto.prototype, "taxes", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Final total amount payable',
        example: 2979.8,
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Number)
], BillCalculationDto.prototype, "totalAmount", void 0);
//# sourceMappingURL=bill-calculation.dto.js.map