export declare class PaymentBreakdownDto {
    category: string;
    count: number;
    amount: number;
}
export declare class PaymentPeriodDto {
    start: Date;
    end: Date;
}
export declare class PaymentSummaryDto {
    totalPayments: number;
    totalAmount: number;
    byMethod: PaymentBreakdownDto[];
    byChannel: PaymentBreakdownDto[];
    byStatus: PaymentBreakdownDto[];
    stripeSuccessRate: number;
    failedCount: number;
    refundedAmount: number;
    period: PaymentPeriodDto;
}
