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
exports.BulkBillGenerationDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const swagger_1 = require("@nestjs/swagger");
class BulkBillGenerationDto {
    constructor() {
        this.dryRun = false;
    }
}
exports.BulkBillGenerationDto = BulkBillGenerationDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Start date of the billing period for all bills',
        example: '2024-01-01',
        type: Date,
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_transformer_1.Type)(() => Date),
    (0, class_validator_1.IsDate)(),
    __metadata("design:type", Date)
], BulkBillGenerationDto.prototype, "billingPeriodStart", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'End date of the billing period for all bills',
        example: '2024-01-31',
        type: Date,
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_transformer_1.Type)(() => Date),
    (0, class_validator_1.IsDate)(),
    __metadata("design:type", Date)
], BulkBillGenerationDto.prototype, "billingPeriodEnd", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Filter by utility type ID (e.g., 1 for Electricity)',
        example: 1,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], BulkBillGenerationDto.prototype, "utilityTypeId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Filter by customer type (RESIDENTIAL, COMMERCIAL, etc.)',
        example: 'RESIDENTIAL',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BulkBillGenerationDto.prototype, "customerType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Generate bills for specific meter IDs only',
        example: [1, 2, 3, 4, 5],
        type: [Number],
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsNumber)({}, { each: true }),
    __metadata("design:type", Array)
], BulkBillGenerationDto.prototype, "meterIds", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Dry run mode - preview bill generation without saving to database',
        example: false,
        default: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], BulkBillGenerationDto.prototype, "dryRun", void 0);
//# sourceMappingURL=bulk-bill-generation.dto.js.map