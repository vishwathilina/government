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
exports.WorkOrderLabor = void 0;
const typeorm_1 = require("typeorm");
const work_order_entity_1 = require("./work-order.entity");
const employee_entity_1 = require("./employee.entity");
let WorkOrderLabor = class WorkOrderLabor {
    get totalCost() {
        return Number(this.hours) * Number(this.hourlyRateSnapshot);
    }
};
exports.WorkOrderLabor = WorkOrderLabor;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'work_order_labor_id', type: 'bigint' }),
    __metadata("design:type", Number)
], WorkOrderLabor.prototype, "workOrderLaborId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'work_order_id', type: 'bigint' }),
    __metadata("design:type", Number)
], WorkOrderLabor.prototype, "workOrderId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'work_date', type: 'date' }),
    __metadata("design:type", Date)
], WorkOrderLabor.prototype, "workDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'hours', type: 'decimal', precision: 6, scale: 2 }),
    __metadata("design:type", Number)
], WorkOrderLabor.prototype, "hours", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'hourly_rate_snapshot', type: 'decimal', precision: 12, scale: 2 }),
    __metadata("design:type", Number)
], WorkOrderLabor.prototype, "hourlyRateSnapshot", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => work_order_entity_1.WorkOrder, (workOrder) => workOrder.laborEntries),
    (0, typeorm_1.JoinColumn)({ name: 'work_order_id' }),
    __metadata("design:type", work_order_entity_1.WorkOrder)
], WorkOrderLabor.prototype, "workOrder", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => employee_entity_1.Employee),
    (0, typeorm_1.JoinTable)({
        name: 'WorkOrderLaborEmployee',
        joinColumn: { name: 'work_order_labor_id', referencedColumnName: 'workOrderLaborId' },
        inverseJoinColumn: { name: 'employee_id', referencedColumnName: 'employeeId' },
    }),
    __metadata("design:type", Array)
], WorkOrderLabor.prototype, "employees", void 0);
exports.WorkOrderLabor = WorkOrderLabor = __decorate([
    (0, typeorm_1.Entity)({ name: 'WorkOrderLabor' }),
    (0, typeorm_1.Index)('IX_WorkOrderLabor_work_order', ['workOrderId']),
    (0, typeorm_1.Index)('IX_WorkOrderLabor_date', ['workDate'])
], WorkOrderLabor);
//# sourceMappingURL=work-order-labor.entity.js.map