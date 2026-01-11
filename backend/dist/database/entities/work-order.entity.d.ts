import { Asset } from './asset.entity';
import { MaintenanceRequest } from './maintenance-request.entity';
import { GeoArea } from './geo-area.entity';
import { WorkOrderLabor } from './work-order-labor.entity';
import { WorkOrderItemUsage } from './work-order-item-usage.entity';
export declare enum WorkOrderStatus {
    OPEN = "OPEN",
    ASSIGNED = "ASSIGNED",
    IN_PROGRESS = "IN_PROGRESS",
    ON_HOLD = "ON_HOLD",
    COMPLETED = "COMPLETED",
    CANCELLED = "CANCELLED"
}
export declare class WorkOrder {
    workOrderId: number;
    openedTs: Date;
    scheduledStartTs: Date | null;
    scheduledEndTs: Date | null;
    closedTs: Date | null;
    workOrderStatus: WorkOrderStatus;
    resolutionNotes: string | null;
    assetId: number | null;
    requestId: number | null;
    geoAreaId: number;
    asset: Asset | null;
    request: MaintenanceRequest | null;
    geoArea: GeoArea;
    laborEntries: WorkOrderLabor[];
    itemUsages: WorkOrderItemUsage[];
    get totalLaborCost(): number;
    get totalItemCost(): number;
    get totalCost(): number;
    get durationHours(): number | null;
}
