"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var StripeWebhookController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.StripeWebhookController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const stripe_service_1 = require("../stripe/stripe.service");
const payment_service_1 = require("../payments/payment.service");
const dto_1 = require("../payments/dto");
let StripeWebhookController = StripeWebhookController_1 = class StripeWebhookController {
    constructor(stripeService, paymentService) {
        this.stripeService = stripeService;
        this.paymentService = paymentService;
        this.logger = new common_1.Logger(StripeWebhookController_1.name);
        this.processedEvents = new Set();
    }
    async handleStripeWebhook(req, res, signature) {
        const startTime = Date.now();
        const rawBody = req.rawBody;
        if (!rawBody) {
            this.logger.error('No raw body available in request');
            res.status(common_1.HttpStatus.BAD_REQUEST).json({ error: 'No request body' });
            return;
        }
        if (!signature) {
            this.logger.error('No stripe-signature header present');
            res.status(common_1.HttpStatus.BAD_REQUEST).json({ error: 'Missing signature' });
            return;
        }
        let event;
        try {
            event = this.stripeService.constructWebhookEvent(rawBody, signature);
            this.logger.log(`Received webhook event: ${event.type}, ID: ${event.id}`);
        }
        catch (error) {
            this.logger.error(`Webhook signature verification failed: ${error.message}`);
            res.status(common_1.HttpStatus.BAD_REQUEST).json({ error: 'Invalid signature' });
            return;
        }
        if (this.processedEvents.has(event.id)) {
            this.logger.warn(`Event ${event.id} already processed, skipping`);
            res.status(common_1.HttpStatus.OK).json({ received: true, duplicate: true });
            return;
        }
        this.processedEvents.add(event.id);
        if (this.processedEvents.size > 1000) {
            const iterator = this.processedEvents.values();
            for (let i = 0; i < 100; i++) {
                this.processedEvents.delete(iterator.next().value);
            }
        }
        res.status(common_1.HttpStatus.OK).json({ received: true });
        this.processEventAsync(event).catch(error => {
            this.logger.error(`Async event processing failed for ${event.id}:`, error);
        });
        const elapsed = Date.now() - startTime;
        this.logger.log(`Webhook response sent in ${elapsed}ms`);
    }
    async processEventAsync(event) {
        this.logger.log(`Processing event ${event.type} asynchronously`);
        try {
            switch (event.type) {
                case 'payment_intent.succeeded':
                    await this.handlePaymentIntentSucceeded(event);
                    break;
                case 'payment_intent.payment_failed':
                    await this.handlePaymentIntentFailed(event);
                    break;
                case 'charge.refunded':
                    await this.handleChargeRefunded(event);
                    break;
                case 'checkout.session.completed':
                    await this.handleCheckoutSessionCompleted(event);
                    break;
                case 'checkout.session.expired':
                    await this.handleCheckoutSessionExpired(event);
                    break;
                default:
                    this.logger.debug(`Unhandled event type: ${event.type}`);
            }
            this.logger.log(`Event ${event.id} processed successfully`);
        }
        catch (error) {
            this.logger.error(`Error processing event ${event.id}:`, error);
        }
    }
    async handlePaymentIntentSucceeded(event) {
        const paymentIntent = event.data.object;
        this.logger.log(`Payment succeeded: ${paymentIntent.id}, amount: ${paymentIntent.amount}`);
        const eventDto = {
            eventId: event.id,
            eventType: dto_1.StripeWebhookEventType.PAYMENT_INTENT_SUCCEEDED,
            paymentIntentId: paymentIntent.id,
            status: paymentIntent.status,
            amount: paymentIntent.amount,
            currency: paymentIntent.currency,
            chargeId: paymentIntent.latest_charge || undefined,
            metadata: paymentIntent.metadata,
        };
        await this.paymentService.handleStripeWebhook(eventDto);
        this.sendPaymentConfirmationEmail(paymentIntent).catch(err => {
            this.logger.warn(`Failed to send confirmation email: ${err.message}`);
        });
    }
    async handlePaymentIntentFailed(event) {
        const paymentIntent = event.data.object;
        this.logger.warn(`Payment failed: ${paymentIntent.id}`);
        const eventDto = {
            eventId: event.id,
            eventType: dto_1.StripeWebhookEventType.PAYMENT_INTENT_FAILED,
            paymentIntentId: paymentIntent.id,
            status: paymentIntent.status,
            amount: paymentIntent.amount,
            currency: paymentIntent.currency,
            metadata: paymentIntent.metadata,
        };
        await this.paymentService.handleStripeWebhook(eventDto);
        this.sendPaymentFailureNotification(paymentIntent).catch(err => {
            this.logger.warn(`Failed to send failure notification: ${err.message}`);
        });
    }
    async handleChargeRefunded(event) {
        const charge = event.data.object;
        this.logger.log(`Charge refunded: ${charge.id}, amount_refunded: ${charge.amount_refunded}`);
        const eventDto = {
            eventId: event.id,
            eventType: dto_1.StripeWebhookEventType.CHARGE_REFUNDED,
            paymentIntentId: charge.payment_intent || undefined,
            chargeId: charge.id,
            status: charge.status,
            amount: charge.amount_refunded,
            currency: charge.currency,
            metadata: charge.metadata,
        };
        await this.paymentService.handleStripeWebhook(eventDto);
        this.sendRefundConfirmationEmail(charge).catch(err => {
            this.logger.warn(`Failed to send refund confirmation: ${err.message}`);
        });
    }
    async handleCheckoutSessionCompleted(event) {
        const session = event.data.object;
        this.logger.log(`Checkout completed: ${session.id}, payment_status: ${session.payment_status}`);
        if (session.payment_status !== 'paid') {
            this.logger.warn(`Checkout session ${session.id} not paid, status: ${session.payment_status}`);
            return;
        }
        const eventDto = {
            eventId: event.id,
            eventType: dto_1.StripeWebhookEventType.CHECKOUT_SESSION_COMPLETED,
            checkoutSessionId: session.id,
            paymentIntentId: session.payment_intent || undefined,
            status: session.payment_status,
            amount: session.amount_total || 0,
            currency: session.currency || 'lkr',
            metadata: session.metadata,
        };
        await this.paymentService.handleStripeWebhook(eventDto);
        this.sendCheckoutConfirmationEmail(session).catch(err => {
            this.logger.warn(`Failed to send checkout confirmation: ${err.message}`);
        });
    }
    async handleCheckoutSessionExpired(event) {
        const session = event.data.object;
        this.logger.log(`Checkout expired: ${session.id}`);
        const eventDto = {
            eventId: event.id,
            eventType: dto_1.StripeWebhookEventType.CHECKOUT_SESSION_EXPIRED,
            checkoutSessionId: session.id,
            status: 'expired',
            amount: session.amount_total || 0,
            currency: session.currency || 'lkr',
            metadata: session.metadata,
        };
        await this.paymentService.handleStripeWebhook(eventDto);
    }
    async sendPaymentConfirmationEmail(paymentIntent) {
        const customerEmail = paymentIntent.metadata?.customerEmail;
        if (customerEmail) {
            this.logger.log(`Would send confirmation email to ${customerEmail} for payment ${paymentIntent.id}`);
        }
    }
    async sendPaymentFailureNotification(paymentIntent) {
        const customerEmail = paymentIntent.metadata?.customerEmail;
        if (customerEmail) {
            this.logger.log(`Would send failure notification to ${customerEmail} for payment ${paymentIntent.id}`);
        }
    }
    async sendRefundConfirmationEmail(charge) {
        const customerEmail = charge.metadata?.customerEmail || charge.billing_details?.email;
        if (customerEmail) {
            this.logger.log(`Would send refund confirmation to ${customerEmail} for charge ${charge.id}`);
        }
    }
    async sendCheckoutConfirmationEmail(session) {
        const customerEmail = session.customer_email || session.metadata?.customerEmail;
        if (customerEmail) {
            this.logger.log(`Would send checkout confirmation to ${customerEmail} for session ${session.id}`);
        }
    }
};
exports.StripeWebhookController = StripeWebhookController;
__decorate([
    (0, common_1.Post)('stripe'),
    (0, swagger_1.ApiOperation)({
        summary: 'Stripe webhook endpoint',
        description: 'Receives and processes webhook events from Stripe. No authentication required - uses Stripe signature verification.',
    }),
    (0, swagger_1.ApiHeader)({
        name: 'stripe-signature',
        description: 'Stripe webhook signature for verification',
        required: true,
    }),
    (0, swagger_1.ApiExcludeEndpoint)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Headers)('stripe-signature')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String]),
    __metadata("design:returntype", Promise)
], StripeWebhookController.prototype, "handleStripeWebhook", null);
exports.StripeWebhookController = StripeWebhookController = StripeWebhookController_1 = __decorate([
    (0, swagger_1.ApiTags)('Webhooks'),
    (0, common_1.Controller)('webhooks'),
    __metadata("design:paramtypes", [stripe_service_1.StripeService,
        payment_service_1.PaymentService])
], StripeWebhookController);
//# sourceMappingURL=stripe-webhook.controller.js.map