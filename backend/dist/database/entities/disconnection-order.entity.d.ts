import { ServiceConnection } from './service-connection.entity';
import { Employee } from './employee.entity';
export declare enum DisconnectionStatus {
    PENDING = "PENDING",
    SCHEDULED = "SCHEDULED",
    EXECUTED = "EXECUTED",
    CANCELLED = "CANCELLED"
}
export declare class DisconnectionOrder {
    disconnectionId: number;
    connectionId: number;
    employeeId: number;
    reason: string | null;
    issueDate: Date;
    scheduledDate: Date | null;
    executedDate: Date | null;
    status: DisconnectionStatus;
    connection: ServiceConnection;
    employee: Employee;
}
