export declare class BillDetailDto {
    slabRange: string;
    unitsInSlab: number;
    ratePerUnit: number;
    amount: number;
}
export declare class BillTaxDto {
    taxName: string;
    ratePercent: number;
    taxableAmount: number;
    taxAmount: number;
}
export declare class PaymentSummaryDto {
    paymentId: number;
    paymentDate: Date;
    paymentAmount: number;
    paymentMethod: string;
    transactionRef: string;
}
export declare class BillResponseDto {
    billId: number;
    meterId: number;
    meterSerialNo: string;
    customerName: string;
    customerEmail?: string;
    connectionAddress: string;
    tariffCategoryName: string;
    utilityTypeName: string;
    billingPeriodStart: Date;
    billingPeriodEnd: Date;
    billDate: Date;
    dueDate: Date;
    totalImportUnit: number;
    totalExportUnit: number;
    energyChargeAmount: number;
    fixedChargeAmount: number;
    subsidyAmount: number;
    solarExportCredit: number;
    details: BillDetailDto[];
    taxes: BillTaxDto[];
    totalAmount: number;
    taxAmount: number;
    isPaid: boolean;
    isOverdue: boolean;
    payments?: PaymentSummaryDto[];
}
