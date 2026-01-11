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
exports.Item = void 0;
const typeorm_1 = require("typeorm");
let Item = class Item {
};
exports.Item = Item;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'item_id', type: 'bigint' }),
    __metadata("design:type", Number)
], Item.prototype, "itemId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'name', type: 'varchar', length: 150 }),
    __metadata("design:type", String)
], Item.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'item_code', type: 'varchar', length: 50, unique: true }),
    __metadata("design:type", String)
], Item.prototype, "itemCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'description', type: 'nvarchar', length: 'MAX', nullable: true }),
    __metadata("design:type", Object)
], Item.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'unit_of_measure', type: 'varchar', length: 20 }),
    __metadata("design:type", String)
], Item.prototype, "unitOfMeasure", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'unit_cost', type: 'decimal', precision: 12, scale: 2 }),
    __metadata("design:type", Number)
], Item.prototype, "unitCost", void 0);
exports.Item = Item = __decorate([
    (0, typeorm_1.Entity)({ name: 'Item' })
], Item);
//# sourceMappingURL=item.entity.js.map