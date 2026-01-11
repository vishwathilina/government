import { Repository } from 'typeorm';
import { Meter, MeterReading, Bill, BillDetail, BillTax, TariffSlab, TaxConfig, ServiceConnection, Customer } from '../database/entities';
import { BillCalculationDto, SlabBreakdownDto, TaxBreakdownDto } from './dto';
export declare class BillingService {
    private meterRepository;
    private readingRepository;
    private billRepository;
    private billDetailRepository;
    private billTaxRepository;
    private tariffSlabRepository;
    private taxConfigRepository;
    private connectionRepository;
    private customerRepository;
    private readonly logger;
    constructor(meterRepository: Repository<Meter>, readingRepository: Repository<MeterReading>, billRepository: Repository<Bill>, billDetailRepository: Repository<BillDetail>, billTaxRepository: Repository<BillTax>, tariffSlabRepository: Repository<TariffSlab>, taxConfigRepository: Repository<TaxConfig>, connectionRepository: Repository<ServiceConnection>, customerRepository: Repository<Customer>);
    calculateBill(meterId: number, periodStart: Date, periodEnd: Date): Promise<BillCalculationDto>;
    applyTariffSlabs(consumption: number, tariffCategoryId: number, billDate: Date): Promise<{
        slabs: SlabBreakdownDto[];
        energyCharge: number;
        fixedCharge: number;
    }>;
    calculateSubsidy(customerId: number, billAmount: number, _billDate: Date): Promise<number>;
    calculateSolarCredit(exportUnits: number, _utilityTypeId: number, _billDate: Date): Promise<number>;
    calculateTaxes(taxableAmount: number, billDate: Date): Promise<TaxBreakdownDto[]>;
    private roundAmount;
    create(meterId: number, periodStart: Date, periodEnd: Date, _employeeId?: number): Promise<Bill>;
    createBulk(utilityTypeId?: number, customerType?: string, meterIds?: number[], periodStart?: Date, periodEnd?: Date, dryRun?: boolean): Promise<{
        success: Bill[];
        failed: Array<{
            meterId: number;
            meterSerialNo: string;
            error: string;
        }>;
    }>;
    findAll(filters?: {
        customerId?: number;
        meterId?: number;
        connectionId?: number;
        search?: string;
        utilityTypeId?: number;
        status?: string;
        startDate?: Date;
        endDate?: Date;
        page?: number;
        limit?: number;
        sortBy?: string;
        order?: 'ASC' | 'DESC';
    }): Promise<{
        bills: Bill[];
        total: number;
    }>;
    findOne(billId: number): Promise<Bill>;
    findByMeter(meterId: number, options?: {
        limit?: number;
        startDate?: Date;
        endDate?: Date;
    }): Promise<Bill[]>;
    findByCustomer(customerId: number): Promise<Bill[]>;
    update(billId: number, updates: {
        dueDate?: Date;
        subsidyAmount?: number;
        solarExportCredit?: number;
    }, employeeId?: number): Promise<Bill>;
    recalculate(billId: number): Promise<Bill>;
    getSummary(filters?: {
        customerId?: number;
        utilityTypeId?: number;
        startDate?: Date;
        endDate?: Date;
    }): Promise<{
        totalBills: number;
        totalAmount: number;
        paidAmount: number;
        outstanding: number;
        overdueBills: number;
        overdueAmount: number;
    }>;
    void(billId: number, reason: string, employeeId: number): Promise<void>;
    generateBillFromReading(meterId: number, readingDate: Date, options?: {
        minDaysBetweenBills?: number;
        dueDaysFromBillDate?: number;
    }): Promise<Bill | null>;
    checkBillingEligibility(meterId: number): Promise<{
        eligible: boolean;
        reason: string;
        lastBillDate?: Date;
        readingCount?: number;
        suggestedPeriodStart?: Date;
    }>;
}
