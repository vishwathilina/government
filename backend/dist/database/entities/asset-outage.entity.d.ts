import { Asset } from './asset.entity';
export declare enum AssetOutageType {
    FULL = "FULL",
    PARTIAL = "PARTIAL"
}
export declare class AssetOutage {
    outageId: number;
    assetId: number;
    outageType: AssetOutageType;
    startTs: Date;
    endTs: Date | null;
    reason: string | null;
    deratePercent: number | null;
    asset: Asset;
    get isActive(): boolean;
    get durationHours(): number | null;
}
