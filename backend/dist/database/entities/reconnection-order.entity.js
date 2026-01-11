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
exports.ReconnectionOrder = exports.ReconnectionStatus = void 0;
const typeorm_1 = require("typeorm");
const service_connection_entity_1 = require("./service-connection.entity");
const employee_entity_1 = require("./employee.entity");
var ReconnectionStatus;
(function (ReconnectionStatus) {
    ReconnectionStatus["PENDING"] = "PENDING";
    ReconnectionStatus["SCHEDULED"] = "SCHEDULED";
    ReconnectionStatus["COMPLETED"] = "COMPLETED";
    ReconnectionStatus["CANCELLED"] = "CANCELLED";
})(ReconnectionStatus || (exports.ReconnectionStatus = ReconnectionStatus = {}));
let ReconnectionOrder = class ReconnectionOrder {
};
exports.ReconnectionOrder = ReconnectionOrder;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'reconnection_id', type: 'bigint' }),
    __metadata("design:type", Number)
], ReconnectionOrder.prototype, "reconnectionId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'connection_id', type: 'bigint' }),
    __metadata("design:type", Number)
], ReconnectionOrder.prototype, "connectionId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'employee_id', type: 'bigint' }),
    __metadata("design:type", Number)
], ReconnectionOrder.prototype, "employeeId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'scheduled_date', type: 'date', nullable: true }),
    __metadata("design:type", Object)
], ReconnectionOrder.prototype, "scheduledDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'reconnection_date', type: 'date', nullable: true }),
    __metadata("design:type", Object)
], ReconnectionOrder.prototype, "reconnectionDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'reconnection_fee', type: 'decimal', precision: 12, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], ReconnectionOrder.prototype, "reconnectionFee", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'status', type: 'varchar', length: 20 }),
    __metadata("design:type", String)
], ReconnectionOrder.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => service_connection_entity_1.ServiceConnection),
    (0, typeorm_1.JoinColumn)({ name: 'connection_id' }),
    __metadata("design:type", service_connection_entity_1.ServiceConnection)
], ReconnectionOrder.prototype, "connection", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => employee_entity_1.Employee),
    (0, typeorm_1.JoinColumn)({ name: 'employee_id' }),
    __metadata("design:type", employee_entity_1.Employee)
], ReconnectionOrder.prototype, "employee", void 0);
exports.ReconnectionOrder = ReconnectionOrder = __decorate([
    (0, typeorm_1.Entity)({ name: 'ReconnectionOrder' }),
    (0, typeorm_1.Index)('IX_ReconnectionOrder_connection', ['connectionId']),
    (0, typeorm_1.Index)('IX_ReconnectionOrder_status', ['status']),
    (0, typeorm_1.Index)('IX_ReconnectionOrder_employee', ['employeeId']),
    (0, typeorm_1.Index)('IX_ReconnectionOrder_dates', ['scheduledDate', 'reconnectionDate'])
], ReconnectionOrder);
//# sourceMappingURL=reconnection-order.entity.js.map