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
exports.Complaint = exports.ComplaintStatus = void 0;
const typeorm_1 = require("typeorm");
const customer_entity_1 = require("./customer.entity");
const employee_entity_1 = require("./employee.entity");
var ComplaintStatus;
(function (ComplaintStatus) {
    ComplaintStatus["OPEN"] = "OPEN";
    ComplaintStatus["ASSIGNED"] = "ASSIGNED";
    ComplaintStatus["IN_PROGRESS"] = "IN_PROGRESS";
    ComplaintStatus["RESOLVED"] = "RESOLVED";
    ComplaintStatus["CLOSED"] = "CLOSED";
})(ComplaintStatus || (exports.ComplaintStatus = ComplaintStatus = {}));
let Complaint = class Complaint {
    get resolutionTimeHours() {
        if (!this.resolvedDate)
            return null;
        const diff = this.resolvedDate.getTime() - this.createdDate.getTime();
        return Math.round(diff / (1000 * 60 * 60));
    }
};
exports.Complaint = Complaint;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'complaint_id', type: 'bigint' }),
    __metadata("design:type", Number)
], Complaint.prototype, "complaintId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'customer_id', type: 'bigint' }),
    __metadata("design:type", Number)
], Complaint.prototype, "customerId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'assigned_employee_id', type: 'bigint', nullable: true }),
    __metadata("design:type", Object)
], Complaint.prototype, "assignedEmployeeId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'complaint_type', type: 'varchar', length: 50 }),
    __metadata("design:type", String)
], Complaint.prototype, "complaintType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'created_date', type: 'datetime2', precision: 0 }),
    __metadata("design:type", Date)
], Complaint.prototype, "createdDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'resolved_date', type: 'datetime2', precision: 0, nullable: true }),
    __metadata("design:type", Object)
], Complaint.prototype, "resolvedDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'status', type: 'varchar', length: 20 }),
    __metadata("design:type", String)
], Complaint.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'description', type: 'nvarchar', length: 'MAX' }),
    __metadata("design:type", String)
], Complaint.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => customer_entity_1.Customer),
    (0, typeorm_1.JoinColumn)({ name: 'customer_id' }),
    __metadata("design:type", customer_entity_1.Customer)
], Complaint.prototype, "customer", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => employee_entity_1.Employee, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'assigned_employee_id' }),
    __metadata("design:type", Object)
], Complaint.prototype, "assignedEmployee", void 0);
exports.Complaint = Complaint = __decorate([
    (0, typeorm_1.Entity)({ name: 'Complaints' }),
    (0, typeorm_1.Index)('IX_Complaints_customer', ['customerId']),
    (0, typeorm_1.Index)('IX_Complaints_status', ['status']),
    (0, typeorm_1.Index)('IX_Complaints_employee', ['assignedEmployeeId']),
    (0, typeorm_1.Index)('IX_Complaints_type', ['complaintType']),
    (0, typeorm_1.Index)('IX_Complaints_dates', ['createdDate', 'resolvedDate'])
], Complaint);
//# sourceMappingURL=complaint.entity.js.map