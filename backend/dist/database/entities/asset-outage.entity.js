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
exports.AssetOutage = exports.AssetOutageType = void 0;
const typeorm_1 = require("typeorm");
const asset_entity_1 = require("./asset.entity");
var AssetOutageType;
(function (AssetOutageType) {
    AssetOutageType["FULL"] = "FULL";
    AssetOutageType["PARTIAL"] = "PARTIAL";
})(AssetOutageType || (exports.AssetOutageType = AssetOutageType = {}));
let AssetOutage = class AssetOutage {
    get isActive() {
        const now = new Date();
        return this.startTs <= now && (!this.endTs || this.endTs >= now);
    }
    get durationHours() {
        if (!this.endTs)
            return null;
        const diff = this.endTs.getTime() - this.startTs.getTime();
        return Math.round(diff / (1000 * 60 * 60) * 10) / 10;
    }
};
exports.AssetOutage = AssetOutage;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'outage_id', type: 'bigint' }),
    __metadata("design:type", Number)
], AssetOutage.prototype, "outageId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'asset_id', type: 'bigint' }),
    __metadata("design:type", Number)
], AssetOutage.prototype, "assetId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'outage_type', type: 'varchar', length: 20 }),
    __metadata("design:type", String)
], AssetOutage.prototype, "outageType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'start_ts', type: 'datetime2', precision: 0 }),
    __metadata("design:type", Date)
], AssetOutage.prototype, "startTs", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'end_ts', type: 'datetime2', precision: 0, nullable: true }),
    __metadata("design:type", Object)
], AssetOutage.prototype, "endTs", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'reason', type: 'nvarchar', length: 'MAX', nullable: true }),
    __metadata("design:type", Object)
], AssetOutage.prototype, "reason", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'derate_percent', type: 'decimal', precision: 5, scale: 2, nullable: true }),
    __metadata("design:type", Object)
], AssetOutage.prototype, "deratePercent", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => asset_entity_1.Asset),
    (0, typeorm_1.JoinColumn)({ name: 'asset_id' }),
    __metadata("design:type", asset_entity_1.Asset)
], AssetOutage.prototype, "asset", void 0);
exports.AssetOutage = AssetOutage = __decorate([
    (0, typeorm_1.Entity)({ name: 'AssetOutage' }),
    (0, typeorm_1.Index)('IX_AssetOutage_asset', ['assetId']),
    (0, typeorm_1.Index)('IX_AssetOutage_type', ['outageType']),
    (0, typeorm_1.Index)('IX_AssetOutage_dates', ['startTs', 'endTs'])
], AssetOutage);
//# sourceMappingURL=asset-outage.entity.js.map