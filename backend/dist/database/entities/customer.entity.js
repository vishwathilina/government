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
exports.Customer = void 0;
const typeorm_1 = require("typeorm");
const class_transformer_1 = require("class-transformer");
const customer_address_entity_1 = require("./customer-address.entity");
const customer_phone_entity_1 = require("./customer-phone.entity");
const employee_entity_1 = require("./employee.entity");
const tariff_category_entity_1 = require("./tariff-category.entity");
const service_connection_entity_1 = require("./service-connection.entity");
let Customer = class Customer {
    get fullName() {
        if (this.middleName) {
            return `${this.firstName} ${this.middleName} ${this.lastName}`;
        }
        return `${this.firstName} ${this.lastName}`;
    }
};
exports.Customer = Customer;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'customer_id', type: 'bigint' }),
    __metadata("design:type", Number)
], Customer.prototype, "customerId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'first_name', type: 'varchar', length: 80 }),
    __metadata("design:type", String)
], Customer.prototype, "firstName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'middle_name', type: 'varchar', length: 80, nullable: true }),
    __metadata("design:type", Object)
], Customer.prototype, "middleName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'last_name', type: 'varchar', length: 80 }),
    __metadata("design:type", String)
], Customer.prototype, "lastName", void 0);
__decorate([
    (0, class_transformer_1.Exclude)(),
    (0, typeorm_1.Column)({ name: 'password_hash', type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], Customer.prototype, "passwordHash", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'email', type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", Object)
], Customer.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'customer_address_id', type: 'bigint' }),
    __metadata("design:type", Number)
], Customer.prototype, "customerAddressId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'customer_type', type: 'varchar', length: 30 }),
    __metadata("design:type", String)
], Customer.prototype, "customerType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'registration_date', type: 'date' }),
    __metadata("design:type", Date)
], Customer.prototype, "registrationDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'identity_type', type: 'varchar', length: 30 }),
    __metadata("design:type", String)
], Customer.prototype, "identityType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'identity_ref', type: 'varchar', length: 80, unique: true }),
    __metadata("design:type", String)
], Customer.prototype, "identityRef", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'employee_id', type: 'bigint', nullable: true }),
    __metadata("design:type", Object)
], Customer.prototype, "employeeId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'tariff_category_id', type: 'bigint', nullable: true }),
    __metadata("design:type", Object)
], Customer.prototype, "tariffCategoryId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => customer_address_entity_1.CustomerAddress, { eager: true }),
    (0, typeorm_1.JoinColumn)({ name: 'customer_address_id' }),
    __metadata("design:type", customer_address_entity_1.CustomerAddress)
], Customer.prototype, "address", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => employee_entity_1.Employee),
    (0, typeorm_1.JoinColumn)({ name: 'employee_id' }),
    __metadata("design:type", employee_entity_1.Employee)
], Customer.prototype, "registeredBy", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => tariff_category_entity_1.TariffCategory, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'tariff_category_id' }),
    __metadata("design:type", Object)
], Customer.prototype, "tariffCategory", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => customer_phone_entity_1.CustomerPhone, (phone) => phone.customer, { eager: true }),
    __metadata("design:type", Array)
], Customer.prototype, "phoneNumbers", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => service_connection_entity_1.ServiceConnection, (connection) => connection.customer),
    __metadata("design:type", Array)
], Customer.prototype, "serviceConnections", void 0);
exports.Customer = Customer = __decorate([
    (0, typeorm_1.Entity)({ name: 'Customer' })
], Customer);
//# sourceMappingURL=customer.entity.js.map