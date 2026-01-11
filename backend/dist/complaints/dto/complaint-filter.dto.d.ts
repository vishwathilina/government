import { ComplaintStatus } from '../../database/entities/complaint.entity';
export declare class ComplaintFilterDto {
    status?: ComplaintStatus;
    customerId?: number;
    assignedEmployeeId?: number;
    complaintType?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    order?: 'ASC' | 'DESC';
}
