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
exports.LoginResponseDto = exports.LoginEmployeeDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class LoginEmployeeDto {
}
exports.LoginEmployeeDto = LoginEmployeeDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Employee ID', example: 1 }),
    __metadata("design:type", Number)
], LoginEmployeeDto.prototype, "employeeId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'First name', example: 'John' }),
    __metadata("design:type", String)
], LoginEmployeeDto.prototype, "firstName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Middle name', example: 'Michael', nullable: true }),
    __metadata("design:type", Object)
], LoginEmployeeDto.prototype, "middleName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Last name', example: 'Doe' }),
    __metadata("design:type", String)
], LoginEmployeeDto.prototype, "lastName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Full name', example: 'John Michael Doe' }),
    __metadata("design:type", String)
], LoginEmployeeDto.prototype, "fullName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Employee number', example: 'EMP001' }),
    __metadata("design:type", String)
], LoginEmployeeDto.prototype, "employeeNo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Job designation', example: 'Senior Engineer' }),
    __metadata("design:type", String)
], LoginEmployeeDto.prototype, "designation", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Role in the system', example: 'Manager' }),
    __metadata("design:type", String)
], LoginEmployeeDto.prototype, "role", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Department ID', example: 1 }),
    __metadata("design:type", Number)
], LoginEmployeeDto.prototype, "departmentId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Email address', example: 'john.doe@utility.gov' }),
    __metadata("design:type", String)
], LoginEmployeeDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Username', example: 'johndoe' }),
    __metadata("design:type", String)
], LoginEmployeeDto.prototype, "username", void 0);
class LoginResponseDto {
}
exports.LoginResponseDto = LoginResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'JWT access token',
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    }),
    __metadata("design:type", String)
], LoginResponseDto.prototype, "accessToken", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Token type',
        example: 'Bearer',
    }),
    __metadata("design:type", String)
], LoginResponseDto.prototype, "tokenType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Authenticated employee data',
        type: LoginEmployeeDto,
    }),
    __metadata("design:type", LoginEmployeeDto)
], LoginResponseDto.prototype, "employee", void 0);
//# sourceMappingURL=login-response.dto.js.map