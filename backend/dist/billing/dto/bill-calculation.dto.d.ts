export declare class SlabBreakdownDto {
    from: number;
    to: number | null;
    units: number;
    rate: number;
    amount: number;
}
export declare class TaxBreakdownDto {
    name: string;
    rate: number;
    amount: number;
}
export declare class BillCalculationDto {
    startReading: number;
    endReading: number;
    consumption: number;
    slabBreakdown: SlabBreakdownDto[];
    energyCharge: number;
    fixedCharge: number;
    subtotal: number;
    subsidy: number;
    solarCredit: number;
    beforeTax: number;
    taxes: TaxBreakdownDto[];
    totalAmount: number;
}
