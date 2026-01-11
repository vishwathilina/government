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
exports.CreateAssetDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const asset_entity_1 = require("../../database/entities/asset.entity");
class CreateAssetDto {
}
exports.CreateAssetDto = CreateAssetDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Asset name', example: 'Transformer Station A1', maxLength: 150 }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Asset name is required' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(150),
    __metadata("design:type", String)
], CreateAssetDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Asset type', example: 'TRANSFORMER', maxLength: 50 }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Asset type is required' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(50),
    __metadata("design:type", String)
], CreateAssetDto.prototype, "assetType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Asset status',
        enum: asset_entity_1.AssetStatus,
        example: asset_entity_1.AssetStatus.ACTIVE
    }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Asset status is required' }),
    (0, class_validator_1.IsEnum)(asset_entity_1.AssetStatus),
    __metadata("design:type", String)
], CreateAssetDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Utility type ID', example: 1 }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Utility type ID is required' }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateAssetDto.prototype, "utilityTypeId", void 0);
//# sourceMappingURL=create-asset.dto.js.map