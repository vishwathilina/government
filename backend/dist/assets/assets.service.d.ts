import { Repository } from 'typeorm';
import { Asset } from '../database/entities/asset.entity';
import { CreateAssetDto, UpdateAssetDto, AssetResponseDto, AssetFilterDto } from './dto';
export declare class AssetsService {
    private assetRepository;
    constructor(assetRepository: Repository<Asset>);
    create(createAssetDto: CreateAssetDto): Promise<AssetResponseDto>;
    findAll(filters: AssetFilterDto): Promise<{
        data: AssetResponseDto[];
        total: number;
        page: number;
        limit: number;
    }>;
    findOne(id: number): Promise<Asset>;
    update(id: number, updateAssetDto: UpdateAssetDto): Promise<AssetResponseDto>;
    remove(id: number): Promise<void>;
    getByType(assetType: string): Promise<AssetResponseDto[]>;
    getByUtilityType(utilityTypeId: number): Promise<AssetResponseDto[]>;
    private toResponseDto;
}
