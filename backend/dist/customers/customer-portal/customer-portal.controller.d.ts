import { CustomerPortalService } from './customer-portal.service';
export declare class CustomerPortalController {
    private readonly customerPortalService;
    constructor(customerPortalService: CustomerPortalService);
    getDashboard(req: any): Promise<{
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
            method: import("../../database/entities").PaymentMethod;
            receiptNumber: string;
            billNumber: string;
        }[];
        connections: {
            connectionId: number;
            utilityType: string;
            status: import("../../database/entities").ConnectionStatus;
            meterSerialNo: string;
        }[];
    }>;
    getProfile(req: any): Promise<{
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
    getUnpaidBills(req: any): Promise<{
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
    getBillHistory(req: any, page?: number, limit?: number, status?: string): Promise<{
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
    getBillDetails(req: any, billId: number): Promise<{
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
            method: import("../../database/entities").PaymentMethod;
        }[];
    }>;
    getPaymentHistory(req: any, page?: number, limit?: number): Promise<{
        payments: {
            paymentId: number;
            paymentDate: Date;
            amount: number;
            method: import("../../database/entities").PaymentMethod;
            channel: import("../../database/entities").PaymentChannel;
            status: import("../../database/entities").PaymentStatus | undefined;
            receiptNumber: string;
            billNumber: string;
        }[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    getPaymentReceipt(req: any, paymentId: number): Promise<{
        receiptNumber: string;
        paymentId: number;
        paymentDate: Date;
        amount: number;
        method: import("../../database/entities").PaymentMethod;
        channel: import("../../database/entities").PaymentChannel;
        status: import("../../database/entities").PaymentStatus | undefined;
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
    createPayment(req: any, createPaymentDto: {
        billId: number;
        paymentAmount: number;
        paymentMethod: string;
        paymentDate: string;
    }): Promise<{
        paymentId: number;
        billId: number;
        amount: number;
        method: import("../../database/entities").PaymentMethod;
        status: import("../../database/entities").PaymentStatus | undefined;
        transactionRef: string | null;
        paymentDate: Date;
        receiptNumber: string | null;
        message: string;
    }>;
    getConnections(req: any): Promise<{
        connectionId: number;
        utilityType: {
            id: number;
            name: string;
            code: string;
        };
        status: import("../../database/entities").ConnectionStatus;
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
    getConsumptionHistory(req: any, connectionId: number, months?: number): Promise<{
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
            readingSource: import("../../database/entities").ReadingSource;
        }[];
        averageConsumption: number;
        totalConsumption: number;
    }>;
}
