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
exports.AssetsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const asset_entity_1 = require("../database/entities/asset.entity");
let AssetsService = class AssetsService {
    constructor(assetRepository) {
        this.assetRepository = assetRepository;
    }
    async create(createAssetDto) {
        const asset = this.assetRepository.create(createAssetDto);
        const saved = await this.assetRepository.save(asset);
        return this.toResponseDto(await this.findOne(saved.assetId));
    }
    async findAll(filters) {
        const { search, assetType, status, utilityTypeId, page = 1, limit = 10, sortBy = 'assetId', order = 'ASC' } = filters;
        const queryBuilder = this.assetRepository
            .createQueryBuilder('asset')
            .leftJoinAndSelect('asset.utilityType', 'utilityType');
        if (search) {
            queryBuilder.andWhere('asset.name LIKE :search', { search: `%${search}%` });
        }
        if (assetType) {
            queryBuilder.andWhere('asset.assetType = :assetType', { assetType });
        }
        if (status) {
            queryBuilder.andWhere('asset.status = :status', { status });
        }
        if (utilityTypeId) {
            queryBuilder.andWhere('asset.utilityTypeId = :utilityTypeId', { utilityTypeId });
        }
        const total = await queryBuilder.getCount();
        const assets = await queryBuilder
            .orderBy(`asset.${sortBy}`, order)
            .skip((page - 1) * limit)
            .take(limit)
            .getMany();
        return {
            data: assets.map(asset => this.toResponseDto(asset)),
            total,
            page,
            limit,
        };
    }
    async findOne(id) {
        const asset = await this.assetRepository.findOne({
            where: { assetId: id },
            relations: ['utilityType'],
        });
        if (!asset) {
            throw new common_1.NotFoundException(`Asset with ID ${id} not found`);
        }
        return asset;
    }
    async update(id, updateAssetDto) {
        await this.findOne(id);
        await this.assetRepository.update(id, updateAssetDto);
        return this.toResponseDto(await this.findOne(id));
    }
    async remove(id) {
        const asset = await this.findOne(id);
        asset.status = 'RETIRED';
        await this.assetRepository.save(asset);
    }
    async getByType(assetType) {
        const assets = await this.assetRepository.find({
            where: { assetType },
            relations: ['utilityType'],
        });
        return assets.map(asset => this.toResponseDto(asset));
    }
    async getByUtilityType(utilityTypeId) {
        const assets = await this.assetRepository.find({
            where: { utilityTypeId },
            relations: ['utilityType'],
        });
        return assets.map(asset => this.toResponseDto(asset));
    }
    toResponseDto(asset) {
        return {
            assetId: asset.assetId,
            name: asset.name,
            assetType: asset.assetType,
            status: asset.status,
            utilityTypeId: asset.utilityTypeId,
            utilityType: asset.utilityType ? {
                utilityTypeId: asset.utilityType.utilityTypeId,
                code: asset.utilityType.code,
                name: asset.utilityType.name,
            } : undefined,
        };
    }
};
exports.AssetsService = AssetsService;
exports.AssetsService = AssetsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(asset_entity_1.Asset)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], AssetsService);
//# sourceMappingURL=assets.service.js.map