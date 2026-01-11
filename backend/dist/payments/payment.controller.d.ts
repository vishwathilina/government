import { StreamableFile } from '@nestjs/common';
import { Response } from 'express';
import { PaymentService } from './payment.service';
import { CreatePaymentDto, UpdatePaymentDto, PaymentFilterDto, PaymentResponseDto, RefundDto } from './dto';
import { Payment } from '../database/entities/payment.entity';
export declare class PaymentController {
    private readonly paymentService;
    constructor(paymentService: PaymentService);
    create(createDto: CreatePaymentDto, employeeId: number): Promise<PaymentResponseDto>;
    findAll(filters: PaymentFilterDto): Promise<{
        payments: PaymentResponseDto[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    getSummary(startDate?: string, endDate?: string, employeeId?: number, customerId?: number): Promise<{
        totalPayments: number;
        totalAmount: number;
        byMethod: Array<{
            category: string;
            count: number;
            amount: number;
        }>;
        byChannel: Array<{
            category: string;
            count: number;
            amount: number;
        }>;
        period: {
            start: Date;
            end: Date;
        };
    }>;
    getDailyReport(date: string, employeeId?: number, currentEmployeeId?: number): Promise<{
        date: Date;
        cashierName: string;
        cashierId: number;
        openingBalance: number;
        totalCollected: number;
        byMethod: Array<{
            category: string;
            count: number;
            amount: number;
        }>;
        paymentsList: Payment[];
        closingBalance: number;
        totalTransactions: number;
        cashCollected: number;
        nonCashCollected: number;
    }>;
    getOverpayments(): Promise<{
        paymentId: number;
        billId: number;
        customerId: number | null;
        customerName: string;
        billAmount: number;
        totalPaid: number;
        overpaymentAmount: number;
        paymentDate: Date;
    }[]>;
    getPendingReconciliation(date: string): Promise<Payment[]>;
    exportPayments(filters: PaymentFilterDto, res: Response): Promise<StreamableFile>;
    searchByTransactionRef(transactionRef: string): Promise<PaymentResponseDto | null>;
    getCashierCollections(employeeId: number, date: string): Promise<Payment[]>;
    findByBill(billId: number): Promise<PaymentResponseDto[]>;
    getBillOutstanding(billId: number): Promise<{
        billId: number;
        totalAmount: number;
        totalPaid: number;
        outstanding: number;
    }>;
    findByCustomer(customerId: number, startDate?: string, endDate?: string, limit?: number): Promise<PaymentResponseDto[]>;
    findOne(id: number): Promise<PaymentResponseDto>;
    downloadReceipt(id: number, res: Response): Promise<StreamableFile>;
    update(id: number, updateDto: UpdatePaymentDto): Promise<PaymentResponseDto>;
    processRefund(id: number, refundDto: RefundDto, employeeId: number): Promise<PaymentResponseDto>;
    voidPayment(id: number, body: {
        reason: string;
    }, employeeId: number): Promise<void>;
    reconcilePayments(body: {
        date: string;
        expectedAmount: number;
        actualAmount: number;
    }): Promise<{
        date: Date;
        expectedTotal: number;
        actualTotal: number;
        totalVariance: number;
        totalPayments: number;
        byMethod: Array<{
            category: string;
            count: number;
            amount: number;
        }>;
        discrepancies: Array<{
            category: string;
            expectedAmount: number;
            actualAmount: number;
            variance: number;
            variancePercent: number;
            exceedsThreshold: boolean;
        }>;
        hasVariances: boolean;
        status: "BALANCED" | "NEEDS_REVIEW" | "DISCREPANCY_FOUND";
    }>;
    private transformToResponse;
}
