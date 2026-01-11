import { ValidatorConstraintInterface, ValidationArguments } from 'class-validator';
import { Bill } from './bill.entity';
import { Employee } from './employee.entity';
import { Customer } from './customer.entity';
export declare enum PaymentMethod {
    STRIPE_CARD = "STRIPE_CARD",
    STRIPE_WALLET = "STRIPE_WALLET",
    CASH = "CASH",
    CARD_TERMINAL = "CARD_TERMINAL",
    BANK_TRANSFER = "BANK_TRANSFER",
    CHEQUE = "CHEQUE",
    CARD = "CARD",
    ONLINE = "ONLINE",
    MOBILE_MONEY = "MOBILE_MONEY"
}
export declare const PAYMENT_METHODS_REQUIRING_REF: PaymentMethod[];
export declare const STRIPE_PAYMENT_METHODS: PaymentMethod[];
export declare enum PaymentChannel {
    CUSTOMER_PORTAL = "CUSTOMER_PORTAL",
    CASHIER_PORTAL = "CASHIER_PORTAL",
    MOBILE_APP = "MOBILE_APP",
    OFFICE = "OFFICE",
    WEBSITE = "WEBSITE",
    BANK = "BANK",
    ATM = "ATM"
}
export declare enum PaymentStatus {
    PENDING = "PENDING",
    COMPLETED = "COMPLETED",
    FAILED = "FAILED",
    REFUNDED = "REFUNDED",
    CANCELLED = "CANCELLED"
}
export declare class IsPositiveAmountConstraint implements ValidatorConstraintInterface {
    validate(value: number): boolean;
    defaultMessage(): string;
}
export declare class IsNotFutureDateConstraint implements ValidatorConstraintInterface {
    validate(value: Date): boolean;
    defaultMessage(): string;
}
export declare class TransactionRefRequiredConstraint implements ValidatorConstraintInterface {
    validate(_value: string | null, args: ValidationArguments): boolean;
    defaultMessage(args: ValidationArguments): string;
}
export declare class StripePaymentIntentRequiredConstraint implements ValidatorConstraintInterface {
    validate(_value: string | null, args: ValidationArguments): boolean;
    defaultMessage(args: ValidationArguments): string;
}
export declare class Payment {
    paymentId: number;
    billId: number;
    customerId: number | null;
    employeeId: number | null;
    paymentDate: Date;
    paymentAmount: number;
    paymentMethod: PaymentMethod;
    paymentChannel: PaymentChannel;
    paymentStatus?: PaymentStatus;
    transactionRef: string | null;
    stripePaymentIntentId?: string | null;
    stripeChargeId?: string | null;
    stripeCustomerId?: string | null;
    metadata?: string | null;
    bill: Bill;
    customer: Customer | null;
    employee: Employee | null;
    get receiptNumber(): string;
    get parsedMetadata(): Record<string, any> | null;
    requiresTransactionRef(): boolean;
    isStripePayment(): boolean;
    isOnlinePayment(): boolean;
    isCashierPayment(): boolean;
    isPending(): boolean;
    isCompleted(): boolean;
    isRefundable(): boolean;
    getPaymentMethodDisplay(): string;
    getPaymentChannelDisplay(): string;
    getPaymentStatusDisplay(): string;
    setMetadata(data: Record<string, any>): void;
    updateMetadata(data: Record<string, any>): void;
}
