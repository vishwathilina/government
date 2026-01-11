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
Object.defineProperty(exports, "__esModule", { value: true });
exports.StripeWebhookEventType = exports.StripeWebhookEventDto = exports.PaymentIntentResponseDto = exports.CustomerBillsResponseDto = exports.CustomerBillPaymentDto = exports.StripePaymentResponseDto = exports.ConfirmStripePaymentDto = exports.CreateCashierPaymentDto = exports.CheckoutSessionResponseDto = exports.CreateCheckoutSessionDto = exports.CreateOnlinePaymentDto = exports.RequiresTransactionRefForNonCashConstraint = exports.CashierPaymentMethod = exports.OnlinePaymentMethod = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const swagger_1 = require("@nestjs/swagger");
const payment_entity_1 = require("../../database/entities/payment.entity");
var OnlinePaymentMethod;
(function (OnlinePaymentMethod) {
    OnlinePaymentMethod["STRIPE"] = "STRIPE";
})(OnlinePaymentMethod || (exports.OnlinePaymentMethod = OnlinePaymentMethod = {}));
var CashierPaymentMethod;
(function (CashierPaymentMethod) {
    CashierPaymentMethod["CASH"] = "CASH";
    CashierPaymentMethod["CARD_TERMINAL"] = "CARD_TERMINAL";
    CashierPaymentMethod["CHEQUE"] = "CHEQUE";
    CashierPaymentMethod["BANK_TRANSFER"] = "BANK_TRANSFER";
})(CashierPaymentMethod || (exports.CashierPaymentMethod = CashierPaymentMethod = {}));
let RequiresTransactionRefForNonCashConstraint = class RequiresTransactionRefForNonCashConstraint {
    validate(_value, args) {
        const dto = args.object;
        if (dto.paymentMethod === CashierPaymentMethod.CASH) {
            return true;
        }
        return dto.transactionRef !== undefined && dto.transactionRef.trim().length > 0;
    }
    defaultMessage(args) {
        const dto = args.object;
        return `Transaction reference is required for ${dto.paymentMethod} payments`;
    }
};
exports.RequiresTransactionRefForNonCashConstraint = RequiresTransactionRefForNonCashConstraint;
exports.RequiresTransactionRefForNonCashConstraint = RequiresTransactionRefForNonCashConstraint = __decorate([
    (0, class_validator_1.ValidatorConstraint)({ name: 'requiresTransactionRefForNonCash', async: false })
], RequiresTransactionRefForNonCashConstraint);
function RequiresTransactionRefForNonCash(validationOptions) {
    return function (object, propertyName) {
        (0, class_validator_1.registerDecorator)({
            name: 'requiresTransactionRefForNonCash',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: RequiresTransactionRefForNonCashConstraint,
        });
    };
}
class CreateOnlinePaymentDto {
}
exports.CreateOnlinePaymentDto = CreateOnlinePaymentDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Array of bill IDs to pay (supports multi-bill payment)',
        example: [1, 2, 3],
        type: [Number],
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayMinSize)(1, { message: 'At least one bill must be selected' }),
    (0, class_validator_1.IsNumber)({}, { each: true }),
    __metadata("design:type", Array)
], CreateOnlinePaymentDto.prototype, "billIds", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Payment method for online payment',
        enum: OnlinePaymentMethod,
        example: OnlinePaymentMethod.STRIPE,
    }),
    (0, class_validator_1.IsEnum)(OnlinePaymentMethod),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateOnlinePaymentDto.prototype, "paymentMethod", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'URL to redirect after payment completion',
        example: 'https://example.com/payments/complete',
    }),
    (0, class_validator_1.IsUrl)({}, { message: 'Return URL must be a valid URL' }),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateOnlinePaymentDto.prototype, "returnUrl", void 0);
