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
exports.ConsumptionComparisonDto = exports.ConsumptionSummaryDto = exports.PeriodDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class PeriodDto {
}
exports.PeriodDto = PeriodDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Start date of the period',
        example: '2025-01-01T00:00:00.000Z',
    }),
    __metadata("design:type", String)
], PeriodDto.prototype, "start", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'End date of the period',
        example: '2025-12-31T23:59:59.000Z',
    }),
    __metadata("design:type", String)
], PeriodDto.prototype, "end", void 0);
class ConsumptionSummaryDto {
    constructor() {
        this.totalConsumption = 0;
        this.totalExported = 0;
        this.netConsumption = 0;
        this.readingCount = 0;
        this.averageConsumption = 0;
        this.maxConsumption = 0;
        this.minConsumption = 0;
        this.firstReading = 0;
        this.lastReading = 0;
        this.estimatedMonthlyAverage = 0;
    }
    calculate() {
        this.netConsumption = this.totalConsumption - this.totalExported;
        if (this.readingCount > 0) {
            this.averageConsumption = Number((this.totalConsumption / this.readingCount).toFixed(2));
        }
        if (this.period?.start && this.period?.end) {
            const startDate = new Date(this.period.start);
            const endDate = new Date(this.period.end);
            const daysDiff = Math.max(1, Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)));
            const monthsDiff = daysDiff / 30;
            this.estimatedMonthlyAverage = Number((this.totalConsumption / monthsDiff).toFixed(2));
        }
    }
}
exports.ConsumptionSummaryDto = ConsumptionSummaryDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Meter ID',
        example: 1,
    }),
    __metadata("design:type", Number)
], ConsumptionSummaryDto.prototype, "meterId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Meter serial number',
        example: 'MTR-001-2024',
    }),
    __metadata("design:type", String)
], ConsumptionSummaryDto.prototype, "meterSerialNo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Utility type name',
        example: 'Electricity',
    }),
    __metadata("design:type", String)
], ConsumptionSummaryDto.prototype, "utilityTypeName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Period covered by the summary',
        type: PeriodDto,
    }),
    __metadata("design:type", PeriodDto)
], ConsumptionSummaryDto.prototype, "period", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Total consumption for the period',
        example: 1250.5,
    }),
    __metadata("design:type", Number)
], ConsumptionSummaryDto.prototype, "totalConsumption", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Total energy exported (for net metering)',
        example: 150.25,
    }),
    __metadata("design:type", Number)
], ConsumptionSummaryDto.prototype, "totalExported", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Net consumption (total consumed - total exported)',
        example: 1100.25,
    }),
    __metadata("design:type", Number)
], ConsumptionSummaryDto.prototype, "netConsumption", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Number of readings in the period',
        example: 12,
    }),
    __metadata("design:type", Number)
], ConsumptionSummaryDto.prototype, "readingCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Average consumption per reading',
        example: 104.21,
    }),
    __metadata("design:type", Number)
], ConsumptionSummaryDto.prototype, "averageConsumption", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Highest single consumption',
        example: 180.5,
    }),
    __metadata("design:type", Number)
], ConsumptionSummaryDto.prototype, "maxConsumption", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Lowest single consumption',
        example: 45.25,
    }),
    __metadata("design:type", Number)
], ConsumptionSummaryDto.prototype, "minConsumption", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'First reading value in the period',
        example: 10000.0,
    }),
    __metadata("design:type", Number)
], ConsumptionSummaryDto.prototype, "firstReading", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Last reading value in the period',
        example: 11250.5,
    }),
    __metadata("design:type", Number)
], ConsumptionSummaryDto.prototype, "lastReading", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Estimated monthly average',
        example: 312.63,
    }),
    __metadata("design:type", Number)
], ConsumptionSummaryDto.prototype, "estimatedMonthlyAverage", void 0);
class ConsumptionComparisonDto {
}
exports.ConsumptionComparisonDto = ConsumptionComparisonDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Period for comparison',
        type: PeriodDto,
    }),
    __metadata("design:type", PeriodDto)
], ConsumptionComparisonDto.prototype, "period", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Consumption summaries for each meter',
        type: [ConsumptionSummaryDto],
    }),
    __metadata("design:type", Array)
], ConsumptionComparisonDto.prototype, "meters", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Total consumption across all meters',
        example: 5000.0,
    }),
    __metadata("design:type", Number)
], ConsumptionComparisonDto.prototype, "totalConsumptionAllMeters", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Total exported across all meters',
        example: 500.0,
    }),
    __metadata("design:type", Number)
], ConsumptionComparisonDto.prototype, "totalExportedAllMeters", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Total number of readings across all meters',
        example: 48,
    }),
    __metadata("design:type", Number)
], ConsumptionComparisonDto.prototype, "totalReadingCount", void 0);
//# sourceMappingURL=consumption-summary.dto.js.map