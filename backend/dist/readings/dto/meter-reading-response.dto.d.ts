import { MeterReading } from '../../database/entities/meter-reading.entity';
export declare class MeterInfoDto {
    meterId: number;
    meterSerialNo: string;
    utilityTypeName: string;
    utilityTypeId: number;
    isSmartMeter: boolean;
}
export declare class ReaderInfoDto {
    employeeId: number;
    readerName: string;
    deviceId: string | null;
}
export declare class MeterReadingResponseDto {
    readingId: number;
    meterId: number;
    meterReaderId: number | null;
    readingDate: string;
    readingSource: string;
    importReading: number | null;
    prevImportReading: number | null;
    exportReading: number | null;
    prevExportReading: number | null;
    deviceId: string | null;
    createdAt: string;
    consumption: number | null;
    exportedEnergy: number | null;
    netConsumption: number | null;
    meter: MeterInfoDto | null;
    reader: ReaderInfoDto | null;
    static fromEntity(reading: MeterReading): MeterReadingResponseDto;
}
