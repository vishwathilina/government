import { AssetsService } from './assets.service';
import { CreateAssetDto, UpdateAssetDto, AssetResponseDto, AssetFilterDto } from './dto';
export declare class AssetsController {
    private readonly assetsService;
    constructor(assetsService: AssetsService);
    create(createAssetDto: CreateAssetDto): Promise<{
        success: boolean;
        data: AssetResponseDto;
        message: string;
    }>;
    findAll(filters: AssetFilterDto): Promise<{
        success: boolean;
        data: AssetResponseDto[];
        total: number;
        page: number;
        limit: number;
        message: string;
    }>;
    findOne(id: number): Promise<{
        success: boolean;
        data: AssetResponseDto;
        message: string;
    }>;
    update(id: number, updateAssetDto: UpdateAssetDto): Promise<{
        success: boolean;
        data: AssetResponseDto;
        message: string;
    }>;
    remove(id: number): Promise<{
        success: boolean;
        message: string;
    }>;
    private toResponseDto;
}
