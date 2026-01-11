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
exports.Bill = void 0;
const typeorm_1 = require("typeorm");
const class_validator_1 = require("class-validator");
const meter_entity_1 = require("./meter.entity");
const bill_detail_entity_1 = require("./bill-detail.entity");
const bill_tax_entity_1 = require("./bill-tax.entity");
const payment_entity_1 = require("./payment.entity");
let Bill = class Bill {
    getTaxAmount() {
        if (!this.billTaxes || this.billTaxes.length === 0) {
            return 0;
        }
        return this.billTaxes.reduce((sum, tax) => sum + tax.getTaxAmount(), 0);
    }
    getTotalAmount() {
        const subtotal = this.energyChargeAmount +
            this.fixedChargeAmount -
            this.subsidyAmount -
            this.solarExportCredit;
        const taxes = this.getTaxAmount();
        return subtotal + taxes;
    }
    getNetPayable() {
        return this.getTotalAmount();
    }
    getTotalPaid() {
        if (!this.payments || this.payments.length === 0) {
            return 0;
        }
        return this.payments.reduce((sum, payment) => sum + payment.paymentAmount, 0);
    }
    isPaid() {
        return this.getTotalPaid() >= this.getTotalAmount();
    }
    getOutstandingBalance() {
        const balance = this.getTotalAmount() - this.getTotalPaid();
        return Math.max(0, balance);
    }
    isOverdue(currentDate = new Date()) {
        if (this.isPaid()) {
            return false;
        }
        const dueDate = new Date(this.dueDate);
        const checkDate = new Date(currentDate);
        dueDate.setHours(0, 0, 0, 0);
        checkDate.setHours(0, 0, 0, 0);
        return checkDate > dueDate;
    }
    getDaysOverdue(currentDate = new Date()) {
        if (!this.isOverdue(currentDate)) {
            return 0;
        }
        const dueDate = new Date(this.dueDate);
        const checkDate = new Date(currentDate);
        const diffTime = checkDate.getTime() - dueDate.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    }
    getBillingPeriodDays() {
        const start = new Date(this.billingPeriodStart);
        const end = new Date(this.billingPeriodEnd);
        const diffTime = end.getTime() - start.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays + 1;
    }
    getAverageDailyConsumption() {
        const days = this.getBillingPeriodDays();
        return days > 0 ? this.totalImportUnit / days : 0;
    }
};
exports.Bill = Bill;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'bill_id', type: 'bigint' }),
    __metadata("design:type", Number)
], Bill.prototype, "billId", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, typeorm_1.Index)('IX_Bill_meter'),
    (0, typeorm_1.Column)({ name: 'meter_id', type: 'bigint' }),
    __metadata("design:type", Number)
], Bill.prototype, "meterId", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsDate)(),
    (0, typeorm_1.Column)({ name: 'billing_period_start', type: 'date' }),
    __metadata("design:type", Date)
], Bill.prototype, "billingPeriodStart", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsDate)(),
    (0, typeorm_1.Column)({ name: 'billing_period_end', type: 'date' }),
    __metadata("design:type", Date)
], Bill.prototype, "billingPeriodEnd", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsDate)(),
    (0, typeorm_1.Column)({ name: 'bill_date', type: 'date' }),
    __metadata("design:type", Date)
], Bill.prototype, "billDate", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsDate)(),
    (0, typeorm_1.Column)({ name: 'due_date', type: 'date' }),
    __metadata("design:type", Date)
], Bill.prototype, "dueDate", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, typeorm_1.Column)({ name: 'total_import_unit', type: 'decimal', precision: 14, scale: 3 }),
    __metadata("design:type", Number)
], Bill.prototype, "totalImportUnit", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, typeorm_1.Column)({ name: 'total_export_unit', type: 'decimal', precision: 14, scale: 3, default: 0 }),
    __metadata("design:type", Number)
], Bill.prototype, "totalExportUnit", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, typeorm_1.Column)({ name: 'energy_charge_amount', type: 'decimal', precision: 12, scale: 2 }),
    __metadata("design:type", Number)
], Bill.prototype, "energyChargeAmount", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, typeorm_1.Column)({ name: 'fixed_charge_amount', type: 'decimal', precision: 12, scale: 2 }),
    __metadata("design:type", Number)
], Bill.prototype, "fixedChargeAmount", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, typeorm_1.Column)({ name: 'subsidy_amount', type: 'decimal', precision: 12, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], Bill.prototype, "subsidyAmount", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, typeorm_1.Column)({ name: 'solar_export_credit', type: 'decimal', precision: 12, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], Bill.prototype, "solarExportCredit", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => meter_entity_1.Meter, { eager: false }),
    (0, typeorm_1.JoinColumn)({ name: 'meter_id' }),
    __metadata("design:type", meter_entity_1.Meter)
], Bill.prototype, "meter", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => bill_detail_entity_1.BillDetail, (detail) => detail.bill, { cascade: true }),
    __metadata("design:type", Array)
], Bill.prototype, "billDetails", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => bill_tax_entity_1.BillTax, (tax) => tax.bill, { cascade: true }),
    __metadata("design:type", Array)
], Bill.prototype, "billTaxes", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => payment_entity_1.Payment, (payment) => payment.bill),
    __metadata("design:type", Array)
], Bill.prototype, "payments", void 0);
exports.Bill = Bill = __decorate([
    (0, typeorm_1.Entity)({ name: 'Bill' }),
    (0, typeorm_1.Index)('IX_Bill_meter_period', ['meterId', 'billingPeriodStart', 'billingPeriodEnd']),
    (0, typeorm_1.Index)('IX_Bill_bill_date', ['billDate']),
    (0, typeorm_1.Index)('IX_Bill_due_date', ['dueDate'])
], Bill);
//# sourceMappingURL=bill.entity.js.map