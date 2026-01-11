import { PaymentMethod, PaymentChannel } from '../../database/entities/payment.entity';
export declare class PaymentBillDetailsDto {
    period: string;
    utilityType: string;
    meterSerialNo: string;
}
export declare class PaymentResponseDto {
    paymentId: number;
    billId: number;
    customerId: number | null;
    employeeId: number | null;
    paymentDate: Date;
    paymentAmount: number;
    paymentMethod: PaymentMethod;
    paymentChannel: PaymentChannel | null;
    transactionRef: string | null;
    notes: string | null;
    billNumber: string;
    customerName: string;
    customerEmail: string | null;
    billAmount: number;
    billOutstanding: number;
    newOutstanding: number;
    receiptNumber: string;
    recordedByName: string | null;
    billDetails: PaymentBillDetailsDto;
}
