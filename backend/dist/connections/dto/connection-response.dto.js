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
exports.ConnectionResponseDto = exports.CustomerInfoResponseDto = exports.MeterResponseDto = exports.TariffCategoryResponseDto = exports.UtilityTypeResponseDto = exports.ConnectionAddressResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const service_connection_entity_1 = require("../../database/entities/service-connection.entity");
class ConnectionAddressResponseDto {
}
exports.ConnectionAddressResponseDto = ConnectionAddressResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1 }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Number)
], ConnectionAddressResponseDto.prototype, "connectionAddressId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '123 Main Street' }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], ConnectionAddressResponseDto.prototype, "line1", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Colombo' }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], ConnectionAddressResponseDto.prototype, "city", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '00100' }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], ConnectionAddressResponseDto.prototype, "postalCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1 }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Number)
], ConnectionAddressResponseDto.prototype, "geoAreaId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Colombo District' }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], ConnectionAddressResponseDto.prototype, "geoAreaName", void 0);
class UtilityTypeResponseDto {
}
exports.UtilityTypeResponseDto = UtilityTypeResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1 }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Number)
], UtilityTypeResponseDto.prototype, "utilityTypeId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'ELEC' }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], UtilityTypeResponseDto.prototype, "code", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Electricity' }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], UtilityTypeResponseDto.prototype, "name", void 0);
class TariffCategoryResponseDto {
}
exports.TariffCategoryResponseDto = TariffCategoryResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1 }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Number)
], TariffCategoryResponseDto.prototype, "tariffCategoryId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'RES-STD' }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], TariffCategoryResponseDto.prototype, "code", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Residential Standard' }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], TariffCategoryResponseDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: false }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Boolean)
], TariffCategoryResponseDto.prototype, "isSubsidized", void 0);
class MeterResponseDto {
}
exports.MeterResponseDto = MeterResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1 }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Number)
], MeterResponseDto.prototype, "meterId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'MTR-2024-001234' }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], MeterResponseDto.prototype, "meterSerialNo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: true }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Boolean)
], MeterResponseDto.prototype, "isSmartMeter", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'ACTIVE' }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], MeterResponseDto.prototype, "status", void 0);
class CustomerInfoResponseDto {
}
exports.CustomerInfoResponseDto = CustomerInfoResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1 }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Number)
], CustomerInfoResponseDto.prototype, "customerId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'John Doe' }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], CustomerInfoResponseDto.prototype, "fullName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'RESIDENTIAL' }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], CustomerInfoResponseDto.prototype, "customerType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'john.doe@example.com' }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], CustomerInfoResponseDto.prototype, "email", void 0);
class ConnectionResponseDto {
    static fromEntity(connection) {
        const dto = new ConnectionResponseDto();
        dto.connectionId = connection.connectionId;
        dto.customerId = connection.customerId;
        dto.utilityTypeId = connection.utilityTypeId;
        dto.tariffCategoryId = connection.tariffCategoryId;
        dto.connectionStatus = connection.connectionStatus;
        dto.meterId = connection.meterId;
        dto.connectionAddressId = connection.connectionAddressId;
        dto.nodeId = connection.nodeId;
        if (connection.customer) {
            dto.customer = {
                customerId: connection.customer.customerId,
                fullName: connection.customer.fullName,
                customerType: connection.customer.customerType,
                email: connection.customer.email || undefined,
            };
        }
        if (connection.utilityType) {
            dto.utilityType = {
                utilityTypeId: connection.utilityType.utilityTypeId,
                code: connection.utilityType.code,
                name: connection.utilityType.name,
            };
        }
        if (connection.tariffCategory) {
            dto.tariffCategory = {
                tariffCategoryId: connection.tariffCategory.tariffCategoryId,
                code: connection.tariffCategory.code,
                name: connection.tariffCategory.name,
                isSubsidized: connection.tariffCategory.isSubsidized,
            };
        }
        if (connection.meter) {
            dto.meter = {
                meterId: connection.meter.meterId,
                meterSerialNo: connection.meter.meterSerialNo,
                isSmartMeter: connection.meter.isSmartMeter,
                status: connection.meter.status,
            };
        }
        else {
            dto.meter = null;
        }
        if (connection.connectionAddress) {
            dto.connectionAddress = {
                connectionAddressId: connection.connectionAddress.connectionAddressId,
                line1: connection.connectionAddress.line1,
                city: connection.connectionAddress.city,
                postalCode: connection.connectionAddress.postalCode,
                geoAreaId: connection.connectionAddress.geoAreaId,
                geoAreaName: connection.connectionAddress.geoArea?.name,
            };
        }
        return dto;
    }
    static fromEntities(connections) {
        return connections.map((connection) => this.fromEntity(connection));
    }
}
exports.ConnectionResponseDto = ConnectionResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1 }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Number)
], ConnectionResponseDto.prototype, "connectionId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1 }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Number)
], ConnectionResponseDto.prototype, "customerId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1 }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Number)
], ConnectionResponseDto.prototype, "utilityTypeId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1 }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Number)
], ConnectionResponseDto.prototype, "tariffCategoryId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: service_connection_entity_1.ConnectionStatus, example: service_connection_entity_1.ConnectionStatus.ACTIVE }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], ConnectionResponseDto.prototype, "connectionStatus", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 1 }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Object)
], ConnectionResponseDto.prototype, "meterId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1 }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Number)
], ConnectionResponseDto.prototype, "connectionAddressId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 1 }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Object)
], ConnectionResponseDto.prototype, "nodeId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: CustomerInfoResponseDto }),
    (0, class_transformer_1.Expose)(),
    (0, class_transformer_1.Type)(() => CustomerInfoResponseDto),
    __metadata("design:type", CustomerInfoResponseDto)
], ConnectionResponseDto.prototype, "customer", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: UtilityTypeResponseDto }),
    (0, class_transformer_1.Expose)(),
    (0, class_transformer_1.Type)(() => UtilityTypeResponseDto),
    __metadata("design:type", UtilityTypeResponseDto)
], ConnectionResponseDto.prototype, "utilityType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: TariffCategoryResponseDto }),
    (0, class_transformer_1.Expose)(),
    (0, class_transformer_1.Type)(() => TariffCategoryResponseDto),
    __metadata("design:type", TariffCategoryResponseDto)
], ConnectionResponseDto.prototype, "tariffCategory", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: MeterResponseDto }),
    (0, class_transformer_1.Expose)(),
    (0, class_transformer_1.Type)(() => MeterResponseDto),
    __metadata("design:type", Object)
], ConnectionResponseDto.prototype, "meter", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: ConnectionAddressResponseDto }),
    (0, class_transformer_1.Expose)(),
    (0, class_transformer_1.Type)(() => ConnectionAddressResponseDto),
    __metadata("design:type", ConnectionAddressResponseDto)
], ConnectionResponseDto.prototype, "connectionAddress", void 0);
//# sourceMappingURL=connection-response.dto.js.map