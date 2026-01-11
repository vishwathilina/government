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
exports.TariffSlab = void 0;
const typeorm_1 = require("typeorm");
const class_validator_1 = require("class-validator");
const tariff_category_entity_1 = require("./tariff-category.entity");
let TariffSlab = class TariffSlab {
    isValid(date = new Date()) {
        const checkDate = new Date(date);
        const validFrom = new Date(this.validFrom);
        if (checkDate < validFrom) {
            return false;
        }
        if (this.validTo) {
            const validTo = new Date(this.validTo);
            if (checkDate > validTo) {
                return false;
            }
        }
        return true;
    }
    isInRange(units) {
        if (units < this.fromUnit) {
            return false;
        }
        if (this.toUnit === null) {
            return true;
        }
        return units <= this.toUnit;
    }
    getUnitsInSlab(totalUnits) {
        if (totalUnits <= this.fromUnit) {
            return 0;
        }
        if (this.toUnit === null) {
            return totalUnits - this.fromUnit;
        }
        if (totalUnits > this.toUnit) {
            return this.toUnit - this.fromUnit;
        }
        return totalUnits - this.fromUnit;
    }
    calculateSlabCharge(totalUnits) {
        const unitsInSlab = this.getUnitsInSlab(totalUnits);
        return unitsInSlab * this.ratePerUnit;
    }
};
exports.TariffSlab = TariffSlab;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'slab_id', type: 'bigint' }),
    __metadata("design:type", Number)
], TariffSlab.prototype, "slabId", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    (0, typeorm_1.Index)('IX_TariffSlab_category'),
    (0, typeorm_1.Column)({ name: 'tariff_category_id', type: 'bigint' }),
    __metadata("design:type", Number)
], TariffSlab.prototype, "tariffCategoryId", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, typeorm_1.Column)({ name: 'from_unit', type: 'decimal', precision: 14, scale: 3 }),
    __metadata("design:type", Number)
], TariffSlab.prototype, "fromUnit", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, typeorm_1.Column)({ name: 'to_unit', type: 'decimal', precision: 14, scale: 3, nullable: true }),
    __metadata("design:type", Object)
], TariffSlab.prototype, "toUnit", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, typeorm_1.Column)({ name: 'rate_per_unit', type: 'decimal', precision: 12, scale: 4 }),
    __metadata("design:type", Number)
], TariffSlab.prototype, "ratePerUnit", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, typeorm_1.Column)({ name: 'fixed_charge', type: 'decimal', precision: 12, scale: 2 }),
    __metadata("design:type", Number)
], TariffSlab.prototype, "fixedCharge", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, typeorm_1.Column)({ name: 'unit_price', type: 'decimal', precision: 12, scale: 4, nullable: true }),
    __metadata("design:type", Object)
], TariffSlab.prototype, "unitPrice", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsDate)(),
    (0, typeorm_1.Index)('IX_TariffSlab_valid_from'),
    (0, typeorm_1.Column)({ name: 'valid_from', type: 'date' }),
    __metadata("design:type", Date)
], TariffSlab.prototype, "validFrom", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDate)(),
    (0, typeorm_1.Column)({ name: 'valid_to', type: 'date', nullable: true }),
    __metadata("design:type", Object)
], TariffSlab.prototype, "validTo", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => tariff_category_entity_1.TariffCategory, { eager: false }),
    (0, typeorm_1.JoinColumn)({ name: 'tariff_category_id' }),
    __metadata("design:type", tariff_category_entity_1.TariffCategory)
], TariffSlab.prototype, "tariffCategory", void 0);
exports.TariffSlab = TariffSlab = __decorate([
    (0, typeorm_1.Entity)({ name: 'TariffSlab' })
], TariffSlab);
//# sourceMappingURL=tariff-slab.entity.js.map