class CreateCheckoutSessionDto {
}
exports.CreateCheckoutSessionDto = CreateCheckoutSessionDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Array of bill IDs for checkout',
        example: [1, 2],
        type: [Number],
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayMinSize)(1, { message: 'At least one bill must be selected' }),
    (0, class_validator_1.IsNumber)({}, { each: true }),
    __metadata("design:type", Array)
], CreateCheckoutSessionDto.prototype, "billIds", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'URL to redirect on successful payment',
        example: 'https://example.com/payments/success',
    }),
    (0, class_validator_1.IsUrl)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateCheckoutSessionDto.prototype, "successUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'URL to redirect if payment is cancelled',
        example: 'https://example.com/payments/cancel',
    }),
    (0, class_validator_1.IsUrl)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateCheckoutSessionDto.prototype, "cancelUrl", void 0);
class CheckoutSessionResponseDto {
}
exports.CheckoutSessionResponseDto = CheckoutSessionResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Stripe Checkout session ID' }),
    __metadata("design:type", String)
], CheckoutSessionResponseDto.prototype, "sessionId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'URL to redirect customer for payment' }),
    __metadata("design:type", String)
], CheckoutSessionResponseDto.prototype, "sessionUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Session expiration time' }),
    __metadata("design:type", Date)
], CheckoutSessionResponseDto.prototype, "expiresAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Total amount to be charged' }),
    __metadata("design:type", Number)
], CheckoutSessionResponseDto.prototype, "totalAmount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Currency code' }),
    __metadata("design:type", String)
], CheckoutSessionResponseDto.prototype, "currency", void 0);
class CreateCashierPaymentDto {
}
exports.CreateCashierPaymentDto = CreateCashierPaymentDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Bill ID to apply payment to',
        example: 123,
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], CreateCashierPaymentDto.prototype, "billId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Customer ID making payment',
        example: 456,
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], CreateCashierPaymentDto.prototype, "customerId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Payment amount',
        example: 1500.00,
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0.01, { message: 'Payment amount must be at least 0.01' }),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], CreateCashierPaymentDto.prototype, "paymentAmount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Payment method',
        enum: CashierPaymentMethod,
        example: CashierPaymentMethod.CASH,
    }),
    (0, class_validator_1.IsEnum)(CashierPaymentMethod),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateCashierPaymentDto.prototype, "paymentMethod", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Transaction reference (required for non-cash payments)',
        example: 'TXN-123456',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(120),
    RequiresTransactionRefForNonCash(),
    __metadata("design:type", String)
], CreateCashierPaymentDto.prototype, "transactionRef", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Additional notes',
        example: 'Payment received in person',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(500),
    __metadata("design:type", String)
], CreateCashierPaymentDto.prototype, "notes", void 0);
class ConfirmStripePaymentDto {
}
exports.ConfirmStripePaymentDto = ConfirmStripePaymentDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Stripe Payment Intent ID',
        example: 'pi_xxx',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], ConfirmStripePaymentDto.prototype, "paymentIntentId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Stripe Charge ID',
        example: 'ch_xxx',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], ConfirmStripePaymentDto.prototype, "stripeChargeId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Amount in smallest currency unit (cents)',
        example: 150000,
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], ConfirmStripePaymentDto.prototype, "amount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Currency code',
        example: 'lkr',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], ConfirmStripePaymentDto.prototype, "currency", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Payment method type from Stripe',
        example: 'card',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], ConfirmStripePaymentDto.prototype, "paymentMethodType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Metadata from Stripe payment',
        example: { billIds: '1,2,3', customerId: '456' },
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], ConfirmStripePaymentDto.prototype, "metadata", void 0);
class StripePaymentResponseDto {
}
exports.StripePaymentResponseDto = StripePaymentResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Payment ID' }),
    __metadata("design:type", Number)
], StripePaymentResponseDto.prototype, "paymentId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Bill ID' }),
    __metadata("design:type", Number)
], StripePaymentResponseDto.prototype, "billId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Customer ID', nullable: true }),
    __metadata("design:type", Object)
], StripePaymentResponseDto.prototype, "customerId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Employee ID who recorded payment', nullable: true }),
    __metadata("design:type", Object)
], StripePaymentResponseDto.prototype, "employeeId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Payment date and time' }),
    __metadata("design:type", Date)
], StripePaymentResponseDto.prototype, "paymentDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Payment amount' }),
    __metadata("design:type", Number)
], StripePaymentResponseDto.prototype, "paymentAmount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Payment method', enum: payment_entity_1.PaymentMethod }),
    __metadata("design:type", String)
], StripePaymentResponseDto.prototype, "paymentMethod", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Payment channel', enum: payment_entity_1.PaymentChannel }),
    __metadata("design:type", String)
], StripePaymentResponseDto.prototype, "paymentChannel", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Payment status', enum: payment_entity_1.PaymentStatus }),
    __metadata("design:type", String)
], StripePaymentResponseDto.prototype, "paymentStatus", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Transaction reference', nullable: true }),
    __metadata("design:type", Object)
], StripePaymentResponseDto.prototype, "transactionRef", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Stripe Payment Intent ID' }),
    __metadata("design:type", Object)
], StripePaymentResponseDto.prototype, "stripePaymentIntentId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Stripe Charge ID' }),
    __metadata("design:type", Object)
], StripePaymentResponseDto.prototype, "stripeChargeId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Bill number' }),
    __metadata("design:type", String)
], StripePaymentResponseDto.prototype, "billNumber", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Customer name' }),
    __metadata("design:type", String)
], StripePaymentResponseDto.prototype, "customerName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Customer email', nullable: true }),
    __metadata("design:type", Object)
], StripePaymentResponseDto.prototype, "customerEmail", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Total bill amount' }),
    __metadata("design:type", Number)
], StripePaymentResponseDto.prototype, "billAmount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Outstanding amount after payment' }),
    __metadata("design:type", Number)
], StripePaymentResponseDto.prototype, "outstanding", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Formatted receipt number' }),
    __metadata("design:type", String)
], StripePaymentResponseDto.prototype, "receiptNumber", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Name of employee who recorded payment' }),
    __metadata("design:type", String)
], StripePaymentResponseDto.prototype, "recordedByName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Stripe payment URL for pending payments' }),
    __metadata("design:type", String)
], StripePaymentResponseDto.prototype, "stripePaymentUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Whether payment can be refunded' }),
    __metadata("design:type", Boolean)
], StripePaymentResponseDto.prototype, "canRefund", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Whether this is a partial payment' }),
    __metadata("design:type", Boolean)
], StripePaymentResponseDto.prototype, "isPartialPayment", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Whether this was an overpayment' }),
    __metadata("design:type", Boolean)
], StripePaymentResponseDto.prototype, "isOverpayment", void 0);
class CustomerBillPaymentDto {
}
exports.CustomerBillPaymentDto = CustomerBillPaymentDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Bill ID' }),
    __metadata("design:type", Number)
], CustomerBillPaymentDto.prototype, "billId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Bill number' }),
    __metadata("design:type", String)
], CustomerBillPaymentDto.prototype, "billNumber", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Bill date' }),
    __metadata("design:type", Date)
], CustomerBillPaymentDto.prototype, "billDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Due date' }),
    __metadata("design:type", Date)
], CustomerBillPaymentDto.prototype, "dueDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Total bill amount' }),
    __metadata("design:type", Number)
], CustomerBillPaymentDto.prototype, "amount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Outstanding amount' }),
    __metadata("design:type", Number)
], CustomerBillPaymentDto.prototype, "outstanding", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Whether bill is overdue' }),
    __metadata("design:type", Boolean)
], CustomerBillPaymentDto.prototype, "isOverdue", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Days overdue (if applicable)' }),
    __metadata("design:type", Number)
], CustomerBillPaymentDto.prototype, "daysOverdue", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Meter serial number' }),
    __metadata("design:type", String)
], CustomerBillPaymentDto.prototype, "meterSerialNo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Utility type' }),
    __metadata("design:type", String)
], CustomerBillPaymentDto.prototype, "utilityType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Billing period' }),
    __metadata("design:type", String)
], CustomerBillPaymentDto.prototype, "billingPeriod", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Whether bill is selected for payment', default: false }),
    __metadata("design:type", Boolean)
], CustomerBillPaymentDto.prototype, "selected", void 0);
class CustomerBillsResponseDto {
}
exports.CustomerBillsResponseDto = CustomerBillsResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Customer ID' }),
    __metadata("design:type", Number)
], CustomerBillsResponseDto.prototype, "customerId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Customer name' }),
    __metadata("design:type", String)
], CustomerBillsResponseDto.prototype, "customerName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Customer email' }),
    __metadata("design:type", String)
], CustomerBillsResponseDto.prototype, "customerEmail", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Total outstanding amount' }),
    __metadata("design:type", Number)
], CustomerBillsResponseDto.prototype, "totalOutstanding", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Number of unpaid bills' }),
    __metadata("design:type", Number)
], CustomerBillsResponseDto.prototype, "unpaidBillCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Number of overdue bills' }),
    __metadata("design:type", Number)
], CustomerBillsResponseDto.prototype, "overdueBillCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'List of payable bills', type: [CustomerBillPaymentDto] }),
    (0, class_transformer_1.Type)(() => CustomerBillPaymentDto),
    __metadata("design:type", Array)
], CustomerBillsResponseDto.prototype, "bills", void 0);
class PaymentIntentResponseDto {
}
exports.PaymentIntentResponseDto = PaymentIntentResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Stripe Payment Intent ID' }),
    __metadata("design:type", String)
], PaymentIntentResponseDto.prototype, "paymentIntentId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Client secret for Stripe.js' }),
    __metadata("design:type", String)
], PaymentIntentResponseDto.prototype, "clientSecret", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Amount in standard currency unit' }),
    __metadata("design:type", Number)
], PaymentIntentResponseDto.prototype, "amount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Currency code' }),
    __metadata("design:type", String)
], PaymentIntentResponseDto.prototype, "currency", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Payment Intent status' }),
    __metadata("design:type", String)
], PaymentIntentResponseDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Stripe publishable key for frontend' }),
    __metadata("design:type", String)
], PaymentIntentResponseDto.prototype, "publicKey", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'List of bill IDs included' }),
    __metadata("design:type", Array)
], PaymentIntentResponseDto.prototype, "billIds", void 0);
class StripeWebhookEventDto {
}
exports.StripeWebhookEventDto = StripeWebhookEventDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Stripe event ID' }),
    __metadata("design:type", String)
], StripeWebhookEventDto.prototype, "eventId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Event type (e.g., payment_intent.succeeded)' }),
    __metadata("design:type", String)
], StripeWebhookEventDto.prototype, "eventType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Payment Intent ID' }),
    __metadata("design:type", String)
], StripeWebhookEventDto.prototype, "paymentIntentId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Checkout Session ID' }),
    __metadata("design:type", String)
], StripeWebhookEventDto.prototype, "checkoutSessionId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Payment status' }),
    __metadata("design:type", String)
], StripeWebhookEventDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Amount in smallest currency unit' }),
    __metadata("design:type", Number)
], StripeWebhookEventDto.prototype, "amount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Currency code' }),
    __metadata("design:type", String)
], StripeWebhookEventDto.prototype, "currency", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Charge ID' }),
    __metadata("design:type", String)
], StripeWebhookEventDto.prototype, "chargeId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Metadata from payment' }),
    __metadata("design:type", Object)
], StripeWebhookEventDto.prototype, "metadata", void 0);
var StripeWebhookEventType;
(function (StripeWebhookEventType) {
    StripeWebhookEventType["PAYMENT_INTENT_SUCCEEDED"] = "payment_intent.succeeded";
    StripeWebhookEventType["PAYMENT_INTENT_FAILED"] = "payment_intent.payment_failed";
    StripeWebhookEventType["CHECKOUT_SESSION_COMPLETED"] = "checkout.session.completed";
    StripeWebhookEventType["CHECKOUT_SESSION_EXPIRED"] = "checkout.session.expired";
    StripeWebhookEventType["CHARGE_REFUNDED"] = "charge.refunded";
})(StripeWebhookEventType || (exports.StripeWebhookEventType = StripeWebhookEventType = {}));
//# sourceMappingURL=stripe-payment.dto.js.map