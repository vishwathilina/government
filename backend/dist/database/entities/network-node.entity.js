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
exports.NetworkNode = void 0;
const typeorm_1 = require("typeorm");
const utility_type_entity_1 = require("./utility-type.entity");
let NetworkNode = class NetworkNode {
};
exports.NetworkNode = NetworkNode;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'node_id', type: 'bigint' }),
    __metadata("design:type", Number)
], NetworkNode.prototype, "nodeId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'name', type: 'varchar', length: 120 }),
    __metadata("design:type", String)
], NetworkNode.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Index)('IX_NetworkNode_status'),
    (0, typeorm_1.Column)({ name: 'status', type: 'varchar', length: 30 }),
    __metadata("design:type", String)
], NetworkNode.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'node_type', type: 'varchar', length: 50 }),
    __metadata("design:type", String)
], NetworkNode.prototype, "nodeType", void 0);
__decorate([
    (0, typeorm_1.Index)('IX_NetworkNode_utility_type'),
    (0, typeorm_1.Column)({ name: 'utility_type_id', type: 'bigint' }),
    __metadata("design:type", Number)
], NetworkNode.prototype, "utilityTypeId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => utility_type_entity_1.UtilityType),
    (0, typeorm_1.JoinColumn)({ name: 'utility_type_id' }),
    __metadata("design:type", utility_type_entity_1.UtilityType)
], NetworkNode.prototype, "utilityType", void 0);
exports.NetworkNode = NetworkNode = __decorate([
    (0, typeorm_1.Entity)({ name: 'NetworkNode' })
], NetworkNode);
//# sourceMappingURL=network-node.entity.js.map