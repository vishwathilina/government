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
exports.DisconnectionOrder = exports.DisconnectionStatus = void 0;
const typeorm_1 = require("typeorm");
const service_connection_entity_1 = require("./service-connection.entity");
const employee_entity_1 = require("./employee.entity");
var DisconnectionStatus;
(function (DisconnectionStatus) {
    DisconnectionStatus["PENDING"] = "PENDING";
    DisconnectionStatus["SCHEDULED"] = "SCHEDULED";
    DisconnectionStatus["EXECUTED"] = "EXECUTED";
    DisconnectionStatus["CANCELLED"] = "CANCELLED";
})(DisconnectionStatus || (exports.DisconnectionStatus = DisconnectionStatus = {}));
let DisconnectionOrder = class DisconnectionOrder {
};
exports.DisconnectionOrder = DisconnectionOrder;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'disconnection_id', type: 'bigint' }),
    __metadata("design:type", Number)
], DisconnectionOrder.prototype, "disconnectionId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'connection_id', type: 'bigint' }),
    __metadata("design:type", Number)
], DisconnectionOrder.prototype, "connectionId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'employee_id', type: 'bigint' }),
    __metadata("design:type", Number)
], DisconnectionOrder.prototype, "employeeId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'reason', type: 'nvarchar', length: 'MAX', nullable: true }),
    __metadata("design:type", Object)
], DisconnectionOrder.prototype, "reason", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'issue_date', type: 'date' }),
    __metadata("design:type", Date)
], DisconnectionOrder.prototype, "issueDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'scheduled_date', type: 'date', nullable: true }),
    __metadata("design:type", Object)
], DisconnectionOrder.prototype, "scheduledDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'executed_date', type: 'date', nullable: true }),
    __metadata("design:type", Object)
], DisconnectionOrder.prototype, "executedDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'status', type: 'varchar', length: 20 }),
    __metadata("design:type", String)
], DisconnectionOrder.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => service_connection_entity_1.ServiceConnection),
    (0, typeorm_1.JoinColumn)({ name: 'connection_id' }),
    __metadata("design:type", service_connection_entity_1.ServiceConnection)
], DisconnectionOrder.prototype, "connection", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => employee_entity_1.Employee),
    (0, typeorm_1.JoinColumn)({ name: 'employee_id' }),
    __metadata("design:type", employee_entity_1.Employee)
], DisconnectionOrder.prototype, "employee", void 0);
exports.DisconnectionOrder = DisconnectionOrder = __decorate([
    (0, typeorm_1.Entity)({ name: 'DisconnectionOrder' }),
    (0, typeorm_1.Index)('IX_DisconnectionOrder_connection', ['connectionId']),
    (0, typeorm_1.Index)('IX_DisconnectionOrder_status', ['status']),
    (0, typeorm_1.Index)('IX_DisconnectionOrder_employee', ['employeeId']),
    (0, typeorm_1.Index)('IX_DisconnectionOrder_dates', ['issueDate', 'scheduledDate'])
], DisconnectionOrder);
//# sourceMappingURL=disconnection-order.entity.js.map