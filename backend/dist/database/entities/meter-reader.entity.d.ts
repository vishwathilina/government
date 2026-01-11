import { Employee } from './employee.entity';
export declare class MeterReader {
    employeeId: number;
    deviceId: string | null;
    assignedRouteCode: string | null;
    employee: Employee;
    readings: import('./meter-reading.entity').MeterReading[];
}
