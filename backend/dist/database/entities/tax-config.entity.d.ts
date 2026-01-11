export declare enum TaxStatus {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE"
}
export declare class TaxConfig {
    taxId: number;
    taxName: string;
    ratePercent: number;
    effectiveFrom: Date;
    effectiveTo: Date | null;
    status: TaxStatus;
    isActive(date?: Date): boolean;
    calculateTaxAmount(baseAmount: number): number;
    getRateAsDecimal(): number;
    isCurrentlyEffective(): boolean;
    getDisplayName(): string;
}
