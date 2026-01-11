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
exports.ServiceConnection = exports.ConnectionStatus = void 0;
const typeorm_1 = require("typeorm");
const customer_entity_1 = require("./customer.entity");
const utility_type_entity_1 = require("./utility-type.entity");
const tariff_category_entity_1 = require("./tariff-category.entity");
const meter_entity_1 = require("./meter.entity");
const connection_address_entity_1 = require("./connection-address.entity");
const network_node_entity_1 = require("./network-node.entity");
var ConnectionStatus;
(function (ConnectionStatus) {
    ConnectionStatus["ACTIVE"] = "ACTIVE";
    ConnectionStatus["INACTIVE"] = "INACTIVE";
    ConnectionStatus["SUSPENDED"] = "SUSPENDED";
    ConnectionStatus["DISCONNECTED"] = "DISCONNECTED";
    ConnectionStatus["PENDING"] = "PENDING";
})(ConnectionStatus || (exports.ConnectionStatus = ConnectionStatus = {}));
let ServiceConnection = class ServiceConnection {
};
exports.ServiceConnection = ServiceConnection;
__decorate([
    (0, typeorm_1.Column)({ name: 'connection_date', type: 'datetime2', nullable: true }),
    __metadata("design:type", Object)
], ServiceConnection.prototype, "connectionDate", void 0);
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'connection_id', type: 'bigint' }),
    __metadata("design:type", Number)
], ServiceConnection.prototype, "connectionId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'customer_id', type: 'bigint' }),
    __metadata("design:type", Number)
], ServiceConnection.prototype, "customerId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'utility_type_id', type: 'bigint' }),
    __metadata("design:type", Number)
], ServiceConnection.prototype, "utilityTypeId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'tariff_category_id', type: 'bigint' }),
    __metadata("design:type", Number)
], ServiceConnection.prototype, "tariffCategoryId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'connection_status',
        type: 'varchar',
        length: 30,
        default: ConnectionStatus.PENDING,
    }),
    __metadata("design:type", String)
], ServiceConnection.prototype, "connectionStatus", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'meter_id', type: 'bigint', nullable: true }),
    __metadata("design:type", Object)
], ServiceConnection.prototype, "meterId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'connection_address_id', type: 'bigint' }),
    __metadata("design:type", Number)
], ServiceConnection.prototype, "connectionAddressId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'node_id', type: 'bigint', nullable: true }),
    __metadata("design:type", Object)
], ServiceConnection.prototype, "nodeId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => customer_entity_1.Customer),
    (0, typeorm_1.JoinColumn)({ name: 'customer_id' }),
    __metadata("design:type", customer_entity_1.Customer)
], ServiceConnection.prototype, "customer", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => utility_type_entity_1.UtilityType),
    (0, typeorm_1.JoinColumn)({ name: 'utility_type_id' }),
    __metadata("design:type", utility_type_entity_1.UtilityType)
], ServiceConnection.prototype, "utilityType", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => tariff_category_entity_1.TariffCategory),
    (0, typeorm_1.JoinColumn)({ name: 'tariff_category_id' }),
    __metadata("design:type", tariff_category_entity_1.TariffCategory)
], ServiceConnection.prototype, "tariffCategory", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => meter_entity_1.Meter, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'meter_id' }),
    __metadata("design:type", Object)
], ServiceConnection.prototype, "meter", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => connection_address_entity_1.ConnectionAddress),
    (0, typeorm_1.JoinColumn)({ name: 'connection_address_id' }),
    __metadata("design:type", connection_address_entity_1.ConnectionAddress)
], ServiceConnection.prototype, "connectionAddress", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => network_node_entity_1.NetworkNode, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'node_id' }),
    __metadata("design:type", Object)
], ServiceConnection.prototype, "networkNode", void 0);
exports.ServiceConnection = ServiceConnection = __decorate([
    (0, typeorm_1.Entity)({ name: 'ServiceConnection' }),
    (0, typeorm_1.Index)('IX_ServiceConnection_customer', ['customerId']),
    (0, typeorm_1.Index)('IX_ServiceConnection_meter', ['meterId']),
    (0, typeorm_1.Index)('IX_ServiceConnection_status', ['connectionStatus']),
    (0, typeorm_1.Index)('IX_ServiceConnection_utility_tariff', ['utilityTypeId', 'tariffCategoryId'])
], ServiceConnection);
//# sourceMappingURL=service-connection.entity.js.map