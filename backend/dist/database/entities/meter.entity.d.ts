import { UtilityType } from './utility-type.entity';
import { MeterReading } from './meter-reading.entity';
import { ServiceConnection } from './service-connection.entity';
export declare enum MeterStatus {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
    FAULTY = "FAULTY",
    REPLACED = "REPLACED"
}
export declare class Meter {
    meterId: number;
    meterSerialNo: string;
    utilityTypeId: number;
    installationDate: Date;
    isSmartMeter: boolean;
    status: MeterStatus;
    utilityType: UtilityType;
    readings: MeterReading[];
    serviceConnections: ServiceConnection[];
}
