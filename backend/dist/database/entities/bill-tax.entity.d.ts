import { Bill } from './bill.entity';
import { TaxConfig } from './tax-config.entity';
export declare class BillTax {
    billTaxId: number;
    billId: number;
    taxId: number;
    ratePercentApplied: number;
    taxableBaseAmount: number;
    bill: Bill;
    taxConfig: TaxConfig;
    getTaxAmount(): number;
    getRateAsDecimal(): number;
    getDisplayString(): string;
    validateRate(): boolean;
    hasRateChanged(): boolean;
    getEffectivePercentage(): number;
}
