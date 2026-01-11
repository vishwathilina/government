import { StreamableFile } from '@nestjs/common';
import { BillingService } from './billing.service';
import { CreateBillDto, BulkBillGenerationDto, UpdateBillDto, BillFilterDto, BillResponseDto, BillCalculationDto, BillSummaryDto } from './dto';
import { Bill } from '../database/entities';
export declare class BillingController {
    private readonly billingService;
    constructor(billingService: BillingService);
    calculateBill(body: {
        meterId: number;
        periodStart: string;
        periodEnd: string;
    }): Promise<BillCalculationDto>;
    createBill(createDto: CreateBillDto, req: Request & {
        user?: {
            employeeId?: number;
        };
    }): Promise<BillResponseDto>;
    createBulk(bulkDto: BulkBillGenerationDto): Promise<{
        success: Bill[];
        failed: Array<{
            meterId: number;
            meterSerialNo: string;
            error: string;
        }>;
        summary: {
            total: number;
            successful: number;
            failed: number;
        };
    }>;
    findAll(filters: BillFilterDto): Promise<{
        bills: Bill[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findOne(id: number): Promise<BillResponseDto>;
    findByMeter(meterId: number, limit?: number, startDate?: string, endDate?: string): Promise<Bill[]>;
    findByCustomer(customerId: number): Promise<Bill[]>;
    checkBillingEligibility(meterId: number): Promise<{
        eligible: boolean;
        reason: string;
        lastBillDate?: Date;
        readingCount?: number;
        suggestedPeriodStart?: Date;
    }>;
    autoGenerateBill(meterId: number, options?: {
        minDaysBetweenBills?: number;
        dueDaysFromBillDate?: number;
    }): Promise<{
        success: boolean;
        bill?: BillResponseDto;
        message: string;
    }>;
    getSummary(customerId?: number, utilityTypeId?: number, startDate?: string, endDate?: string): Promise<BillSummaryDto>;
    update(id: number, updateDto: UpdateBillDto, req: Request & {
        user?: {
            employeeId?: number;
        };
    }): Promise<BillResponseDto>;
    recalculate(id: number): Promise<BillResponseDto>;
    void(id: number, body: {
        reason: string;
    }, req: Request & {
        user?: {
            employeeId?: number;
        };
    }): Promise<void>;
    downloadPdf(_id: number): Promise<StreamableFile>;
    exportCsv(_filters: BillFilterDto): Promise<StreamableFile>;
    getOverdue(utilityTypeId?: number, customerId?: number): Promise<Bill[]>;
    private transformBillToResponse;
}
