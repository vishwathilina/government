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
var StripeService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.StripeService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const stripe_1 = require("stripe");
let StripeService = StripeService_1 = class StripeService {
    constructor(stripe, configService) {
        this.stripe = stripe;
        this.configService = configService;
        this.logger = new common_1.Logger(StripeService_1.name);
        this.currency = this.configService.get('stripe.currency') || 'lkr';
        this.successUrl = this.configService.get('stripe.successUrl') || '';
        this.cancelUrl = this.configService.get('stripe.cancelUrl') || '';
    }
    toSmallestUnit(amount) {
        return Math.round(amount * 100);
    }
    fromSmallestUnit(amount) {
        return amount / 100;
    }
    async withRetry(operation, operationName, maxRetries = 3) {
        let lastError = null;
        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                return await operation();
            }
            catch (error) {
                lastError = error;
                if (error instanceof stripe_1.default.errors.StripeError) {
                    if (error.statusCode && error.statusCode >= 400 && error.statusCode < 500) {
                        this.logger.error(`${operationName} failed with client error: ${error.message}`);
                        throw error;
                    }
                }
                this.logger.warn(`${operationName} attempt ${attempt} failed: ${lastError.message}`);
                if (attempt < maxRetries) {
                    const delay = Math.pow(2, attempt) * 100;
                    await new Promise(resolve => setTimeout(resolve, delay));
                }
            }
        }
        this.logger.error(`${operationName} failed after ${maxRetries} attempts`);
        throw lastError;
    }
    async createPaymentIntent(amount, metadata, currency) {
        this.logger.log(`Creating payment intent for amount: ${amount} ${currency || this.currency}`);
        if (amount <= 0) {
            throw new common_1.BadRequestException('Payment amount must be greater than 0');
        }
        return this.withRetry(async () => {
            const paymentIntent = await this.stripe.paymentIntents.create({
                amount: this.toSmallestUnit(amount),
                currency: currency || this.currency,
                metadata: metadata,
                automatic_payment_methods: {
                    enabled: true,
                },
            });
            this.logger.log(`Payment intent created: ${paymentIntent.id}`);
            return paymentIntent;
        }, 'createPaymentIntent');
    }
    async getPaymentIntent(paymentIntentId) {
        this.logger.log(`Retrieving payment intent: ${paymentIntentId}`);
        return this.withRetry(async () => {
            const paymentIntent = await this.stripe.paymentIntents.retrieve(paymentIntentId);
            return paymentIntent;
        }, 'getPaymentIntent');
    }
    async confirmPayment(paymentIntentId) {
        this.logger.log(`Confirming payment intent: ${paymentIntentId}`);
        const paymentIntent = await this.getPaymentIntent(paymentIntentId);
        const success = paymentIntent.status === 'succeeded';
        const chargeId = paymentIntent.latest_charge;
        if (success) {
            this.logger.log(`Payment confirmed: ${paymentIntentId}, charge: ${chargeId}`);
        }
        else {
            this.logger.warn(`Payment not successful: ${paymentIntentId}, status: ${paymentIntent.status}`);
        }
        return {
            success,
            paymentIntent,
            chargeId,
        };
    }
    async createCheckoutSession(lineItems, customerId, customerEmail, successUrl, cancelUrl) {
        this.logger.log(`Creating checkout session for customer ${customerId}, ${lineItems.length} items`);
        if (lineItems.length === 0) {
            throw new common_1.BadRequestException('At least one line item is required');
        }
        const totalAmount = lineItems.reduce((sum, item) => sum + item.amount, 0);
        if (totalAmount <= 0) {
            throw new common_1.BadRequestException('Total amount must be greater than 0');
        }
        const stripeLineItems = lineItems.map(item => ({
            price_data: {
                currency: this.currency,
                product_data: {
                    name: `Bill ${item.billNumber}`,
                    description: item.description,
                },
                unit_amount: this.toSmallestUnit(item.amount),
            },
            quantity: 1,
        }));
        const metadata = {
            customerId: customerId.toString(),
            customerEmail: customerEmail,
            billIds: lineItems.map(item => item.billId).join(','),
            source: 'checkout_session',
        };
        return this.withRetry(async () => {
            const session = await this.stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                line_items: stripeLineItems,
                mode: 'payment',
                success_url: `${successUrl || this.successUrl}?session_id={CHECKOUT_SESSION_ID}`,
                cancel_url: cancelUrl || this.cancelUrl,
                customer_email: customerEmail,
                metadata: metadata,
                payment_intent_data: {
                    metadata: metadata,
                },
            });
            this.logger.log(`Checkout session created: ${session.id}`);
            return session;
        }, 'createCheckoutSession');
    }
    async getCheckoutSession(sessionId) {
        this.logger.log(`Retrieving checkout session: ${sessionId}`);
        return this.withRetry(async () => {
            const session = await this.stripe.checkout.sessions.retrieve(sessionId, {
                expand: ['payment_intent', 'customer'],
            });
            return session;
        }, 'getCheckoutSession');
    }
    async refundPayment(paymentIntentId, amount, reason) {
        this.logger.log(`Processing refund for payment intent: ${paymentIntentId}, amount: ${amount || 'full'}`);
        const refundParams = {
            payment_intent: paymentIntentId,
        };
        if (amount) {
            refundParams.amount = this.toSmallestUnit(amount);
        }
        if (reason) {
            refundParams.reason = reason;
        }
        return this.withRetry(async () => {
            const refund = await this.stripe.refunds.create(refundParams);
            this.logger.log(`Refund created: ${refund.id}, status: ${refund.status}`);
            return refund;
        }, 'refundPayment');
    }
    async getRefund(refundId) {
        this.logger.log(`Retrieving refund: ${refundId}`);
        return this.withRetry(async () => {
            return await this.stripe.refunds.retrieve(refundId);
        }, 'getRefund');
    }
    async createCustomer(email, name, metadata) {
        this.logger.log(`Creating Stripe customer: ${email}`);
        return this.withRetry(async () => {
            const customer = await this.stripe.customers.create({
                email,
                name,
                metadata: metadata,
            });
            this.logger.log(`Stripe customer created: ${customer.id}`);
            return customer;
        }, 'createCustomer');
    }
    async getCustomer(customerId) {
        this.logger.log(`Retrieving Stripe customer: ${customerId}`);
        return this.withRetry(async () => {
            return await this.stripe.customers.retrieve(customerId);
        }, 'getCustomer');
    }
    async findCustomerByEmail(email) {
        this.logger.log(`Finding Stripe customer by email: ${email}`);
        const customers = await this.stripe.customers.list({
            email,
            limit: 1,
        });
        return customers.data.length > 0 ? customers.data[0] : null;
    }
    constructWebhookEvent(payload, signature) {
        const webhookSecret = this.configService.get('stripe.webhookSecret');
        if (!webhookSecret) {
            this.logger.error('Webhook secret not configured');
            throw new common_1.InternalServerErrorException('Webhook secret not configured');
        }
        try {
            const event = this.stripe.webhooks.constructEvent(payload, signature, webhookSecret);
            this.logger.log(`Webhook event verified: ${event.type}, id: ${event.id}`);
            return event;
        }
        catch (error) {
            this.logger.error(`Webhook signature verification failed: ${error.message}`);
            throw new common_1.BadRequestException('Webhook signature verification failed');
        }
    }
    extractPaymentIntentFromEvent(event) {
        if (event.type.startsWith('payment_intent.')) {
            return event.data.object;
        }
        return null;
    }
    extractCheckoutSessionFromEvent(event) {
        if (event.type.startsWith('checkout.session.')) {
            return event.data.object;
        }
        return null;
    }
    getPublishableKey() {
        const key = this.configService.get('stripe.publishableKey');
        if (!key) {
            throw new common_1.InternalServerErrorException('Stripe publishable key not configured');
        }
        return key;
    }
    async testConnection() {
        try {
            await this.stripe.balance.retrieve();
            this.logger.log('Stripe connection test successful');
            return true;
        }
        catch (error) {
            this.logger.error(`Stripe connection test failed: ${error.message}`);
            return false;
        }
    }
};
exports.StripeService = StripeService;
exports.StripeService = StripeService = StripeService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('STRIPE_CLIENT')),
    __metadata("design:paramtypes", [stripe_1.default,
        config_1.ConfigService])
], StripeService);
//# sourceMappingURL=stripe.service.js.map