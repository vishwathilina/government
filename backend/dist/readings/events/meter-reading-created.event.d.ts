import { MeterReading } from '../../database/entities/meter-reading.entity';
export declare class MeterReadingCreatedEvent {
    readonly reading: MeterReading;
    readonly options?: {
        autoGenerateBill?: boolean;
        minDaysBetweenBills?: number;
        dueDaysFromBillDate?: number;
    } | undefined;
    constructor(reading: MeterReading, options?: {
        autoGenerateBill?: boolean;
        minDaysBetweenBills?: number;
        dueDaysFromBillDate?: number;
    } | undefined);
}
