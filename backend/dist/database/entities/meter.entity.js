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
exports.Meter = exports.MeterStatus = void 0;
const typeorm_1 = require("typeorm");
const utility_type_entity_1 = require("./utility-type.entity");
const meter_reading_entity_1 = require("./meter-reading.entity");
const service_connection_entity_1 = require("./service-connection.entity");
var MeterStatus;
(function (MeterStatus) {
    MeterStatus["ACTIVE"] = "ACTIVE";
    MeterStatus["INACTIVE"] = "INACTIVE";
    MeterStatus["FAULTY"] = "FAULTY";
    MeterStatus["REPLACED"] = "REPLACED";
})(MeterStatus || (exports.MeterStatus = MeterStatus = {}));
let Meter = class Meter {
};
exports.Meter = Meter;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'meter_id', type: 'bigint' }),
    __metadata("design:type", Number)
], Meter.prototype, "meterId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'meter_serial_no', type: 'varchar', length: 80, unique: true }),
    __metadata("design:type", String)
], Meter.prototype, "meterSerialNo", void 0);
__decorate([
    (0, typeorm_1.Index)('IX_Meter_utility_type'),
    (0, typeorm_1.Column)({ name: 'utility_type_id', type: 'bigint' }),
    __metadata("design:type", Number)
], Meter.prototype, "utilityTypeId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'installation_date', type: 'date' }),
    __metadata("design:type", Date)
], Meter.prototype, "installationDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_smart_meter', type: 'bit', default: false }),
    __metadata("design:type", Boolean)
], Meter.prototype, "isSmartMeter", void 0);
__decorate([
    (0, typeorm_1.Index)('IX_Meter_status'),
    (0, typeorm_1.Column)({
        name: 'status',
        type: 'varchar',
        length: 30,
        default: MeterStatus.ACTIVE,
    }),
    __metadata("design:type", String)
], Meter.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => utility_type_entity_1.UtilityType),
    (0, typeorm_1.JoinColumn)({ name: 'utility_type_id' }),
    __metadata("design:type", utility_type_entity_1.UtilityType)
], Meter.prototype, "utilityType", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => meter_reading_entity_1.MeterReading, (reading) => reading.meter),
    __metadata("design:type", Array)
], Meter.prototype, "readings", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => service_connection_entity_1.ServiceConnection, (connection) => connection.meter),
    __metadata("design:type", Array)
], Meter.prototype, "serviceConnections", void 0);
exports.Meter = Meter = __decorate([
    (0, typeorm_1.Entity)({ name: 'Meter' })
], Meter);
//# sourceMappingURL=meter.entity.js.map