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
exports.CreateConnectionAddressDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class CreateConnectionAddressDto {
}
exports.CreateConnectionAddressDto = CreateConnectionAddressDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Address line 1',
        example: '123 Main Street',
        maxLength: 200,
    }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Address line 1 is required' }),
    (0, class_validator_1.IsString)({ message: 'Address line 1 must be a string' }),
    (0, class_validator_1.MaxLength)(200, { message: 'Address line 1 must not exceed 200 characters' }),
    __metadata("design:type", String)
], CreateConnectionAddressDto.prototype, "line1", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'City name',
        example: 'Colombo',
        maxLength: 120,
    }),
    (0, class_validator_1.IsNotEmpty)({ message: 'City is required' }),
    (0, class_validator_1.IsString)({ message: 'City must be a string' }),
    (0, class_validator_1.MaxLength)(120, { message: 'City must not exceed 120 characters' }),
    __metadata("design:type", String)
], CreateConnectionAddressDto.prototype, "city", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Postal code',
        example: '00100',
        maxLength: 20,
    }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Postal code is required' }),
    (0, class_validator_1.IsString)({ message: 'Postal code must be a string' }),
    (0, class_validator_1.MaxLength)(20, { message: 'Postal code must not exceed 20 characters' }),
    __metadata("design:type", String)
], CreateConnectionAddressDto.prototype, "postalCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Geographic area ID',
        example: 1,
    }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Geo area ID is required' }),
    (0, class_validator_1.IsNumber)({}, { message: 'Geo area ID must be a number' }),
    __metadata("design:type", Number)
], CreateConnectionAddressDto.prototype, "geoAreaId", void 0);
//# sourceMappingURL=create-connection-address.dto.js.map