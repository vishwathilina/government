import { ValidatorConstraintInterface, ValidationArguments } from 'class-validator';
import { PaymentMethod, PaymentChannel, PaymentStatus } from '../../database/entities/payment.entity';
export declare enum OnlinePaymentMethod {
    STRIPE = "STRIPE"
}
export declare enum CashierPaymentMethod {
    CASH = "CASH",
    CARD_TERMINAL = "CARD_TERMINAL",
    CHEQUE = "CHEQUE",
    BANK_TRANSFER = "BANK_TRANSFER"
}
export declare class RequiresTransactionRefForNonCashConstraint implements ValidatorConstraintInterface {
    validate(_value: string | undefined, args: ValidationArguments): boolean;
    defaultMessage(args: ValidationArguments): string;
}
export declare class CreateOnlinePaymentDto {
    billIds: number[];
    paymentMethod: OnlinePaymentMethod;
    returnUrl: string;
}
export declare class CreateCheckoutSessionDto {
    billIds: number[];
    successUrl: string;
    cancelUrl: string;
}
export declare class CheckoutSessionResponseDto {
    sessionId: string;
    sessionUrl: string;
    expiresAt: Date;
    totalAmount: number;
    currency: string;
}
export declare class CreateCashierPaymentDto {
    billId: number;
    customerId: number;
    paymentAmount: number;
    paymentMethod: CashierPaymentMethod;
    transactionRef?: string;
    notes?: string;
}
export declare class ConfirmStripePaymentDto {
    paymentIntentId: string;
    stripeChargeId: string;
    amount: number;
    currency: string;
    paymentMethodType: string;
    metadata?: Record<string, string>;
}
export declare class StripePaymentResponseDto {
    paymentId: number;
    billId: number;
    customerId: number | null;
    employeeId: number | null;
    paymentDate: Date;
    paymentAmount: number;
    paymentMethod: PaymentMethod;
    paymentChannel: PaymentChannel;
    paymentStatus: PaymentStatus;
    transactionRef: string | null;
    stripePaymentIntentId?: string | null;
    stripeChargeId?: string | null;
    billNumber: string;
    customerName: string;
    customerEmail: string | null;
    billAmount: number;
    outstanding: number;
    receiptNumber: string;
    recordedByName?: string;
    stripePaymentUrl?: string;
    canRefund: boolean;
    isPartialPayment: boolean;
    isOverpayment: boolean;
}
export declare class CustomerBillPaymentDto {
    billId: number;
    billNumber: string;
    billDate: Date;
    dueDate: Date;
    amount: number;
    outstanding: number;
    isOverdue: boolean;
    daysOverdue?: number;
    meterSerialNo: string;
    utilityType: string;
    billingPeriod: string;
    selected: boolean;
}
export declare class CustomerBillsResponseDto {
    customerId: number;
    customerName: string;
    customerEmail: string;
    totalOutstanding: number;
    unpaidBillCount: number;
    overdueBillCount: number;
    bills: CustomerBillPaymentDto[];
}
export declare class PaymentIntentResponseDto {
    paymentIntentId: string;
    clientSecret: string;
    amount: number;
    currency: string;
    status: string;
    publicKey: string;
    billIds: number[];
}
export declare class StripeWebhookEventDto {
    eventId: string;
    eventType: string;
    paymentIntentId?: string;
    checkoutSessionId?: string;
    status: string;
    amount: number;
    currency: string;
    chargeId?: string;
    metadata?: Record<string, string>;
}
export declare enum StripeWebhookEventType {
    PAYMENT_INTENT_SUCCEEDED = "payment_intent.succeeded",
    PAYMENT_INTENT_FAILED = "payment_intent.payment_failed",
    CHECKOUT_SESSION_COMPLETED = "checkout.session.completed",
    CHECKOUT_SESSION_EXPIRED = "checkout.session.expired",
    CHARGE_REFUNDED = "charge.refunded"
}
