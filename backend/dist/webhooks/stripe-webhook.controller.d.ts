import { RawBodyRequest } from '@nestjs/common';
import { Request, Response } from 'express';
import { StripeService } from '../stripe/stripe.service';
import { PaymentService } from '../payments/payment.service';
export declare class StripeWebhookController {
    private readonly stripeService;
    private readonly paymentService;
    private readonly logger;
    private readonly processedEvents;
    constructor(stripeService: StripeService, paymentService: PaymentService);
    handleStripeWebhook(req: RawBodyRequest<Request>, res: Response, signature: string): Promise<void>;
    private processEventAsync;
    private handlePaymentIntentSucceeded;
    private handlePaymentIntentFailed;
    private handleChargeRefunded;
    private handleCheckoutSessionCompleted;
    private handleCheckoutSessionExpired;
    private sendPaymentConfirmationEmail;
    private sendPaymentFailureNotification;
    private sendRefundConfirmationEmail;
    private sendCheckoutConfirmationEmail;
}
