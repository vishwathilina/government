import { Response } from 'express';
import { ReadingsService } from './readings.service';
import { CreateMeterReadingDto, BulkCreateReadingsDto, UpdateMeterReadingDto, MeterReadingResponseDto, ReadingFilterDto, ReadingValidationResultDto, ConsumptionSummaryDto } from './dto';
declare class ValidateReadingDto {
    meterId: number;
    reading: number;
    readingDate: Date;
}
declare class EstimateReadingDto {
    readingDate: Date;
}
export declare class ReadingsController {
    private readonly readingsService;
    constructor(readingsService: ReadingsService);
    findAll(filters: ReadingFilterDto): Promise<import("../common/dto").PaginatedResponseDto<MeterReadingResponseDto>>;
    findOne(id: number): Promise<MeterReadingResponseDto>;
    findByMeter(meterId: number, limit?: number, startDate?: string, endDate?: string): Promise<MeterReadingResponseDto[]>;
    getLatestReading(meterId: number): Promise<MeterReadingResponseDto | null>;
    getConsumptionSummary(meterId: number, startDate: string, endDate: string): Promise<ConsumptionSummaryDto>;
    getReadingsByReader(meterReaderId: number, date: string): Promise<{
        readings: MeterReadingResponseDto[];
        totalMetersRead: number;
    }>;
    create(createDto: CreateMeterReadingDto, user: any): Promise<MeterReadingResponseDto & {
        generatedBill?: {
            billId: number;
            totalAmount: number;
        };
    }>;
    createBulk(bulkDto: BulkCreateReadingsDto): Promise<{
        success: boolean;
        results: Array<{
            index: number;
            reading?: MeterReadingResponseDto;
            error?: string;
        }>;
    }>;
    validateReading(body: ValidateReadingDto): Promise<ReadingValidationResultDto>;
    estimateReading(meterId: number, body: EstimateReadingDto): Promise<{
        estimatedReading: number;
        confidence: string;
        basedOnReadings: number;
    }>;
    update(id: number, updateDto: UpdateMeterReadingDto): Promise<MeterReadingResponseDto>;
    exportToCsv(filters: ReadingFilterDto, res: Response): Promise<void>;
    importFromCsv(file: Express.Multer.File, user: any): Promise<{
        success: boolean;
        totalRows: number;
        successCount: number;
        failureCount: number;
        errors: Array<{
            row: number;
            error: string;
        }>;
    }>;
    detectAnomalies(startDate?: string, endDate?: string, threshold?: number): Promise<{
        anomalies: Array<{
            reading: MeterReadingResponseDto;
            anomalyType: string;
            severity: "HIGH" | "MEDIUM" | "LOW";
            description: string;
        }>;
        summary: {
            totalAnalyzed: number;
            anomalyCount: number;
            byType: Record<string, number>;
            bySeverity: Record<string, number>;
        };
    }>;
}
export {};
