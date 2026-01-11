import { ComplaintStatus } from '../../database/entities/complaint.entity';
export declare class ComplaintResponseDto {
    complaintId: number;
    customerId: number;
    assignedEmployeeId?: number;
    complaintType: string;
    createdDate: Date;
    resolvedDate?: Date;
    status: ComplaintStatus;
    description: string;
    customer?: any;
    assignedEmployee?: any;
    resolutionTimeHours?: number;
}
