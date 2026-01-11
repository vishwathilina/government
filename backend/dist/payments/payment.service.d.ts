import { Repository, DataSource } from 'typeorm';
import { Payment, PaymentMethod } from '../database/entities/payment.entity';
import { Bill } from '../database/entities/bill.entity';
import { Customer } from '../database/entities/customer.entity';
import { Employee } from '../database/entities/employee.entity';
import { StripeService } from '../stripe/stripe.service';
import { CreatePaymentDto, UpdatePaymentDto, PaymentFilterDto, CreateCheckoutSessionDto, CheckoutSessionResponseDto, ConfirmStripePaymentDto, CustomerBillsResponseDto, PaymentIntentResponseDto, StripeWebhookEventDto, CreateCashierPaymentDto, RefundDto, PaymentSummaryDto, DailyCollectionReportDto } from './dto';
export declare class PaymentService {
    private paymentRepository;
    private billRepository;
    private customerRepository;
    private employeeRepository;
    private dataSource;
    private stripeService;
    private readonly logger;
    private readonly OVERPAYMENT_TOLERANCE;
    constructor(paymentRepository: Repository<Payment>, billRepository: Repository<Bill>, customerRepository: Repository<Customer>, employeeRepository: Repository<Employee>, dataSource: DataSource, stripeService: StripeService);
    create(createDto: CreatePaymentDto, employeeId?: number): Promise<Payment>;
    findAll(filters: PaymentFilterDto): Promise<{
        payments: Payment[];
        total: number;
    }>;
    findOne(paymentId: number): Promise<Payment>;
    findByBill(billId: number): Promise<Payment[]>;
    findByCustomer(customerId: number, options?: {
        startDate?: Date;
        endDate?: Date;
        limit?: number;
    }): Promise<Payment[]>;
    findByEmployee(employeeId: number, date: Date): Promise<Payment[]>;
    update(paymentId: number, updateDto: UpdatePaymentDto): Promise<Payment>;
    getBillOutstanding(billId: number): Promise<number>;
    getSummary(filters?: {
        startDate?: Date;
        endDate?: Date;
        employeeId?: number;
        customerId?: number;
    }): Promise<{
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
    getDailyCollectionReport(employeeId: number, date: Date): Promise<{
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
    processRefund(refundDto: {
        paymentId: number;
        refundAmount: number;
        refundReason: string;
        refundMethod: string;
    }, employeeId: number): Promise<Payment>;
    voidPayment(paymentId: number, reason: string, employeeId: number): Promise<void>;
    reconcilePayments(date: Date, expectedAmount: number, actualAmount: number): Promise<{
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
        status: 'BALANCED' | 'NEEDS_REVIEW' | 'DISCREPANCY_FOUND';
    }>;
    allocatePaymentToBills(paymentAmount: number, billIds: number[], employeeId?: number, paymentMethod?: PaymentMethod, transactionRef?: string): Promise<{
        totalPaymentAmount: number;
        totalAllocated: number;
        excessAmount: number;
        allocations: Array<{
            billId: number;
            outstandingBefore: number;
            allocatedAmount: number;
            outstandingAfter: number;
            isFullyPaid: boolean;
        }>;
        paymentIds: number[];
    }>;
    searchByTransactionRef(transactionRef: string): Promise<Payment | null>;
    getOverpayments(): Promise<Array<{
        paymentId: number;
        billId: number;
        customerId: number | null;
        customerName: string;
        billAmount: number;
        totalPaid: number;
        overpaymentAmount: number;
        paymentDate: Date;
    }>>;
    getPendingReconciliation(date: Date): Promise<Payment[]>;
    exportPayments(filters: PaymentFilterDto): Promise<Buffer>;
    createCheckoutSession(dto: CreateCheckoutSessionDto, customerId: number): Promise<CheckoutSessionResponseDto>;
    createPaymentIntent(billIds: number[], customerId: number): Promise<PaymentIntentResponseDto>;
    confirmStripePayment(dto: ConfirmStripePaymentDto): Promise<Payment[]>;
    handleStripeWebhook(event: StripeWebhookEventDto): Promise<void>;
    private handlePaymentIntentSucceeded;
    private handlePaymentIntentFailed;
    private handleCheckoutSessionCompleted;
    private handleCheckoutSessionExpired;
    private handleChargeRefunded;
    getCustomerUnpaidBills(customerId: number): Promise<CustomerBillsResponseDto>;
    createCashierPayment(dto: CreateCashierPaymentDto, employeeId: number): Promise<Payment>;
    getCustomerPaymentHistory(customerId: number, options?: {
        limit?: number;
        startDate?: Date;
        endDate?: Date;
    }): Promise<Payment[]>;
    getPendingStripePayments(customerId?: number): Promise<Payment[]>;
    refundStripePayment(paymentId: number, amount?: number, reason?: string, employeeId?: number): Promise<Payment>;
    refundCashierPayment(paymentId: number, refundDto: RefundDto, employeeId: number): Promise<Payment>;
    getPaymentSummary(filters?: PaymentFilterDto): Promise<PaymentSummaryDto>;
    getCashierDailyReport(date: Date, employeeId?: number): Promise<DailyCollectionReportDto>;
    private getCustomerIdFromBill;
    private mapSortColumn;
    private roundAmount;
}
