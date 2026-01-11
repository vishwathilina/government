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
exports.TaxConfig = exports.TaxStatus = void 0;
const typeorm_1 = require("typeorm");
const class_validator_1 = require("class-validator");
var TaxStatus;
(function (TaxStatus) {
    TaxStatus["ACTIVE"] = "ACTIVE";
    TaxStatus["INACTIVE"] = "INACTIVE";
})(TaxStatus || (exports.TaxStatus = TaxStatus = {}));
let TaxConfig = class TaxConfig {
    isActive(date = new Date()) {
        if (this.status !== TaxStatus.ACTIVE) {
            return false;
        }
        const checkDate = new Date(date);
        const effectiveFrom = new Date(this.effectiveFrom);
        if (checkDate < effectiveFrom) {
            return false;
        }
        if (this.effectiveTo) {
            const effectiveTo = new Date(this.effectiveTo);
            if (checkDate > effectiveTo) {
                return false;
            }
        }
        return true;
    }
    calculateTaxAmount(baseAmount) {
        return (baseAmount * this.ratePercent) / 100;
    }
    getRateAsDecimal() {
        return this.ratePercent / 100;
    }
    isCurrentlyEffective() {
        return this.isActive(new Date());
    }
    getDisplayName() {
        return `${this.taxName} (${this.ratePercent}%)`;
    }
};
exports.TaxConfig = TaxConfig;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'tax_id', type: 'bigint' }),
    __metadata("design:type", Number)
], TaxConfig.prototype, "taxId", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(120),
    (0, typeorm_1.Column)({ name: 'tax_name', type: 'varchar', length: 120 }),
    __metadata("design:type", String)
], TaxConfig.prototype, "taxName", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(100),
    (0, typeorm_1.Column)({ name: 'rate_percent', type: 'decimal', precision: 6, scale: 3 }),
    __metadata("design:type", Number)
], TaxConfig.prototype, "ratePercent", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsDate)(),
    (0, typeorm_1.Index)('IX_TaxConfig_effective_from'),
    (0, typeorm_1.Column)({ name: 'effective_from', type: 'date' }),
    __metadata("design:type", Date)
], TaxConfig.prototype, "effectiveFrom", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDate)(),
    (0, typeorm_1.Column)({ name: 'effective_to', type: 'date', nullable: true }),
    __metadata("design:type", Object)
], TaxConfig.prototype, "effectiveTo", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsEnum)(TaxStatus),
    (0, typeorm_1.Index)('IX_TaxConfig_status'),
    (0, typeorm_1.Column)({
        name: 'status',
        type: 'varchar',
        length: 20,
        default: TaxStatus.ACTIVE,
    }),
    __metadata("design:type", String)
], TaxConfig.prototype, "status", void 0);
exports.TaxConfig = TaxConfig = __decorate([
    (0, typeorm_1.Entity)({ name: 'TaxConfig' })
], TaxConfig);
//# sourceMappingURL=tax-config.entity.js.map