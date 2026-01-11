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
exports.Asset = exports.AssetStatus = void 0;
const typeorm_1 = require("typeorm");
const utility_type_entity_1 = require("./utility-type.entity");
var AssetStatus;
(function (AssetStatus) {
    AssetStatus["ACTIVE"] = "ACTIVE";
    AssetStatus["INACTIVE"] = "INACTIVE";
    AssetStatus["MAINTENANCE"] = "MAINTENANCE";
    AssetStatus["RETIRED"] = "RETIRED";
})(AssetStatus || (exports.AssetStatus = AssetStatus = {}));
let Asset = class Asset {
};
exports.Asset = Asset;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'asset_id', type: 'bigint' }),
    __metadata("design:type", Number)
], Asset.prototype, "assetId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'name', type: 'varchar', length: 150 }),
    __metadata("design:type", String)
], Asset.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'asset_type', type: 'varchar', length: 50 }),
    __metadata("design:type", String)
], Asset.prototype, "assetType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'status', type: 'varchar', length: 30 }),
    __metadata("design:type", String)
], Asset.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'utility_type_id', type: 'bigint' }),
    __metadata("design:type", Number)
], Asset.prototype, "utilityTypeId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => utility_type_entity_1.UtilityType),
    (0, typeorm_1.JoinColumn)({ name: 'utility_type_id' }),
    __metadata("design:type", utility_type_entity_1.UtilityType)
], Asset.prototype, "utilityType", void 0);
exports.Asset = Asset = __decorate([
    (0, typeorm_1.Entity)({ name: 'Asset' }),
    (0, typeorm_1.Index)('IX_Asset_type_status', ['assetType', 'status']),
    (0, typeorm_1.Index)('IX_Asset_utility_type', ['utilityTypeId'])
], Asset);
//# sourceMappingURL=asset.entity.js.map