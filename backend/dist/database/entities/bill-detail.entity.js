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
exports.BillDetail = void 0;
const typeorm_1 = require("typeorm");
const class_validator_1 = require("class-validator");
const bill_entity_1 = require("./bill.entity");
const tariff_slab_entity_1 = require("./tariff-slab.entity");
let BillDetail = class BillDetail {
    getRatePerUnit() {
        return this.unitsInSlab > 0 ? this.amount / this.unitsInSlab : 0;
    }
    getSlabRangeDescription() {
        if (!this.tariffSlab) {
            return 'Fixed charge / Other';
        }
        const from = this.tariffSlab.fromUnit;
        const to = this.tariffSlab.toUnit;
        if (to === null) {
            return `${from}+ units`;
        }
        return `${from}-${to} units`;
    }
    validateAmount() {
        if (!this.tariffSlab) {
            return true;
        }
        const expectedAmount = this.unitsInSlab * this.tariffSlab.ratePerUnit;
        const tolerance = 0.01;
        return Math.abs(this.amount - expectedAmount) <= tolerance;
    }
};
exports.BillDetail = BillDetail;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'bill_detail_id', type: 'bigint' }),
    __metadata("design:type", Number)
], BillDetail.prototype, "billDetailId", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, typeorm_1.Column)({ name: 'bill_id', type: 'bigint' }),
    __metadata("design:type", Number)
], BillDetail.prototype, "billId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, typeorm_1.Column)({ name: 'slab_id', type: 'bigint', nullable: true }),
    __metadata("design:type", Object)
], BillDetail.prototype, "slabId", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, typeorm_1.Column)({ name: 'units_in_slab', type: 'decimal', precision: 14, scale: 3 }),
    __metadata("design:type", Number)
], BillDetail.prototype, "unitsInSlab", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, typeorm_1.Column)({ name: 'amount', type: 'decimal', precision: 12, scale: 2 }),
    __metadata("design:type", Number)
], BillDetail.prototype, "amount", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => bill_entity_1.Bill, (bill) => bill.billDetails, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'bill_id' }),
    __metadata("design:type", bill_entity_1.Bill)
], BillDetail.prototype, "bill", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => tariff_slab_entity_1.TariffSlab, { eager: false, nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'slab_id' }),
    __metadata("design:type", Object)
], BillDetail.prototype, "tariffSlab", void 0);
exports.BillDetail = BillDetail = __decorate([
    (0, typeorm_1.Entity)({ name: 'BillDetail' }),
    (0, typeorm_1.Index)('IX_BillDetail_bill', ['billId'])
], BillDetail);
//# sourceMappingURL=bill-detail.entity.js.map