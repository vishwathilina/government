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
exports.ConnectionAddress = void 0;
const typeorm_1 = require("typeorm");
const geo_area_entity_1 = require("./geo-area.entity");
let ConnectionAddress = class ConnectionAddress {
    get fullAddress() {
        return `${this.line1}, ${this.city} ${this.postalCode}`;
    }
};
exports.ConnectionAddress = ConnectionAddress;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'connection_address_id', type: 'bigint' }),
    __metadata("design:type", Number)
], ConnectionAddress.prototype, "connectionAddressId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'line1', type: 'varchar', length: 200 }),
    __metadata("design:type", String)
], ConnectionAddress.prototype, "line1", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'city', type: 'varchar', length: 120 }),
    __metadata("design:type", String)
], ConnectionAddress.prototype, "city", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'postal_code', type: 'varchar', length: 20 }),
    __metadata("design:type", String)
], ConnectionAddress.prototype, "postalCode", void 0);
__decorate([
    (0, typeorm_1.Index)('IX_ConnectionAddress_geo_area'),
    (0, typeorm_1.Column)({ name: 'geo_area_id', type: 'bigint' }),
    __metadata("design:type", Number)
], ConnectionAddress.prototype, "geoAreaId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => geo_area_entity_1.GeoArea),
    (0, typeorm_1.JoinColumn)({ name: 'geo_area_id' }),
    __metadata("design:type", geo_area_entity_1.GeoArea)
], ConnectionAddress.prototype, "geoArea", void 0);
exports.ConnectionAddress = ConnectionAddress = __decorate([
    (0, typeorm_1.Entity)({ name: 'ConnectionAddress' })
], ConnectionAddress);
//# sourceMappingURL=connection-address.entity.js.map