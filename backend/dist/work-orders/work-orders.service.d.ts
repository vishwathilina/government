import { Repository } from 'typeorm';
import { WorkOrder, WorkOrderStatus } from '../database/entities/work-order.entity';
import { CreateWorkOrderDto, UpdateWorkOrderDto, WorkOrderResponseDto, WorkOrderFilterDto } from './dto';
export declare class WorkOrdersService {
    private workOrderRepository;
    constructor(workOrderRepository: Repository<WorkOrder>);
    create(createDto: CreateWorkOrderDto): Promise<WorkOrderResponseDto>;
    findAll(filters: WorkOrderFilterDto): Promise<{
        data: WorkOrderResponseDto[];
        total: number;
        page: number;
        limit: number;
    }>;
    findOne(id: number): Promise<WorkOrder>;
    update(id: number, updateDto: UpdateWorkOrderDto): Promise<WorkOrderResponseDto>;
    updateStatus(id: number, status: WorkOrderStatus, notes?: string): Promise<WorkOrderResponseDto>;
    complete(id: number, resolutionNotes: string): Promise<WorkOrderResponseDto>;
    cancel(id: number, reason: string): Promise<WorkOrderResponseDto>;
    getStatistics(filters?: any): Promise<any>;
    private toResponseDto;
}
