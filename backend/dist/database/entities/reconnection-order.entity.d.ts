import { ServiceConnection } from './service-connection.entity';
import { Employee } from './employee.entity';
export declare enum ReconnectionStatus {
    PENDING = "PENDING",
    SCHEDULED = "SCHEDULED",
    COMPLETED = "COMPLETED",
    CANCELLED = "CANCELLED"
}
export declare class ReconnectionOrder {
    reconnectionId: number;
    connectionId: number;
    employeeId: number;
    scheduledDate: Date | null;
    reconnectionDate: Date | null;
    reconnectionFee: number;
    status: ReconnectionStatus;
    connection: ServiceConnection;
    employee: Employee;
}
