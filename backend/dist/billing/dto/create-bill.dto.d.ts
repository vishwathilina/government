export declare class CreateBillDto {
    meterId: number;
    billingPeriodStart: Date;
    billingPeriodEnd: Date;
    dueDate?: Date;
    applySubsidy?: boolean;
    applySolarCredit?: boolean;
}
