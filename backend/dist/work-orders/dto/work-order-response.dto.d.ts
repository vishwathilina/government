import { WorkOrderStatus } from '../../database/entities/work-order.entity';
export declare class WorkOrderResponseDto {
    workOrderId: number;
    openedTs: Date;
    scheduledStartTs?: Date;
    scheduledEndTs?: Date;
    closedTs?: Date;
    workOrderStatus: WorkOrderStatus;
    resolutionNotes?: string;
    assetId?: number;
    requestId?: number;
    geoAreaId: number;
    asset?: any;
    request?: any;
    geoArea?: any;
    totalLaborCost?: number;
    totalItemCost?: number;
    totalCost?: number;
    durationHours?: number;
    laborEntries?: any[];
    itemUsages?: any[];
}
