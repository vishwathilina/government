import { PaymentMethod, PaymentChannel } from '../../database/entities/payment.entity';
export declare class PaymentFilterDto {
    billId?: number;
    customerId?: number;
    employeeId?: number;
    paymentMethod?: PaymentMethod;
    paymentChannel?: PaymentChannel;
    startDate?: Date;
    endDate?: Date;
    minAmount?: number;
    maxAmount?: number;
    transactionRef?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    order?: 'ASC' | 'DESC';
}
