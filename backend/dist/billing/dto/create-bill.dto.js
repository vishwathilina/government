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
exports.CreateBillDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const swagger_1 = require("@nestjs/swagger");
class CreateBillDto {
    constructor() {
        this.applySubsidy = true;
        this.applySolarCredit = true;
    }
}
exports.CreateBillDto = CreateBillDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID of the meter for which the bill is generated',
        example: 1,
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], CreateBillDto.prototype, "meterId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Start date of the billing period',
        example: '2024-01-01',
        type: Date,
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_transformer_1.Type)(() => Date),
    (0, class_validator_1.IsDate)(),
    __metadata("design:type", Date)
], CreateBillDto.prototype, "billingPeriodStart", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'End date of the billing period',
        example: '2024-01-31',
        type: Date,
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_transformer_1.Type)(() => Date),
    (0, class_validator_1.IsDate)(),
    __metadata("design:type", Date)
], CreateBillDto.prototype, "billingPeriodEnd", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Payment due date (defaults to bill_date + 30 days if not provided)',
        example: '2024-03-01',
        type: Date,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Date),
    (0, class_validator_1.IsDate)(),
    __metadata("design:type", Date)
], CreateBillDto.prototype, "dueDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Whether to apply eligible subsidies to the bill',
        example: true,
        default: true,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateBillDto.prototype, "applySubsidy", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Whether to apply solar export credits to the bill',
        example: true,
        default: true,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateBillDto.prototype, "applySolarCredit", void 0);
//# sourceMappingURL=create-bill.dto.js.map