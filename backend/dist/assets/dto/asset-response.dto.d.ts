import { AssetStatus } from '../../database/entities/asset.entity';
export declare class AssetResponseDto {
    assetId: number;
    name: string;
    assetType: string;
    status: AssetStatus;
    utilityTypeId: number;
    utilityType?: {
        utilityTypeId: number;
        code: string;
        name: string;
    };
    totalWorkOrders?: number;
    lastMaintenanceDate?: Date;
}
