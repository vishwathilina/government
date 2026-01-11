import { Customer } from './customer.entity';
import { Employee } from './employee.entity';
export declare enum ComplaintStatus {
    OPEN = "OPEN",
    ASSIGNED = "ASSIGNED",
    IN_PROGRESS = "IN_PROGRESS",
    RESOLVED = "RESOLVED",
    CLOSED = "CLOSED"
}
export declare class Complaint {
    complaintId: number;
    customerId: number;
    assignedEmployeeId: number | null;
    complaintType: string;
    createdDate: Date;
    resolvedDate: Date | null;
    status: ComplaintStatus;
    description: string;
    customer: Customer;
    assignedEmployee: Employee | null;
    get resolutionTimeHours(): number | null;
}
