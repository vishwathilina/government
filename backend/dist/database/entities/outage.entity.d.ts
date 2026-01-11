import { UtilityType } from './utility-type.entity';
import { Employee } from './employee.entity';
export declare enum OutageType {
    PLANNED = "PLANNED",
    UNPLANNED = "UNPLANNED"
}
export declare class Outage {
    outageId: number;
    utilityTypeId: number;
    employeeId: number | null;
    startTime: Date;
    endTime: Date | null;
    outageType: OutageType;
    reason: string | null;
    utilityType: UtilityType;
    employee: Employee | null;
    get isActive(): boolean;
    get durationHours(): number | null;
}
