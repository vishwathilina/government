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
exports.EmployeeResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class EmployeeResponseDto {
    static fromEntity(employee) {
        const dto = new EmployeeResponseDto();
        dto.employeeId = employee.employeeId;
        dto.firstName = employee.firstName;
        dto.middleName = employee.middleName;
        dto.lastName = employee.lastName;
        dto.fullName = employee.fullName;
        dto.employeeNo = employee.employeeNo;
        dto.designation = employee.designation;
        dto.role = employee.role;
        dto.departmentId = employee.departmentId;
        dto.email = employee.email;
        dto.username = employee.username;
        dto.lastLoginAt = employee.lastLoginAt;
        return dto;
    }
}
exports.EmployeeResponseDto = EmployeeResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Employee ID', example: 1 }),
    __metadata("design:type", Number)
], EmployeeResponseDto.prototype, "employeeId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'First name', example: 'John' }),
    __metadata("design:type", String)
], EmployeeResponseDto.prototype, "firstName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Middle name', example: 'Michael', nullable: true }),
    __metadata("design:type", Object)
], EmployeeResponseDto.prototype, "middleName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Last name', example: 'Doe' }),
    __metadata("design:type", String)
], EmployeeResponseDto.prototype, "lastName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Full name', example: 'John Michael Doe' }),
    __metadata("design:type", String)
], EmployeeResponseDto.prototype, "fullName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Employee number', example: 'EMP001' }),
    __metadata("design:type", String)
], EmployeeResponseDto.prototype, "employeeNo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Job designation', example: 'Senior Engineer' }),
    __metadata("design:type", String)
], EmployeeResponseDto.prototype, "designation", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Role in the system', example: 'Manager' }),
    __metadata("design:type", String)
], EmployeeResponseDto.prototype, "role", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Department ID', example: 1 }),
    __metadata("design:type", Number)
], EmployeeResponseDto.prototype, "departmentId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Email address', example: 'john.doe@utility.gov' }),
    __metadata("design:type", String)
], EmployeeResponseDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Username for login', example: 'johndoe' }),
    __metadata("design:type", String)
], EmployeeResponseDto.prototype, "username", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Last login timestamp',
        example: '2024-01-15T10:30:00Z',
        nullable: true,
    }),
    __metadata("design:type", Object)
], EmployeeResponseDto.prototype, "lastLoginAt", void 0);
//# sourceMappingURL=employee-response.dto.js.map