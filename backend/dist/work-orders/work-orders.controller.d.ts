import { WorkOrdersService } from './work-orders.service';
import { CreateWorkOrderDto, UpdateWorkOrderDto, WorkOrderResponseDto, WorkOrderFilterDto } from './dto';
import { WorkOrderStatus } from '../database/entities/work-order.entity';
export declare class WorkOrdersController {
    private readonly workOrdersService;
    constructor(workOrdersService: WorkOrdersService);
    create(createDto: CreateWorkOrderDto): Promise<{
        success: boolean;
        data: WorkOrderResponseDto;
        message: string;
    }>;
    findAll(filters: WorkOrderFilterDto): Promise<{
        success: boolean;
        data: WorkOrderResponseDto[];
        total: number;
        page: number;
        limit: number;
        message: string;
    }>;
    getStatistics(filters: any): Promise<{
        success: boolean;
        data: any;
        message: string;
    }>;
    findOne(id: number): Promise<{
        success: boolean;
        data: WorkOrderResponseDto;
        message: string;
    }>;
    update(id: number, updateDto: UpdateWorkOrderDto): Promise<{
        success: boolean;
        data: WorkOrderResponseDto;
        message: string;
    }>;
    updateStatus(id: number, body: {
        status: WorkOrderStatus;
        notes?: string;
    }): Promise<{
        success: boolean;
        data: WorkOrderResponseDto;
        message: string;
    }>;
    complete(id: number, body: {
        resolutionNotes: string;
    }): Promise<{
        success: boolean;
        data: WorkOrderResponseDto;
        message: string;
    }>;
    cancel(id: number, body: {
        reason: string;
    }): Promise<{
        success: boolean;
        data: WorkOrderResponseDto;
        message: string;
    }>;
}
