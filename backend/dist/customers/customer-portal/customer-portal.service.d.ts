import { Repository } from 'typeorm';
import { Customer } from '../../database/entities/customer.entity';
import { Bill } from '../../database/entities/bill.entity';
import { Payment } from '../../database/entities/payment.entity';
import { ServiceConnection } from '../../database/entities/service-connection.entity';
import { MeterReading } from '../../database/entities/meter-reading.entity';
export declare class CustomerPortalService {
    private readonly customerRepository;
    private readonly billRepository;
    private readonly paymentRepository;
    private readonly connectionRepository;
    private readonly readingRepository;
    constructor(customerRepository: Repository<Customer>, billRepository: Repository<Bill>, paymentRepository: Repository<Payment>, connectionRepository: Repository<ServiceConnection>, readingRepository: Repository<MeterReading>);
    getDashboardData(customerId: number): Promise<{
        customer: {
            customerId: number;
            firstName: string;
            lastName: string;
            fullName: string;
            email: string | null;
            customerType: string;
            address: {
                line1: string;
                postalCode: string;
            } | null;
            phoneNumbers: string[];
        };
        accountSummary: {
            totalOutstanding: number;
            unpaidBillCount: number;
            overdueBillCount: number;
            nextDueDate: Date;
            nextDueAmount: number;
        };
        unpaidBills: {
            billId: number;
            billNumber: string;
            meterSerialNo: string;
            utilityType: string;
            billingPeriodStart: Date;
            billingPeriodEnd: Date;
            billDate: Date;
            dueDate: Date;
            totalAmount: number;
            paidAmount: number;
            outstandingAmount: number;
            isPaid: boolean;
            isOverdue: boolean;
            daysOverdue: number;
        }[];
        recentPayments: {
            paymentId: number;
            paymentDate: Date;
            amount: number;
            method: import("../../database/entities/payment.entity").PaymentMethod;
            receiptNumber: string;
            billNumber: string;
        }[];
        connections: {
            connectionId: number;
            utilityType: string;
            status: import("../../database/entities/service-connection.entity").ConnectionStatus;
            meterSerialNo: string;
        }[];
    }>;
    getCustomerProfile(customerId: number): Promise<{
        customerId: number;
        firstName: string;
        middleName: string | null;
        lastName: string;
        fullName: string;
        email: string | null;
        customerType: string;
        identityType: string;
        identityRef: string;
        registrationDate: Date;
        address: {
            line1: string;
            postalCode: string;
        } | null;
        phoneNumbers: string[];
    }>;
    getUnpaidBills(customerId: number): Promise<{
        bills: {
            billId: number;
            billNumber: string;
            meterSerialNo: string;
            utilityType: string;
            billingPeriodStart: Date;
            billingPeriodEnd: Date;
            billDate: Date;
            dueDate: Date;
            totalAmount: number;
            paidAmount: number;
            outstandingAmount: number;
            isPaid: boolean;
            isOverdue: boolean;
            daysOverdue: number;
        }[];
        totalOutstanding: number;
    }>;
    getBillHistory(customerId: number, options: {
        page: number;
        limit: number;
        status?: string;
    }): Promise<{
        bills: {
            billId: number;
            billNumber: string;
            meterSerialNo: string;
            utilityType: string;
            billingPeriodStart: Date;
            billingPeriodEnd: Date;
            billDate: Date;
            dueDate: Date;
            totalAmount: number;
            paidAmount: number;
            outstandingAmount: number;
            status: string;
            isPaid: boolean;
            isOverdue: boolean;
        }[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    getBillDetails(customerId: number, billId: number): Promise<{
        billId: number;
        billNumber: string;
        meterSerialNo: string;
        utilityType: string;
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
        taxAmount: number;
        totalAmount: number;
        paidAmount: number;
        outstandingAmount: number;
        status: string;
        isPaid: boolean;
        isOverdue: boolean;
        daysOverdue: number;
        details: {
            slabId: number | null;
            unitsInSlab: number;
            amount: number;
        }[];
        taxes: {
            taxId: number;
            amount: number;
        }[];
        payments: {
            paymentId: number;
            paymentDate: Date;
            amount: number;
            method: import("../../database/entities/payment.entity").PaymentMethod;
        }[];
    }>;
    private getRecentPayments;
    getPaymentHistory(customerId: number, options: {
        page: number;
        limit: number;
    }): Promise<{
        payments: {
            paymentId: number;
            paymentDate: Date;
            amount: number;
            method: import("../../database/entities/payment.entity").PaymentMethod;
            channel: import("../../database/entities/payment.entity").PaymentChannel;
            status: import("../../database/entities/payment.entity").PaymentStatus | undefined;
            receiptNumber: string;
            billNumber: string;
        }[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    getPaymentReceipt(customerId: number, paymentId: number): Promise<{
        receiptNumber: string;
        paymentId: number;
        paymentDate: Date;
        amount: number;
        method: import("../../database/entities/payment.entity").PaymentMethod;
        channel: import("../../database/entities/payment.entity").PaymentChannel;
        status: import("../../database/entities/payment.entity").PaymentStatus | undefined;
        bill: {
            billId: number;
            billNumber: string;
            utilityType: string;
            meterSerialNo: string;
            totalAmount: number;
        };
        customer: {
            customerId: number | undefined;
            name: string | undefined;
            email: string | null | undefined;
            address: string | undefined;
        };
    }>;
    getConnections(customerId: number): Promise<{
        connectionId: number;
        utilityType: {
            id: number;
            name: string;
            code: string;
        };
        status: import("../../database/entities/service-connection.entity").ConnectionStatus;
        meter: {
            meterId: number;
            meterSerialNo: string;
            status: import("../../database/entities").MeterStatus;
            installationDate: Date;
        } | null;
        address: {
            line1: string;
            postalCode: string;
        } | null;
    }[]>;
    getConsumptionHistory(customerId: number, connectionId: number, months: number): Promise<{
        history: never[];
        averageConsumption: number;
        connectionId?: undefined;
        meterSerialNo?: undefined;
        totalConsumption?: undefined;
    } | {
        connectionId: number;
        meterSerialNo: string | undefined;
        history: {
            readingId: number;
            readingDate: Date;
            currentReading: number;
            previousReading: number;
            consumption: number;
            readingSource: import("../../database/entities/meter-reading.entity").ReadingSource;
        }[];
        averageConsumption: number;
        totalConsumption: number;
    }>;
}
