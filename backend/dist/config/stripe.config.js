"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("@nestjs/config");
exports.default = (0, config_1.registerAs)('stripe', () => ({
    secretKey: process.env.STRIPE_SECRET_KEY,
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
    currency: process.env.STRIPE_CURRENCY || 'lkr',
    successUrl: process.env.STRIPE_SUCCESS_URL || 'http://localhost:3000/payments/success',
    cancelUrl: process.env.STRIPE_CANCEL_URL || 'http://localhost:3000/payments/cancel',
    apiVersion: '2024-12-18.acacia',
}));
//# sourceMappingURL=stripe.config.js.map