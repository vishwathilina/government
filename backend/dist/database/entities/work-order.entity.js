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
exports.WorkOrder = exports.WorkOrderStatus = void 0;
const typeorm_1 = require("typeorm");
const asset_entity_1 = require("./asset.entity");
const maintenance_request_entity_1 = require("./maintenance-request.entity");
const geo_area_entity_1 = require("./geo-area.entity");
const work_order_labor_entity_1 = require("./work-order-labor.entity");
const work_order_item_usage_entity_1 = require("./work-order-item-usage.entity");
var WorkOrderStatus;
(function (WorkOrderStatus) {
    WorkOrderStatus["OPEN"] = "OPEN";
    WorkOrderStatus["ASSIGNED"] = "ASSIGNED";
    WorkOrderStatus["IN_PROGRESS"] = "IN_PROGRESS";
    WorkOrderStatus["ON_HOLD"] = "ON_HOLD";
    WorkOrderStatus["COMPLETED"] = "COMPLETED";
    WorkOrderStatus["CANCELLED"] = "CANCELLED";
})(WorkOrderStatus || (exports.WorkOrderStatus = WorkOrderStatus = {}));
let WorkOrder = class WorkOrder {
    get totalLaborCost() {
        if (!this.laborEntries || this.laborEntries.length === 0)
            return 0;
        return this.laborEntries.reduce((sum, labor) => sum + Number(labor.hours) * Number(labor.hourlyRateSnapshot), 0);
    }
    get totalItemCost() {
        if (!this.itemUsages || this.itemUsages.length === 0)
            return 0;
        return this.itemUsages.reduce((sum, item) => sum + Number(item.itemCostAmount), 0);
    }
    get totalCost() {
        return this.totalLaborCost + this.totalItemCost;
    }
    get durationHours() {
        if (!this.scheduledStartTs || !this.scheduledEndTs)
            return null;
        const diff = this.scheduledEndTs.getTime() - this.scheduledStartTs.getTime();
        return Math.round(diff / (1000 * 60 * 60) * 10) / 10;
    }
};
exports.WorkOrder = WorkOrder;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'work_order_id', type: 'bigint' }),
    __metadata("design:type", Number)
], WorkOrder.prototype, "workOrderId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'opened_ts', type: 'datetime2', precision: 0 }),
    __metadata("design:type", Date)
], WorkOrder.prototype, "openedTs", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'scheduled_start_ts', type: 'datetime2', precision: 0, nullable: true }),
    __metadata("design:type", Object)
], WorkOrder.prototype, "scheduledStartTs", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'scheduled_end_ts', type: 'datetime2', precision: 0, nullable: true }),
    __metadata("design:type", Object)
], WorkOrder.prototype, "scheduledEndTs", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'closed_ts', type: 'datetime2', precision: 0, nullable: true }),
    __metadata("design:type", Object)
], WorkOrder.prototype, "closedTs", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'work_order_status', type: 'varchar', length: 30 }),
    __metadata("design:type", String)
], WorkOrder.prototype, "workOrderStatus", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'resolution_notes', type: 'nvarchar', length: 'MAX', nullable: true }),
    __metadata("design:type", Object)
], WorkOrder.prototype, "resolutionNotes", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'asset_id', type: 'bigint', nullable: true }),
    __metadata("design:type", Object)
], WorkOrder.prototype, "assetId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'request_id', type: 'bigint', nullable: true }),
    __metadata("design:type", Object)
], WorkOrder.prototype, "requestId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'geo_area_id', type: 'bigint' }),
    __metadata("design:type", Number)
], WorkOrder.prototype, "geoAreaId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => asset_entity_1.Asset, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'asset_id' }),
    __metadata("design:type", Object)
], WorkOrder.prototype, "asset", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => maintenance_request_entity_1.MaintenanceRequest, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'request_id' }),
    __metadata("design:type", Object)
], WorkOrder.prototype, "request", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => geo_area_entity_1.GeoArea),
    (0, typeorm_1.JoinColumn)({ name: 'geo_area_id' }),
    __metadata("design:type", geo_area_entity_1.GeoArea)
], WorkOrder.prototype, "geoArea", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => work_order_labor_entity_1.WorkOrderLabor, (labor) => labor.workOrder, { cascade: true }),
    __metadata("design:type", Array)
], WorkOrder.prototype, "laborEntries", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => work_order_item_usage_entity_1.WorkOrderItemUsage, (item) => item.workOrder, { cascade: true }),
    __metadata("design:type", Array)
], WorkOrder.prototype, "itemUsages", void 0);
exports.WorkOrder = WorkOrder = __decorate([
    (0, typeorm_1.Entity)({ name: 'WorkOrder' }),
    (0, typeorm_1.Index)('IX_WorkOrder_status', ['workOrderStatus']),
    (0, typeorm_1.Index)('IX_WorkOrder_asset', ['assetId']),
    (0, typeorm_1.Index)('IX_WorkOrder_request', ['requestId']),
    (0, typeorm_1.Index)('IX_WorkOrder_geo_area', ['geoAreaId']),
    (0, typeorm_1.Index)('IX_WorkOrder_dates', ['openedTs', 'scheduledStartTs'])
], WorkOrder);
//# sourceMappingURL=work-order.entity.js.map