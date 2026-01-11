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
exports.BillTax = void 0;
const typeorm_1 = require("typeorm");
const class_validator_1 = require("class-validator");
const bill_entity_1 = require("./bill.entity");
const tax_config_entity_1 = require("./tax-config.entity");
let BillTax = class BillTax {
    getTaxAmount() {
        return (this.taxableBaseAmount * this.ratePercentApplied) / 100;
    }
    getRateAsDecimal() {
        return this.ratePercentApplied / 100;
    }
    getDisplayString() {
        const taxAmount = this.getTaxAmount();
        return `${this.taxConfig?.taxName || 'Tax'} @ ${this.ratePercentApplied}% on Rs ${this.taxableBaseAmount.toFixed(2)} = Rs ${taxAmount.toFixed(2)}`;
    }
    validateRate() {
        if (!this.taxConfig) {
            return true;
        }
        const tolerance = 0.001;
        return Math.abs(this.ratePercentApplied - this.taxConfig.ratePercent) <= tolerance;
    }
    hasRateChanged() {
        if (!this.taxConfig) {
            return false;
        }
        const tolerance = 0.001;
        return Math.abs(this.ratePercentApplied - this.taxConfig.ratePercent) > tolerance;
    }
    getEffectivePercentage() {
        if (this.taxableBaseAmount === 0) {
            return 0;
        }
        return (this.getTaxAmount() / this.taxableBaseAmount) * 100;
    }
};
exports.BillTax = BillTax;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'bill_tax_id', type: 'bigint' }),
    __metadata("design:type", Number)
], BillTax.prototype, "billTaxId", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, typeorm_1.Column)({ name: 'bill_id', type: 'bigint' }),
    __metadata("design:type", Number)
], BillTax.prototype, "billId", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, typeorm_1.Column)({ name: 'tax_id', type: 'bigint' }),
    __metadata("design:type", Number)
], BillTax.prototype, "taxId", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(100),
    (0, typeorm_1.Column)({ name: 'rate_percent_applied', type: 'decimal', precision: 6, scale: 3 }),
    __metadata("design:type", Number)
], BillTax.prototype, "ratePercentApplied", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, typeorm_1.Column)({ name: 'taxable_base_amount', type: 'decimal', precision: 12, scale: 2 }),
    __metadata("design:type", Number)
], BillTax.prototype, "taxableBaseAmount", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => bill_entity_1.Bill, (bill) => bill.billTaxes, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'bill_id' }),
    __metadata("design:type", bill_entity_1.Bill)
], BillTax.prototype, "bill", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => tax_config_entity_1.TaxConfig, { eager: false }),
    (0, typeorm_1.JoinColumn)({ name: 'tax_id' }),
    __metadata("design:type", tax_config_entity_1.TaxConfig)
], BillTax.prototype, "taxConfig", void 0);
exports.BillTax = BillTax = __decorate([
    (0, typeorm_1.Entity)({ name: 'BillTax' }),
    (0, typeorm_1.Index)('IX_BillTax_bill', ['billId'])
], BillTax);
//# sourceMappingURL=bill-tax.entity.js.map