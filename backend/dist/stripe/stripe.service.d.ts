import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
export interface CheckoutLineItem {
    billId: number;
    billNumber: string;
    description: string;
    amount: number;
}
export interface PaymentMetadata {
    billId?: string;
    billIds?: string;
    customerId?: string;
    customerEmail?: string;
    source?: string;
    [key: string]: string | undefined;
}
export declare class StripeService {
    private readonly stripe;
    private readonly configService;
    private readonly logger;
    private readonly currency;
    private readonly successUrl;
    private readonly cancelUrl;
    constructor(stripe: Stripe, configService: ConfigService);
    private toSmallestUnit;
    private fromSmallestUnit;
    private withRetry;
    createPaymentIntent(amount: number, metadata: PaymentMetadata, currency?: string): Promise<Stripe.PaymentIntent>;
    getPaymentIntent(paymentIntentId: string): Promise<Stripe.PaymentIntent>;
    confirmPayment(paymentIntentId: string): Promise<{
        success: boolean;
        paymentIntent: Stripe.PaymentIntent;
        chargeId: string | null;
    }>;
    createCheckoutSession(lineItems: CheckoutLineItem[], customerId: number, customerEmail: string, successUrl?: string, cancelUrl?: string): Promise<Stripe.Checkout.Session>;
    getCheckoutSession(sessionId: string): Promise<Stripe.Checkout.Session>;
    refundPayment(paymentIntentId: string, amount?: number, reason?: 'duplicate' | 'fraudulent' | 'requested_by_customer'): Promise<Stripe.Refund>;
    getRefund(refundId: string): Promise<Stripe.Refund>;
    createCustomer(email: string, name: string, metadata: PaymentMetadata): Promise<Stripe.Customer>;
    getCustomer(customerId: string): Promise<Stripe.Customer | Stripe.DeletedCustomer>;
    findCustomerByEmail(email: string): Promise<Stripe.Customer | null>;
    constructWebhookEvent(payload: Buffer, signature: string): Stripe.Event;
    extractPaymentIntentFromEvent(event: Stripe.Event): Stripe.PaymentIntent | null;
    extractCheckoutSessionFromEvent(event: Stripe.Event): Stripe.Checkout.Session | null;
    getPublishableKey(): string;
    testConnection(): Promise<boolean>;
}
