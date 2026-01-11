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
exports.CreateCustomerDto = exports.CreateCustomerAddressDto = exports.IdentityType = exports.CustomerType = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const swagger_1 = require("@nestjs/swagger");
var CustomerType;
(function (CustomerType) {
    CustomerType["RESIDENTIAL"] = "RESIDENTIAL";
    CustomerType["COMMERCIAL"] = "COMMERCIAL";
    CustomerType["INDUSTRIAL"] = "INDUSTRIAL";
    CustomerType["GOVERNMENT"] = "GOVERNMENT";
})(CustomerType || (exports.CustomerType = CustomerType = {}));
var IdentityType;
(function (IdentityType) {
    IdentityType["NIC"] = "NIC";
    IdentityType["PASSPORT"] = "PASSPORT";
    IdentityType["DRIVING_LICENSE"] = "DRIVING_LICENSE";
    IdentityType["BUSINESS_REG"] = "BUSINESS_REG";
})(IdentityType || (exports.IdentityType = IdentityType = {}));
class CreateCustomerAddressDto {
}
exports.CreateCustomerAddressDto = CreateCustomerAddressDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Postal code', example: '10100', maxLength: 20 }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Postal code is required' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(20),
    __metadata("design:type", String)
], CreateCustomerAddressDto.prototype, "postalCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Address line 1',
        example: '123 Main Street, Apartment 4B',
        maxLength: 200,
    }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Address line 1 is required' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(200),
    __metadata("design:type", String)
], CreateCustomerAddressDto.prototype, "line1", void 0);
class CreateCustomerDto {
}
exports.CreateCustomerDto = CreateCustomerDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'First name', example: 'John', maxLength: 80 }),
    (0, class_validator_1.IsNotEmpty)({ message: 'First name is required' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(80),
    __metadata("design:type", String)
], CreateCustomerDto.prototype, "firstName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Middle name',
        example: 'William',
        maxLength: 80,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(80),
    __metadata("design:type", String)
], CreateCustomerDto.prototype, "middleName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Last name', example: 'Doe', maxLength: 80 }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Last name is required' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(80),
    __metadata("design:type", String)
], CreateCustomerDto.prototype, "lastName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Email address',
        example: 'john.doe@example.com',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEmail)({}, { message: 'Invalid email format' }),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], CreateCustomerDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Password (min 6 characters)',
        example: 'securePassword123',
        minLength: 6,
    }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Password is required' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(6, { message: 'Password must be at least 6 characters' }),
    __metadata("design:type", String)
], CreateCustomerDto.prototype, "password", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Customer type',
        enum: CustomerType,
        example: CustomerType.RESIDENTIAL,
    }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Customer type is required' }),
    (0, class_validator_1.IsEnum)(CustomerType, { message: 'Invalid customer type' }),
    __metadata("design:type", String)
], CreateCustomerDto.prototype, "customerType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Identity document type',
        enum: IdentityType,
        example: IdentityType.NIC,
    }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Identity type is required' }),
    (0, class_validator_1.IsEnum)(IdentityType, { message: 'Invalid identity type' }),
    __metadata("design:type", String)
], CreateCustomerDto.prototype, "identityType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Identity reference number (unique)',
        example: '123456789V',
        maxLength: 80,
    }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Identity reference is required' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(80),
    __metadata("design:type", String)
], CreateCustomerDto.prototype, "identityRef", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Customer address',
        type: CreateCustomerAddressDto,
    }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Address is required' }),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => CreateCustomerAddressDto),
    __metadata("design:type", CreateCustomerAddressDto)
], CreateCustomerDto.prototype, "address", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Phone numbers',
        type: [String],
        example: ['+1234567890', '+0987654321'],
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.MaxLength)(30, { each: true }),
    __metadata("design:type", Array)
], CreateCustomerDto.prototype, "phoneNumbers", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Default tariff category ID',
        example: 1,
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateCustomerDto.prototype, "tariffCategoryId", void 0);
//# sourceMappingURL=create-customer.dto.js.map