import { PaymentBreakdownDto } from './payment-summary.dto';
export declare class ReconciliationDiscrepancyDto {
    category: string;
    expectedAmount: number;
    actualAmount: number;
    variance: number;
    variancePercent: number;
    exceedsThreshold: boolean;
}
export declare class ReconciliationReportDto {
    date: Date;
    expectedTotal: number;
    actualTotal: number;
    totalVariance: number;
    totalPayments: number;
    byMethod: PaymentBreakdownDto[];
    discrepancies: ReconciliationDiscrepancyDto[];
    hasVariances: boolean;
    status: 'BALANCED' | 'NEEDS_REVIEW' | 'DISCREPANCY_FOUND';
}
export declare class PaymentAllocationResultDto {
    billId: number;
    outstandingBefore: number;
    allocatedAmount: number;
    outstandingAfter: number;
    isFullyPaid: boolean;
}
export declare class AllocationResultDto {
    totalPaymentAmount: number;
    totalAllocated: number;
    excessAmount: number;
    allocations: PaymentAllocationResultDto[];
    paymentIds: number[];
}
export declare class OverpaymentDto {
    paymentId: number;
    billId: number;
    customerId: number | null;
    customerName: string;
    billAmount: number;
    totalPaid: number;
    overpaymentAmount: number;
    paymentDate: Date;
}
