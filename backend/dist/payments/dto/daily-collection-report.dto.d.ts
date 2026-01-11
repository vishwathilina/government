import { PaymentResponseDto } from './payment-response.dto';
import { PaymentBreakdownDto } from './payment-summary.dto';
export declare class DailyCollectionReportDto {
    date: Date;
    cashierName: string;
    cashierId: number;
    openingBalance: number;
    totalCollected: number;
    byMethod: PaymentBreakdownDto[];
    paymentsList: PaymentResponseDto[];
    closingBalance: number;
    totalTransactions: number;
    cashCollected: number;
    nonCashCollected: number;
}
