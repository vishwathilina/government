export declare class PeriodDto {
    start: string;
    end: string;
}
export declare class ConsumptionSummaryDto {
    meterId: number;
    meterSerialNo: string;
    utilityTypeName: string;
    period: PeriodDto;
    totalConsumption: number;
    totalExported: number;
    netConsumption: number;
    readingCount: number;
    averageConsumption: number;
    maxConsumption: number;
    minConsumption: number;
    firstReading: number;
    lastReading: number;
    estimatedMonthlyAverage: number;
    constructor();
    calculate(): void;
}
export declare class ConsumptionComparisonDto {
    period: PeriodDto;
    meters: ConsumptionSummaryDto[];
    totalConsumptionAllMeters: number;
    totalExportedAllMeters: number;
    totalReadingCount: number;
}
