import { Repository, DataSource } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { MeterReading } from '../database/entities/meter-reading.entity';
import { Meter } from '../database/entities/meter.entity';
import { MeterReader } from '../database/entities/meter-reader.entity';
import { CreateMeterReadingDto, BulkCreateReadingsDto, UpdateMeterReadingDto, MeterReadingResponseDto, ReadingFilterDto, ReadingValidationResultDto, ConsumptionSummaryDto } from './dto';
import { PaginatedResponseDto } from '../common/dto/pagination.dto';
import { BillingService } from '../billing/billing.service';
export declare class ReadingsService {
    private readingRepository;
    private meterRepository;
    private meterReaderRepository;
    private dataSource;
    private billingService;
    private eventEmitter;
    private readonly logger;
    private readonly HIGH_CONSUMPTION_MULTIPLIER;
    private readonly LOW_CONSUMPTION_THRESHOLD;
    private readonly DAYS_FOR_AVERAGE;
    constructor(readingRepository: Repository<MeterReading>, meterRepository: Repository<Meter>, meterReaderRepository: Repository<MeterReader>, dataSource: DataSource, billingService: BillingService, eventEmitter: EventEmitter2);
    findAll(filters: ReadingFilterDto): Promise<PaginatedResponseDto<MeterReadingResponseDto>>;
    findOne(id: number): Promise<MeterReadingResponseDto>;
    findByMeter(meterId: number, options?: {
        limit?: number;
        startDate?: Date;
        endDate?: Date;
    }): Promise<MeterReadingResponseDto[]>;
    getLatestReading(meterId: number): Promise<MeterReadingResponseDto | null>;
    create(createDto: CreateMeterReadingDto, meterReaderId?: number, options?: {
        autoGenerateBill?: boolean;
        minDaysBetweenBills?: number;
        dueDaysFromBillDate?: number;
    }): Promise<MeterReadingResponseDto & {
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
    update(id: number, updateDto: UpdateMeterReadingDto): Promise<MeterReadingResponseDto>;
    validateReading(meterId: number, newReading: number, readingDate: Date): Promise<ReadingValidationResultDto>;
    private calculateAverageConsumption;
    getConsumptionSummary(meterId: number, startDate: Date, endDate: Date): Promise<ConsumptionSummaryDto>;
    getReadingsByReader(meterReaderId: number, date: Date): Promise<{
        readings: MeterReadingResponseDto[];
        totalMetersRead: number;
    }>;
    estimateReading(meterId: number, readingDate: Date): Promise<{
        estimatedReading: number;
        confidence: string;
        basedOnReadings: number;
    }>;
    createEstimatedReading(meterId: number, readingDate: Date): Promise<MeterReadingResponseDto>;
    remove(id: number): Promise<{
        success: boolean;
        message: string;
    }>;
    exportToCsv(filters: ReadingFilterDto): Promise<string>;
    importFromCsv(csvContent: string, meterReaderId?: number): Promise<{
        success: boolean;
        totalRows: number;
        successCount: number;
        failureCount: number;
        errors: Array<{
            row: number;
            error: string;
        }>;
    }>;
    private parseCsvLine;
    detectAnomalies(startDate?: Date, endDate?: Date, thresholdMultiplier?: number): Promise<{
        anomalies: Array<{
            reading: MeterReadingResponseDto;
            anomalyType: string;
            severity: 'HIGH' | 'MEDIUM' | 'LOW';
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
