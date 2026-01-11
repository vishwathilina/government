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
exports.BulkValidationResultDto = exports.ReadingValidationResultDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class ReadingValidationResultDto {
    constructor() {
        this.isValid = true;
        this.errors = [];
        this.warnings = [];
    }
    addError(message) {
        this.errors.push(message);
        this.isValid = false;
    }
    addWarning(message) {
        this.warnings.push(message);
    }
    hasWarnings() {
        return this.warnings.length > 0;
    }
}
exports.ReadingValidationResultDto = ReadingValidationResultDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Whether the reading passed all validation checks',
        example: true,
    }),
    __metadata("design:type", Boolean)
], ReadingValidationResultDto.prototype, "isValid", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'List of validation errors (blocking issues)',
        example: ['Import reading cannot be less than previous reading'],
        type: [String],
    }),
    __metadata("design:type", Array)
], ReadingValidationResultDto.prototype, "errors", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'List of warnings (non-blocking issues)',
        example: ['Consumption unusually high compared to previous month'],
        type: [String],
    }),
    __metadata("design:type", Array)
], ReadingValidationResultDto.prototype, "warnings", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Index of the reading in the batch (if bulk validation)',
        example: 0,
    }),
    __metadata("design:type", Number)
], ReadingValidationResultDto.prototype, "index", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Meter ID for reference',
        example: 1,
    }),
    __metadata("design:type", Number)
], ReadingValidationResultDto.prototype, "meterId", void 0);
class BulkValidationResultDto {
    constructor() {
        this.allValid = true;
        this.totalCount = 0;
        this.validCount = 0;
        this.invalidCount = 0;
        this.warningCount = 0;
        this.results = [];
    }
    addResult(result) {
        this.results.push(result);
        this.totalCount++;
        if (result.isValid) {
            this.validCount++;
        }
        else {
            this.invalidCount++;
            this.allValid = false;
        }
        if (result.hasWarnings()) {
            this.warningCount++;
        }
    }
}
exports.BulkValidationResultDto = BulkValidationResultDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Whether all readings passed validation',
        example: true,
    }),
    __metadata("design:type", Boolean)
], BulkValidationResultDto.prototype, "allValid", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Total number of readings validated',
        example: 10,
    }),
    __metadata("design:type", Number)
], BulkValidationResultDto.prototype, "totalCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Number of valid readings',
        example: 8,
    }),
    __metadata("design:type", Number)
], BulkValidationResultDto.prototype, "validCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Number of invalid readings',
        example: 2,
    }),
    __metadata("design:type", Number)
], BulkValidationResultDto.prototype, "invalidCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Number of readings with warnings',
        example: 3,
    }),
    __metadata("design:type", Number)
], BulkValidationResultDto.prototype, "warningCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Individual validation results',
        type: [ReadingValidationResultDto],
    }),
    __metadata("design:type", Array)
], BulkValidationResultDto.prototype, "results", void 0);
//# sourceMappingURL=reading-validation-result.dto.js.map