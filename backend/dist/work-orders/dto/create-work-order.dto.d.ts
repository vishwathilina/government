import { WorkOrderStatus } from '../../database/entities/work-order.entity';
export declare class CreateWorkOrderDto {
    openedTs: string;
    scheduledStartTs?: string;
    scheduledEndTs?: string;
    workOrderStatus: WorkOrderStatus;
    resolutionNotes?: string;
    assetId?: number;
    requestId?: number;
    geoAreaId: number;
    assignedEmployeeIds?: number[];
}
