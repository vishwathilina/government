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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssetsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const assets_service_1 = require("./assets.service");
const dto_1 = require("./dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let AssetsController = class AssetsController {
    constructor(assetsService) {
        this.assetsService = assetsService;
    }
    async create(createAssetDto) {
        const asset = await this.assetsService.create(createAssetDto);
        return {
            success: true,
            data: asset,
            message: 'Asset created successfully',
        };
    }
    async findAll(filters) {
        const result = await this.assetsService.findAll(filters);
        return {
            success: true,
            data: result.data,
            total: result.total,
            page: result.page,
            limit: result.limit,
            message: 'Assets retrieved successfully',
        };
    }
    async findOne(id) {
        const asset = await this.assetsService.findOne(id);
        return {
            success: true,
            data: this.toResponseDto(asset),
            message: 'Asset retrieved successfully',
        };
    }
    async update(id, updateAssetDto) {
        const asset = await this.assetsService.update(id, updateAssetDto);
        return {
            success: true,
            data: asset,
            message: 'Asset updated successfully',
        };
    }
    async remove(id) {
        await this.assetsService.remove(id);
        return {
            success: true,
            message: 'Asset deleted successfully',
        };
    }
    toResponseDto(asset) {
        return {
            assetId: asset.assetId,
            name: asset.name,
            assetType: asset.assetType,
            status: asset.status,
            utilityTypeId: asset.utilityTypeId,
            utilityType: asset.utilityType,
        };
    }
};
exports.AssetsController = AssetsController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new asset' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Asset created successfully', type: dto_1.AssetResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.CreateAssetDto]),
    __metadata("design:returntype", Promise)
], AssetsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all assets with filtering' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Assets retrieved successfully' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.AssetFilterDto]),
    __metadata("design:returntype", Promise)
], AssetsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get asset by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Asset found', type: dto_1.AssetResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Asset not found' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AssetsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update an asset' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Asset updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Asset not found' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, dto_1.UpdateAssetDto]),
    __metadata("design:returntype", Promise)
], AssetsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete an asset (soft delete)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Asset deleted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Asset not found' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AssetsController.prototype, "remove", null);
exports.AssetsController = AssetsController = __decorate([
    (0, swagger_1.ApiTags)('Assets'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('api/v1/assets'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [assets_service_1.AssetsService])
], AssetsController);
//# sourceMappingURL=assets.controller.js.map