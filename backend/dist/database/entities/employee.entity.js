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
exports.Employee = void 0;
const typeorm_1 = require("typeorm");
const class_transformer_1 = require("class-transformer");
let Employee = class Employee {
    get fullName() {
        if (this.middleName) {
            return `${this.firstName} ${this.middleName} ${this.lastName}`;
        }
        return `${this.firstName} ${this.lastName}`;
    }
};
exports.Employee = Employee;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'employee_id', type: 'bigint' }),
    __metadata("design:type", Number)
], Employee.prototype, "employeeId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'first_name', type: 'varchar', length: 80 }),
    __metadata("design:type", String)
], Employee.prototype, "firstName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'middle_name', type: 'varchar', length: 80, nullable: true }),
    __metadata("design:type", Object)
], Employee.prototype, "middleName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'last_name', type: 'varchar', length: 80 }),
    __metadata("design:type", String)
], Employee.prototype, "lastName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'employee_no', type: 'varchar', length: 30, unique: true }),
    __metadata("design:type", String)
], Employee.prototype, "employeeNo", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'designation', type: 'varchar', length: 80 }),
    __metadata("design:type", String)
], Employee.prototype, "designation", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'role', type: 'varchar', length: 80 }),
    __metadata("design:type", String)
], Employee.prototype, "role", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'department_id', type: 'bigint' }),
    __metadata("design:type", Number)
], Employee.prototype, "departmentId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'email', type: 'varchar', length: 255, unique: true }),
    __metadata("design:type", String)
], Employee.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'username', type: 'varchar', length: 80, unique: true }),
    __metadata("design:type", String)
], Employee.prototype, "username", void 0);
__decorate([
    (0, class_transformer_1.Exclude)(),
    (0, typeorm_1.Column)({ name: 'password_hash', type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], Employee.prototype, "passwordHash", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'last_login_at', type: 'datetime2', nullable: true }),
    __metadata("design:type", Object)
], Employee.prototype, "lastLoginAt", void 0);
exports.Employee = Employee = __decorate([
    (0, typeorm_1.Entity)({ name: 'Employee' })
], Employee);
//# sourceMappingURL=employee.entity.js.map