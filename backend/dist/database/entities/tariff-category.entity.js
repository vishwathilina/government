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
exports.TariffCategory = void 0;
const typeorm_1 = require("typeorm");
const utility_type_entity_1 = require("./utility-type.entity");
const employee_entity_1 = require("./employee.entity");
let TariffCategory = class TariffCategory {
};
exports.TariffCategory = TariffCategory;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'tariff_category_id', type: 'bigint' }),
    __metadata("design:type", Number)
], TariffCategory.prototype, "tariffCategoryId", void 0);
__decorate([
    (0, typeorm_1.Index)('IX_TariffCategory_utility_type'),
    (0, typeorm_1.Column)({ name: 'utility_type_id', type: 'bigint' }),
    __metadata("design:type", Number)
], TariffCategory.prototype, "utilityTypeId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'code', type: 'varchar', length: 40, unique: true }),
    __metadata("design:type", String)
], TariffCategory.prototype, "code", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'name', type: 'varchar', length: 120 }),
    __metadata("design:type", String)
], TariffCategory.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'description', type: 'nvarchar', length: 'max', nullable: true }),
    __metadata("design:type", Object)
], TariffCategory.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_subsidized', type: 'bit', default: false }),
    __metadata("design:type", Boolean)
], TariffCategory.prototype, "isSubsidized", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'employee_id', type: 'bigint', nullable: true }),
    __metadata("design:type", Object)
], TariffCategory.prototype, "employeeId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => utility_type_entity_1.UtilityType),
    (0, typeorm_1.JoinColumn)({ name: 'utility_type_id' }),
    __metadata("design:type", utility_type_entity_1.UtilityType)
], TariffCategory.prototype, "utilityType", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => employee_entity_1.Employee),
    (0, typeorm_1.JoinColumn)({ name: 'employee_id' }),
    __metadata("design:type", Object)
], TariffCategory.prototype, "createdBy", void 0);
exports.TariffCategory = TariffCategory = __decorate([
    (0, typeorm_1.Entity)({ name: 'TariffCategory' })
], TariffCategory);
//# sourceMappingURL=tariff-category.entity.js.map