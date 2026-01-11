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
exports.MeterReading = exports.ReadingSource = void 0;
const typeorm_1 = require("typeorm");
const meter_entity_1 = require("./meter.entity");
var ReadingSource;
(function (ReadingSource) {
    ReadingSource["MANUAL"] = "MANUAL";
    ReadingSource["SMART_METER"] = "SMART_METER";
    ReadingSource["ESTIMATED"] = "ESTIMATED";
    ReadingSource["CORRECTED"] = "CORRECTED";
})(ReadingSource || (exports.ReadingSource = ReadingSource = {}));
let MeterReading = class MeterReading {
    get consumption() {
        if (this.importReading === null || this.prevImportReading === null) {
            return null;
        }
        return Number(this.importReading) - Number(this.prevImportReading);
    }
    get exportedEnergy() {
        if (this.exportReading === null || this.prevExportReading === null) {
            return null;
        }
        return Number(this.exportReading) - Number(this.prevExportReading);
    }
    get netConsumption() {
        const consumed = this.consumption;
        const exported = this.exportedEnergy;
        if (consumed === null)
            return null;
        if (exported === null)
            return consumed;
        return consumed - exported;
    }
    validateBeforeInsert() {
        this.validate();
        if (!this.createdAt) {
            this.createdAt = new Date();
        }
    }
    validateBeforeUpdate() {
        this.validate();
    }
    validate() {
        if (this.readingDate > new Date()) {
            throw new Error('Reading date cannot be in the future');
        }
        if (this.readingSource !== ReadingSource.CORRECTED &&
            this.importReading !== null &&
            this.prevImportReading !== null &&
            Number(this.importReading) < Number(this.prevImportReading)) {
            throw new Error('Import reading must be greater than or equal to previous import reading (unless corrected)');
        }
        if (this.readingSource !== ReadingSource.CORRECTED &&
            this.exportReading !== null &&
            this.prevExportReading !== null &&
            Number(this.exportReading) < Number(this.prevExportReading)) {
            throw new Error('Export reading must be greater than or equal to previous export reading (unless corrected)');
        }
        if (!Object.values(ReadingSource).includes(this.readingSource)) {
            throw new Error(`Invalid reading source. Must be one of: ${Object.values(ReadingSource).join(', ')}`);
        }
    }
};
exports.MeterReading = MeterReading;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'reading_id', type: 'bigint' }),
    __metadata("design:type", Number)
], MeterReading.prototype, "readingId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'meter_id', type: 'bigint' }),
    __metadata("design:type", Number)
], MeterReading.prototype, "meterId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'meter_reader_id', type: 'bigint', nullable: true }),
    __metadata("design:type", Object)
], MeterReading.prototype, "meterReaderId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'reading_date', type: 'datetime2', precision: 0 }),
    __metadata("design:type", Date)
], MeterReading.prototype, "readingDate", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'reading_source',
        type: 'varchar',
        length: 30,
        enum: ReadingSource,
    }),
    __metadata("design:type", String)
], MeterReading.prototype, "readingSource", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'import_reading',
        type: 'decimal',
        precision: 14,
        scale: 3,
        nullable: true,
    }),
    __metadata("design:type", Object)
], MeterReading.prototype, "importReading", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'prev_import_reading',
        type: 'decimal',
        precision: 14,
        scale: 3,
        nullable: true,
    }),
    __metadata("design:type", Object)
], MeterReading.prototype, "prevImportReading", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'export_reading',
        type: 'decimal',
        precision: 14,
        scale: 3,
        nullable: true,
    }),
    __metadata("design:type", Object)
], MeterReading.prototype, "exportReading", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'prev_export_reading',
        type: 'decimal',
        precision: 14,
        scale: 3,
        nullable: true,
    }),
    __metadata("design:type", Object)
], MeterReading.prototype, "prevExportReading", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'device_id', type: 'varchar', length: 80, nullable: true }),
    __metadata("design:type", Object)
], MeterReading.prototype, "deviceId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'created_at', type: 'datetime2', precision: 0 }),
    __metadata("design:type", Date)
], MeterReading.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => meter_entity_1.Meter, (meter) => meter.readings),
    (0, typeorm_1.JoinColumn)({ name: 'meter_id', referencedColumnName: 'meterId' }),
    __metadata("design:type", meter_entity_1.Meter)
], MeterReading.prototype, "meter", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)('MeterReader', 'readings', { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'meter_reader_id', referencedColumnName: 'employeeId' }),
    __metadata("design:type", Object)
], MeterReading.prototype, "meterReader", void 0);
__decorate([
    (0, typeorm_1.BeforeInsert)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], MeterReading.prototype, "validateBeforeInsert", null);
__decorate([
    (0, typeorm_1.BeforeUpdate)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], MeterReading.prototype, "validateBeforeUpdate", null);
exports.MeterReading = MeterReading = __decorate([
    (0, typeorm_1.Entity)({ name: 'MeterReading', synchronize: false }),
    (0, typeorm_1.Index)('IX_MeterReading_meter_date', ['meterId', 'readingDate']),
    (0, typeorm_1.Index)('IX_MeterReading_reader_date', ['meterReaderId', 'readingDate'])
], MeterReading);
//# sourceMappingURL=meter-reading.entity.js.map