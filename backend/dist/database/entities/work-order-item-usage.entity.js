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
exports.WorkOrderItemUsage = void 0;
const typeorm_1 = require("typeorm");
const work_order_entity_1 = require("./work-order.entity");
const item_entity_1 = require("./item.entity");
const warehouse_entity_1 = require("./warehouse.entity");
const stock_transaction_entity_1 = require("./stock-transaction.entity");
let WorkOrderItemUsage = class WorkOrderItemUsage {
};
exports.WorkOrderItemUsage = WorkOrderItemUsage;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'work_order_item_usage_id', type: 'bigint' }),
    __metadata("design:type", Number)
], WorkOrderItemUsage.prototype, "workOrderItemUsageId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'work_order_id', type: 'bigint' }),
    __metadata("design:type", Number)
], WorkOrderItemUsage.prototype, "workOrderId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'item_id', type: 'bigint' }),
    __metadata("design:type", Number)
], WorkOrderItemUsage.prototype, "itemId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'warehouse_id', type: 'bigint' }),
    __metadata("design:type", Number)
], WorkOrderItemUsage.prototype, "warehouseId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'qty_used', type: 'decimal', precision: 14, scale: 3 }),
    __metadata("design:type", Number)
], WorkOrderItemUsage.prototype, "qtyUsed", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'unit_cost_snapshot', type: 'decimal', precision: 12, scale: 2 }),
    __metadata("design:type", Number)
], WorkOrderItemUsage.prototype, "unitCostSnapshot", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'item_cost_amount', type: 'decimal', precision: 12, scale: 2 }),
    __metadata("design:type", Number)
], WorkOrderItemUsage.prototype, "itemCostAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'issued_ts', type: 'datetime2', precision: 0 }),
    __metadata("design:type", Date)
], WorkOrderItemUsage.prototype, "issuedTs", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'stock_txn_id', type: 'bigint', nullable: true }),
    __metadata("design:type", Object)
], WorkOrderItemUsage.prototype, "stockTxnId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => work_order_entity_1.WorkOrder, (workOrder) => workOrder.itemUsages),
    (0, typeorm_1.JoinColumn)({ name: 'work_order_id' }),
    __metadata("design:type", work_order_entity_1.WorkOrder)
], WorkOrderItemUsage.prototype, "workOrder", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => item_entity_1.Item),
    (0, typeorm_1.JoinColumn)({ name: 'item_id' }),
    __metadata("design:type", item_entity_1.Item)
], WorkOrderItemUsage.prototype, "item", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => warehouse_entity_1.Warehouse),
    (0, typeorm_1.JoinColumn)({ name: 'warehouse_id' }),
    __metadata("design:type", warehouse_entity_1.Warehouse)
], WorkOrderItemUsage.prototype, "warehouse", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => stock_transaction_entity_1.StockTransaction, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'stock_txn_id' }),
    __metadata("design:type", Object)
], WorkOrderItemUsage.prototype, "stockTransaction", void 0);
exports.WorkOrderItemUsage = WorkOrderItemUsage = __decorate([
    (0, typeorm_1.Entity)({ name: 'WorkOrderItemUsage' }),
    (0, typeorm_1.Index)('IX_WorkOrderItemUsage_work_order', ['workOrderId']),
    (0, typeorm_1.Index)('IX_WorkOrderItemUsage_item', ['itemId']),
    (0, typeorm_1.Index)('IX_WorkOrderItemUsage_warehouse', ['warehouseId'])
], WorkOrderItemUsage);
//# sourceMappingURL=work-order-item-usage.entity.js.map