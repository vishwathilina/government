import { UtilityType } from './utility-type.entity';
export declare enum AssetStatus {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
    MAINTENANCE = "MAINTENANCE",
    RETIRED = "RETIRED"
}
export declare class Asset {
    assetId: number;
    name: string;
    assetType: string;
    status: AssetStatus;
    utilityTypeId: number;
    utilityType: UtilityType;
}
