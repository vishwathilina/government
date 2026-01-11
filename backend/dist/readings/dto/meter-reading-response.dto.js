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
exports.MeterReadingResponseDto = exports.ReaderInfoDto = exports.MeterInfoDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class MeterInfoDto {
}
exports.MeterInfoDto = MeterInfoDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1 }),
    __metadata("design:type", Number)
], MeterInfoDto.prototype, "meterId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'MTR-001-2024' }),
    __metadata("design:type", String)
], MeterInfoDto.prototype, "meterSerialNo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Electricity' }),
    __metadata("design:type", String)
], MeterInfoDto.prototype, "utilityTypeName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1 }),
    __metadata("design:type", Number)
], MeterInfoDto.prototype, "utilityTypeId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: true }),
    __metadata("design:type", Boolean)
], MeterInfoDto.prototype, "isSmartMeter", void 0);
class ReaderInfoDto {
}
exports.ReaderInfoDto = ReaderInfoDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1 }),
    __metadata("design:type", Number)
], ReaderInfoDto.prototype, "employeeId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'John Smith' }),
    __metadata("design:type", String)
], ReaderInfoDto.prototype, "readerName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'DEV-001' }),
    __metadata("design:type", Object)
], ReaderInfoDto.prototype, "deviceId", void 0);
class MeterReadingResponseDto {
    static fromEntity(reading) {
        const dto = new MeterReadingResponseDto();
        dto.readingId = reading.readingId;
        dto.meterId = reading.meterId;
        dto.meterReaderId = reading.meterReaderId;
        dto.readingDate = reading.readingDate?.toISOString() || '';
        dto.readingSource = reading.readingSource;
        dto.importReading = reading.importReading ? Number(reading.importReading) : null;
        dto.prevImportReading = reading.prevImportReading ? Number(reading.prevImportReading) : null;
        dto.exportReading = reading.exportReading ? Number(reading.exportReading) : null;
        dto.prevExportReading = reading.prevExportReading ? Number(reading.prevExportReading) : null;
        dto.deviceId = reading.deviceId;
        dto.createdAt = reading.createdAt?.toISOString() || '';
        dto.consumption = reading.consumption;
        dto.exportedEnergy = reading.exportedEnergy;
        dto.netConsumption = reading.netConsumption;
        if (reading.meter) {
            dto.meter = {
                meterId: reading.meter.meterId,
                meterSerialNo: reading.meter.meterSerialNo,
                utilityTypeName: reading.meter.utilityType?.name || '',
                utilityTypeId: reading.meter.utilityTypeId,
                isSmartMeter: reading.meter.isSmartMeter,
            };
        }
        else {
            dto.meter = null;
        }
        if (reading.meterReader && reading.meterReader.employee) {
            const employee = reading.meterReader.employee;
            dto.reader = {
                employeeId: reading.meterReader.employeeId,
                readerName: `${employee.firstName} ${employee.lastName}`.trim(),
                deviceId: reading.meterReader.deviceId,
            };
        }
        else {
            dto.reader = null;
        }
        return dto;
    }
}
exports.MeterReadingResponseDto = MeterReadingResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1 }),
    __metadata("design:type", Number)
], MeterReadingResponseDto.prototype, "readingId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1 }),
    __metadata("design:type", Number)
], MeterReadingResponseDto.prototype, "meterId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 5 }),
    __metadata("design:type", Object)
], MeterReadingResponseDto.prototype, "meterReaderId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2025-12-31T10:30:00.000Z' }),
    __metadata("design:type", String)
], MeterReadingResponseDto.prototype, "readingDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'MANUAL' }),
    __metadata("design:type", String)
], MeterReadingResponseDto.prototype, "readingSource", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 12500.5 }),
    __metadata("design:type", Object)
], MeterReadingResponseDto.prototype, "importReading", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 12000.0 }),
    __metadata("design:type", Object)
], MeterReadingResponseDto.prototype, "prevImportReading", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 500.25 }),
    __metadata("design:type", Object)
], MeterReadingResponseDto.prototype, "exportReading", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 450.0 }),
    __metadata("design:type", Object)
], MeterReadingResponseDto.prototype, "prevExportReading", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'DEV-001' }),
    __metadata("design:type", Object)
], MeterReadingResponseDto.prototype, "deviceId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2025-12-31T10:30:00.000Z' }),
    __metadata("design:type", String)
], MeterReadingResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Calculated consumption (importReading - prevImportReading)',
        example: 500.5,
    }),
    __metadata("design:type", Object)
], MeterReadingResponseDto.prototype, "consumption", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Calculated exported energy (exportReading - prevExportReading)',
        example: 50.25,
    }),
    __metadata("design:type", Object)
], MeterReadingResponseDto.prototype, "exportedEnergy", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Net consumption (consumption - exportedEnergy)',
        example: 450.25,
    }),
    __metadata("design:type", Object)
], MeterReadingResponseDto.prototype, "netConsumption", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: MeterInfoDto }),
    __metadata("design:type", Object)
], MeterReadingResponseDto.prototype, "meter", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: ReaderInfoDto }),
    __metadata("design:type", Object)
], MeterReadingResponseDto.prototype, "reader", void 0);
//# sourceMappingURL=meter-reading-response.dto.js.map