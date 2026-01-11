export declare class BulkBillGenerationDto {
    billingPeriodStart: Date;
    billingPeriodEnd: Date;
    utilityTypeId?: number;
    customerType?: string;
    meterIds?: number[];
    dryRun?: boolean;
}
