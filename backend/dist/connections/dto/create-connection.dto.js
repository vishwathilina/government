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
exports.CreateConnectionDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const swagger_1 = require("@nestjs/swagger");
const create_connection_address_dto_1 = require("./create-connection-address.dto");
class CreateConnectionDto {
}
exports.CreateConnectionDto = CreateConnectionDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Customer ID',
        example: 1,
    }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Customer ID is required' }),
    (0, class_validator_1.IsNumber)({}, { message: 'Customer ID must be a number' }),
    __metadata("design:type", Number)
], CreateConnectionDto.prototype, "customerId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Utility type ID (1=Electricity, 2=Water, 3=Gas)',
        example: 1,
    }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Utility type ID is required' }),
    (0, class_validator_1.IsNumber)({}, { message: 'Utility type ID must be a number' }),
    __metadata("design:type", Number)
], CreateConnectionDto.prototype, "utilityTypeId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Tariff category ID',
        example: 1,
    }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Tariff category ID is required' }),
    (0, class_validator_1.IsNumber)({}, { message: 'Tariff category ID must be a number' }),
    __metadata("design:type", Number)
], CreateConnectionDto.prototype, "tariffCategoryId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Connection address details',
        type: create_connection_address_dto_1.CreateConnectionAddressDto,
    }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Connection address is required' }),
    (0, class_validator_1.ValidateNested)({ message: 'Connection address validation failed' }),
    (0, class_transformer_1.Type)(() => create_connection_address_dto_1.CreateConnectionAddressDto),
    __metadata("design:type", create_connection_address_dto_1.CreateConnectionAddressDto)
], CreateConnectionDto.prototype, "connectionAddress", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Meter ID (optional - can be assigned later)',
        example: 1,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)({}, { message: 'Meter ID must be a number' }),
    __metadata("design:type", Number)
], CreateConnectionDto.prototype, "meterId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Network node ID (optional)',
        example: 1,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)({}, { message: 'Node ID must be a number' }),
    __metadata("design:type", Number)
], CreateConnectionDto.prototype, "nodeId", void 0);
//# sourceMappingURL=create-connection.dto.js.map