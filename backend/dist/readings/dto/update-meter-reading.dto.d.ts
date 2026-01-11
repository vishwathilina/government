export declare enum UpdateReadingSourceDto {
    MANUAL = "MANUAL",
    SMART_METER = "SMART_METER",
    ESTIMATED = "ESTIMATED",
    CORRECTED = "CORRECTED"
}
export declare class UpdateMeterReadingDto {
    importReading?: number;
    exportReading?: number;
    readingSource?: UpdateReadingSourceDto;
    notes?: string;
}
