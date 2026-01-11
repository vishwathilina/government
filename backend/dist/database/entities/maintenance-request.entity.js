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
exports.MaintenanceRequest = exports.RequestPriority = void 0;
const typeorm_1 = require("typeorm");
const customer_entity_1 = require("./customer.entity");
const geo_area_entity_1 = require("./geo-area.entity");
const utility_type_entity_1 = require("./utility-type.entity");
var RequestPriority;
(function (RequestPriority) {
    RequestPriority["LOW"] = "LOW";
    RequestPriority["MEDIUM"] = "MEDIUM";
    RequestPriority["HIGH"] = "HIGH";
    RequestPriority["CRITICAL"] = "CRITICAL";
})(RequestPriority || (exports.RequestPriority = RequestPriority = {}));
let MaintenanceRequest = class MaintenanceRequest {
};
exports.MaintenanceRequest = MaintenanceRequest;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'request_id', type: 'bigint' }),
    __metadata("design:type", Number)
], MaintenanceRequest.prototype, "requestId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'requested_by_customer_id', type: 'bigint', nullable: true }),
    __metadata("design:type", Object)
], MaintenanceRequest.prototype, "requestedByCustomerId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'request_ts', type: 'datetime2', precision: 0 }),
    __metadata("design:type", Date)
], MaintenanceRequest.prototype, "requestTs", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'priority', type: 'varchar', length: 20 }),
    __metadata("design:type", String)
], MaintenanceRequest.prototype, "priority", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'issue_type', type: 'varchar', length: 50 }),
    __metadata("design:type", String)
], MaintenanceRequest.prototype, "issueType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'description', type: 'nvarchar', length: 'MAX' }),
    __metadata("design:type", String)
], MaintenanceRequest.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'output_uom', type: 'varchar', length: 20, nullable: true }),
    __metadata("design:type", Object)
], MaintenanceRequest.prototype, "outputUom", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'geo_area_id', type: 'bigint' }),
    __metadata("design:type", Number)
], MaintenanceRequest.prototype, "geoAreaId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'utility_type_id', type: 'bigint' }),
    __metadata("design:type", Number)
], MaintenanceRequest.prototype, "utilityTypeId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => customer_entity_1.Customer, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'requested_by_customer_id' }),
    __metadata("design:type", Object)
], MaintenanceRequest.prototype, "requestedByCustomer", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => geo_area_entity_1.GeoArea),
    (0, typeorm_1.JoinColumn)({ name: 'geo_area_id' }),
    __metadata("design:type", geo_area_entity_1.GeoArea)
], MaintenanceRequest.prototype, "geoArea", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => utility_type_entity_1.UtilityType),
    (0, typeorm_1.JoinColumn)({ name: 'utility_type_id' }),
    __metadata("design:type", utility_type_entity_1.UtilityType)
], MaintenanceRequest.prototype, "utilityType", void 0);
exports.MaintenanceRequest = MaintenanceRequest = __decorate([
    (0, typeorm_1.Entity)({ name: 'MaintenanceRequest' }),
    (0, typeorm_1.Index)('IX_MaintenanceRequest_customer', ['requestedByCustomerId']),
    (0, typeorm_1.Index)('IX_MaintenanceRequest_priority', ['priority']),
    (0, typeorm_1.Index)('IX_MaintenanceRequest_geo_area', ['geoAreaId']),
    (0, typeorm_1.Index)('IX_MaintenanceRequest_date', ['requestTs'])
], MaintenanceRequest);
//# sourceMappingURL=maintenance-request.entity.js.map