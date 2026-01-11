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
exports.GeoArea = void 0;
const typeorm_1 = require("typeorm");
let GeoArea = class GeoArea {
};
exports.GeoArea = GeoArea;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'geo_area_id', type: 'bigint' }),
    __metadata("design:type", Number)
], GeoArea.prototype, "geoAreaId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'name', type: 'varchar', length: 120 }),
    __metadata("design:type", String)
], GeoArea.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'type', type: 'varchar', length: 30 }),
    __metadata("design:type", String)
], GeoArea.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'parent_geo_area_id', type: 'bigint', nullable: true }),
    __metadata("design:type", Object)
], GeoArea.prototype, "parentGeoAreaId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => GeoArea, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'parent_geo_area_id' }),
    __metadata("design:type", Object)
], GeoArea.prototype, "parentGeoArea", void 0);
exports.GeoArea = GeoArea = __decorate([
    (0, typeorm_1.Entity)({ name: 'GeoArea' })
], GeoArea);
//# sourceMappingURL=geo-area.entity.js.map