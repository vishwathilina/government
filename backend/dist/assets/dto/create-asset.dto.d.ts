import { AssetStatus } from '../../database/entities/asset.entity';
export declare class CreateAssetDto {
    name: string;
    assetType: string;
    status: AssetStatus;
    utilityTypeId: number;
}
