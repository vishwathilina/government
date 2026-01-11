import { AssetStatus } from '../../database/entities/asset.entity';
export declare class AssetFilterDto {
    search?: string;
    assetType?: string;
    status?: AssetStatus;
    utilityTypeId?: number;
    page?: number;
    limit?: number;
    sortBy?: string;
    order?: 'ASC' | 'DESC';
}
