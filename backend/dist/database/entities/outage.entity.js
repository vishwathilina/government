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
exports.Outage = exports.OutageType = void 0;
const typeorm_1 = require("typeorm");
const utility_type_entity_1 = require("./utility-type.entity");
const employee_entity_1 = require("./employee.entity");
var OutageType;
(function (OutageType) {
    OutageType["PLANNED"] = "PLANNED";
    OutageType["UNPLANNED"] = "UNPLANNED";
})(OutageType || (exports.OutageType = OutageType = {}));
let Outage = class Outage {
    get isActive() {
        const now = new Date();
        return this.startTime <= now && (!this.endTime || this.endTime >= now);
    }
    get durationHours() {
        if (!this.endTime)
            return null;
        const diff = this.endTime.getTime() - this.startTime.getTime();
        return Math.round(diff / (1000 * 60 * 60) * 10) / 10;
    }
};
exports.Outage = Outage;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'outage_id', type: 'bigint' }),
    __metadata("design:type", Number)
], Outage.prototype, "outageId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'utility_type_id', type: 'bigint' }),
    __metadata("design:type", Number)
], Outage.prototype, "utilityTypeId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'employee_id', type: 'bigint', nullable: true }),
    __metadata("design:type", Object)
], Outage.prototype, "employeeId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'start_time', type: 'datetime2', precision: 0 }),
    __metadata("design:type", Date)
], Outage.prototype, "startTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'end_time', type: 'datetime2', precision: 0, nullable: true }),
    __metadata("design:type", Object)
], Outage.prototype, "endTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'outage_type', type: 'varchar', length: 30 }),
    __metadata("design:type", String)
], Outage.prototype, "outageType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'reason', type: 'nvarchar', length: 'MAX', nullable: true }),
    __metadata("design:type", Object)
], Outage.prototype, "reason", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => utility_type_entity_1.UtilityType),
    (0, typeorm_1.JoinColumn)({ name: 'utility_type_id' }),
    __metadata("design:type", utility_type_entity_1.UtilityType)
], Outage.prototype, "utilityType", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => employee_entity_1.Employee, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'employee_id' }),
    __metadata("design:type", Object)
], Outage.prototype, "employee", void 0);
exports.Outage = Outage = __decorate([
    (0, typeorm_1.Entity)({ name: 'Outage' }),
    (0, typeorm_1.Index)('IX_Outage_utility_type', ['utilityTypeId']),
    (0, typeorm_1.Index)('IX_Outage_type', ['outageType']),
    (0, typeorm_1.Index)('IX_Outage_dates', ['startTime', 'endTime']),
    (0, typeorm_1.Index)('IX_Outage_employee', ['employeeId'])
], Outage);
//# sourceMappingURL=outage.entity.js.map