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
exports.StockTransaction = void 0;
const typeorm_1 = require("typeorm");
let StockTransaction = class StockTransaction {
};
exports.StockTransaction = StockTransaction;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'stock_txn_id', type: 'bigint' }),
    __metadata("design:type", Number)
], StockTransaction.prototype, "stockTxnId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'item_id', type: 'bigint' }),
    __metadata("design:type", Number)
], StockTransaction.prototype, "itemId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'warehouse_id', type: 'bigint' }),
    __metadata("design:type", Number)
], StockTransaction.prototype, "warehouseId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'transaction_type', type: 'varchar', length: 30 }),
    __metadata("design:type", String)
], StockTransaction.prototype, "transactionType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'quantity', type: 'decimal', precision: 14, scale: 3 }),
    __metadata("design:type", Number)
], StockTransaction.prototype, "quantity", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'transaction_date', type: 'datetime2', precision: 0 }),
    __metadata("design:type", Date)
], StockTransaction.prototype, "transactionDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'work_order_item_usage_id', type: 'bigint', nullable: true }),
    __metadata("design:type", Object)
], StockTransaction.prototype, "workOrderItemUsageId", void 0);
exports.StockTransaction = StockTransaction = __decorate([
    (0, typeorm_1.Entity)({ name: 'StockTransaction' })
], StockTransaction);
//# sourceMappingURL=stock-transaction.entity.js.map