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
exports.CustomerResponseDto = exports.CustomerAddressResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class CustomerAddressResponseDto {
}
exports.CustomerAddressResponseDto = CustomerAddressResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Address ID', example: 1 }),
    __metadata("design:type", Number)
], CustomerAddressResponseDto.prototype, "customerAddressId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Postal code', example: '10100' }),
    __metadata("design:type", String)
], CustomerAddressResponseDto.prototype, "postalCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Address line 1', example: '123 Main Street' }),
    __metadata("design:type", String)
], CustomerAddressResponseDto.prototype, "line1", void 0);
class CustomerResponseDto {
    static fromEntity(customer) {
        const dto = new CustomerResponseDto();
        dto.customerId = customer.customerId;
        dto.firstName = customer.firstName;
        dto.middleName = customer.middleName;
        dto.lastName = customer.lastName;
        dto.fullName = customer.fullName;
        dto.email = customer.email;
        dto.customerType = customer.customerType;
        dto.registrationDate = customer.registrationDate;
        dto.identityType = customer.identityType;
        dto.identityRef = customer.identityRef;
        dto.tariffCategoryId = customer.tariffCategoryId;
        dto.employeeId = customer.employeeId;
        if (customer.address) {
            dto.address = {
                customerAddressId: customer.address.customerAddressId,
                postalCode: customer.address.postalCode,
                line1: customer.address.line1,
            };
        }
        dto.phoneNumbers = customer.phoneNumbers?.map((p) => p.phone) || [];
        return dto;
    }
}
exports.CustomerResponseDto = CustomerResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Customer ID', example: 1 }),
    __metadata("design:type", Number)
], CustomerResponseDto.prototype, "customerId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'First name', example: 'John' }),
    __metadata("design:type", String)
], CustomerResponseDto.prototype, "firstName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Middle name', example: 'William' }),
    __metadata("design:type", Object)
], CustomerResponseDto.prototype, "middleName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Last name', example: 'Doe' }),
    __metadata("design:type", String)
], CustomerResponseDto.prototype, "lastName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Full name', example: 'John William Doe' }),
    __metadata("design:type", String)
], CustomerResponseDto.prototype, "fullName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Email address',
        example: 'john.doe@example.com',
    }),
    __metadata("design:type", Object)
], CustomerResponseDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Customer type', example: 'RESIDENTIAL' }),
    __metadata("design:type", String)
], CustomerResponseDto.prototype, "customerType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Registration date',
        example: '2024-01-15',
    }),
    __metadata("design:type", Date)
], CustomerResponseDto.prototype, "registrationDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Identity type', example: 'NIC' }),
    __metadata("design:type", String)
], CustomerResponseDto.prototype, "identityType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Identity reference', example: '123456789V' }),
    __metadata("design:type", String)
], CustomerResponseDto.prototype, "identityRef", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Tariff category ID', example: 1 }),
    __metadata("design:type", Object)
], CustomerResponseDto.prototype, "tariffCategoryId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Registered by employee ID', example: 1 }),
    __metadata("design:type", Object)
], CustomerResponseDto.prototype, "employeeId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Customer address', type: CustomerAddressResponseDto }),
    __metadata("design:type", CustomerAddressResponseDto)
], CustomerResponseDto.prototype, "address", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Phone numbers',
        type: [String],
        example: ['+1234567890'],
    }),
    __metadata("design:type", Array)
], CustomerResponseDto.prototype, "phoneNumbers", void 0);
//# sourceMappingURL=customer-response.dto.js.map