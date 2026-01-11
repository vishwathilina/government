export declare enum RefundMethod {
    CASH = "CASH",
    BANK_TRANSFER = "BANK_TRANSFER"
}
export declare class BankDetailsDto {
    bankName: string;
    accountNumber: string;
    branchName?: string;
    accountHolderName?: string;
}
export declare class RefundDto {
    paymentId: number;
    refundAmount: number;
    refundReason: string;
    refundMethod: RefundMethod;
    notes?: string;
    bankDetails?: BankDetailsDto;
}
export declare class RefundResponseDto {
    refundId: number;
    paymentId: number;
    refundAmount: number;
    refundReason: string;
    refundMethod: RefundMethod;
    refundDate: Date;
    processedBy: string;
    refundReference: string;
}
