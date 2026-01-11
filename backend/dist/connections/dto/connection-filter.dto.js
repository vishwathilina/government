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
exports.ConnectionFilterDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const swagger_1 = require("@nestjs/swagger");
const service_connection_entity_1 = require("../../database/entities/service-connection.entity");
class ConnectionFilterDto {
    constructor() {
        this.page = 1;
        this.limit = 10;
        this.sortBy = 'connectionId';
        this.order = 'DESC';
    }
}
exports.ConnectionFilterDto = ConnectionFilterDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Filter by customer ID',
        example: 1,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)({}, { message: 'Customer ID must be a number' }),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], ConnectionFilterDto.prototype, "customerId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Filter by utility type ID',
        example: 1,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)({}, { message: 'Utility type ID must be a number' }),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], ConnectionFilterDto.prototype, "utilityTypeId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Filter by tariff category ID',
        example: 1,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)({}, { message: 'Tariff category ID must be a number' }),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], ConnectionFilterDto.prototype, "tariffCategoryId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Filter by connection status',
        enum: service_connection_entity_1.ConnectionStatus,
        example: service_connection_entity_1.ConnectionStatus.ACTIVE,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(service_connection_entity_1.ConnectionStatus, {
        message: `Connection status must be one of: ${Object.values(service_connection_entity_1.ConnectionStatus).join(', ')}`,
    }),
    __metadata("design:type", String)
], ConnectionFilterDto.prototype, "connectionStatus", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Filter by city',
        example: 'Colombo',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'City must be a string' }),
    __metadata("design:type", String)
], ConnectionFilterDto.prototype, "city", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Filter by meter serial number (partial match)',
        example: 'MTR-2024',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Meter serial must be a string' }),
    __metadata("design:type", String)
], ConnectionFilterDto.prototype, "meterSerial", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Search by customer name (partial match)',
        example: 'John',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Customer name must be a string' }),
    __metadata("design:type", String)
], ConnectionFilterDto.prototype, "customerName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Page number',
        default: 1,
        minimum: 1,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)({}, { message: 'Page must be a number' }),
    (0, class_validator_1.Min)(1, { message: 'Page must be at least 1' }),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], ConnectionFilterDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Items per page',
        default: 10,
        minimum: 1,
        maximum: 100,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)({}, { message: 'Limit must be a number' }),
    (0, class_validator_1.Min)(1, { message: 'Limit must be at least 1' }),
    (0, class_validator_1.Max)(100, { message: 'Limit must not exceed 100' }),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], ConnectionFilterDto.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Sort by field',
        example: 'connectionId',
        enum: ['connectionId', 'customerId', 'connectionStatus', 'city'],
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Sort by must be a string' }),
    __metadata("design:type", String)
], ConnectionFilterDto.prototype, "sortBy", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Sort order',
        example: 'DESC',
        enum: ['ASC', 'DESC'],
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(['ASC', 'DESC'], { message: 'Order must be ASC or DESC' }),
    __metadata("design:type", String)
], ConnectionFilterDto.prototype, "order", void 0);
//# sourceMappingURL=connection-filter.dto.js.map