import { WorkOrderStatus } from '../../database/entities/work-order.entity';
export declare class WorkOrderFilterDto {
    status?: WorkOrderStatus;
    assetId?: number;
    requestId?: number;
    geoAreaId?: number;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    order?: 'ASC' | 'DESC';
}
