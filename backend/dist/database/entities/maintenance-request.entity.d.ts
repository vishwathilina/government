import { Customer } from './customer.entity';
import { GeoArea } from './geo-area.entity';
import { UtilityType } from './utility-type.entity';
export declare enum RequestPriority {
    LOW = "LOW",
    MEDIUM = "MEDIUM",
    HIGH = "HIGH",
    CRITICAL = "CRITICAL"
}
export declare class MaintenanceRequest {
    requestId: number;
    requestedByCustomerId: number | null;
    requestTs: Date;
    priority: RequestPriority;
    issueType: string;
    description: string;
    outputUom: string | null;
    geoAreaId: number;
    utilityTypeId: number;
    requestedByCustomer: Customer | null;
    geoArea: GeoArea;
    utilityType: UtilityType;
}
