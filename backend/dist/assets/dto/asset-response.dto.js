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
exports.AssetResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const asset_entity_1 = require("../../database/entities/asset.entity");
class AssetResponseDto {
}
exports.AssetResponseDto = AssetResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Asset ID' }),
    __metadata("design:type", Number)
], AssetResponseDto.prototype, "assetId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Asset name' }),
    __metadata("design:type", String)
], AssetResponseDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Asset type' }),
    __metadata("design:type", String)
], AssetResponseDto.prototype, "assetType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Asset status', enum: asset_entity_1.AssetStatus }),
    __metadata("design:type", String)
], AssetResponseDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Utility type ID' }),
    __metadata("design:type", Number)
], AssetResponseDto.prototype, "utilityTypeId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Utility type details' }),
    __metadata("design:type", Object)
], AssetResponseDto.prototype, "utilityType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Total work orders count' }),
    __metadata("design:type", Number)
], AssetResponseDto.prototype, "totalWorkOrders", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Last maintenance date' }),
    __metadata("design:type", Date)
], AssetResponseDto.prototype, "lastMaintenanceDate", void 0);
//# sourceMappingURL=asset-response.dto.js.map