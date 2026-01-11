import { Bill } from './bill.entity';
import { TariffSlab } from './tariff-slab.entity';
export declare class BillDetail {
    billDetailId: number;
    billId: number;
    slabId: number | null;
    unitsInSlab: number;
    amount: number;
    bill: Bill;
    tariffSlab: TariffSlab | null;
    getRatePerUnit(): number;
    getSlabRangeDescription(): string;
    validateAmount(): boolean;
}
