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
var StripeModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.StripeModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const stripe_service_1 = require("./stripe.service");
const stripe_1 = require("stripe");
const stripe_config_1 = require("../config/stripe.config");
let StripeModule = StripeModule_1 = class StripeModule {
    constructor(configService) {
        this.configService = configService;
        this.logger = new common_1.Logger(StripeModule_1.name);
    }
    onModuleInit() {
        const secretKey = this.configService.get('stripe.secretKey');
        const publishableKey = this.configService.get('stripe.publishableKey');
        const webhookSecret = this.configService.get('stripe.webhookSecret');
        if (!secretKey) {
            this.logger.error('STRIPE_SECRET_KEY is not configured - Stripe payments will not work');
        }
        else {
            this.logger.log('Stripe secret key configured');
        }
        if (!publishableKey) {
            this.logger.warn('STRIPE_PUBLISHABLE_KEY is not configured - Frontend Stripe.js may not work');
        }
        if (!webhookSecret) {
            this.logger.warn('STRIPE_WEBHOOK_SECRET is not configured - Webhook verification will fail');
        }
        this.logger.log('Stripe module initialized');
    }
};
exports.StripeModule = StripeModule;
exports.StripeModule = StripeModule = StripeModule_1 = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        imports: [config_1.ConfigModule.forFeature(stripe_config_1.default)],
        providers: [
            {
                provide: 'STRIPE_CLIENT',
                useFactory: (configService) => {
                    const secretKey = configService.get('stripe.secretKey');
                    const apiVersion = configService.get('stripe.apiVersion');
                    if (!secretKey) {
                        throw new Error('STRIPE_SECRET_KEY is not configured');
                    }
                    return new stripe_1.default(secretKey, {
                        apiVersion: apiVersion,
                        typescript: true,
                    });
                },
                inject: [config_1.ConfigService],
            },
            stripe_service_1.StripeService,
        ],
        exports: [stripe_service_1.StripeService, 'STRIPE_CLIENT'],
    }),
    __metadata("design:paramtypes", [config_1.ConfigService])
], StripeModule);
//# sourceMappingURL=stripe.module.js.map