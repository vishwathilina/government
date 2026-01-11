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
exports.CustomerPhone = void 0;
const typeorm_1 = require("typeorm");
const customer_entity_1 = require("./customer.entity");
let CustomerPhone = class CustomerPhone {
};
exports.CustomerPhone = CustomerPhone;
__decorate([
    (0, typeorm_1.PrimaryColumn)({ name: 'customer_id', type: 'bigint' }),
    __metadata("design:type", Number)
], CustomerPhone.prototype, "customerId", void 0);
__decorate([
    (0, typeorm_1.PrimaryColumn)({ name: 'phone', type: 'varchar', length: 30 }),
    __metadata("design:type", String)
], CustomerPhone.prototype, "phone", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => customer_entity_1.Customer, (customer) => customer.phoneNumbers, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'customer_id' }),
    __metadata("design:type", customer_entity_1.Customer)
], CustomerPhone.prototype, "customer", void 0);
exports.CustomerPhone = CustomerPhone = __decorate([
    (0, typeorm_1.Entity)({ name: 'CustomerPhoneNumbers' })
], CustomerPhone);
//# sourceMappingURL=customer-phone.entity.js.map