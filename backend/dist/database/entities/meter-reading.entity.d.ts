import { Meter } from './meter.entity';
export declare enum ReadingSource {
    MANUAL = "MANUAL",
    SMART_METER = "SMART_METER",
    ESTIMATED = "ESTIMATED",
    CORRECTED = "CORRECTED"
}
export declare class MeterReading {
    readingId: number;
    meterId: number;
    meterReaderId: number | null;
    readingDate: Date;
    readingSource: ReadingSource;
    importReading: number | null;
    prevImportReading: number | null;
    exportReading: number | null;
    prevExportReading: number | null;
    deviceId: string | null;
    createdAt: Date;
    meter: Meter;
    meterReader: import('./meter-reader.entity').MeterReader | null;
    get consumption(): number | null;
    get exportedEnergy(): number | null;
    get netConsumption(): number | null;
    validateBeforeInsert(): void;
    validateBeforeUpdate(): void;
    private validate;
}
