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
exports.Payment = exports.StripePaymentIntentRequiredConstraint = exports.TransactionRefRequiredConstraint = exports.IsNotFutureDateConstraint = exports.IsPositiveAmountConstraint = exports.PaymentStatus = exports.PaymentChannel = exports.STRIPE_PAYMENT_METHODS = exports.PAYMENT_METHODS_REQUIRING_REF = exports.PaymentMethod = void 0;
const typeorm_1 = require("typeorm");
const class_validator_1 = require("class-validator");
const bill_entity_1 = require("./bill.entity");
const employee_entity_1 = require("./employee.entity");
const customer_entity_1 = require("./customer.entity");
var PaymentMethod;
(function (PaymentMethod) {
    PaymentMethod["STRIPE_CARD"] = "STRIPE_CARD";
    PaymentMethod["STRIPE_WALLET"] = "STRIPE_WALLET";
    PaymentMethod["CASH"] = "CASH";
    PaymentMethod["CARD_TERMINAL"] = "CARD_TERMINAL";
    PaymentMethod["BANK_TRANSFER"] = "BANK_TRANSFER";
    PaymentMethod["CHEQUE"] = "CHEQUE";
    PaymentMethod["CARD"] = "CARD";
    PaymentMethod["ONLINE"] = "ONLINE";
    PaymentMethod["MOBILE_MONEY"] = "MOBILE_MONEY";
})(PaymentMethod || (exports.PaymentMethod = PaymentMethod = {}));
exports.PAYMENT_METHODS_REQUIRING_REF = [
    PaymentMethod.STRIPE_CARD,
    PaymentMethod.STRIPE_WALLET,
    PaymentMethod.ONLINE,
    PaymentMethod.BANK_TRANSFER,
    PaymentMethod.MOBILE_MONEY,
    PaymentMethod.CARD_TERMINAL,
];
exports.STRIPE_PAYMENT_METHODS = [
    PaymentMethod.STRIPE_CARD,
    PaymentMethod.STRIPE_WALLET,
];
var PaymentChannel;
(function (PaymentChannel) {
    PaymentChannel["CUSTOMER_PORTAL"] = "CUSTOMER_PORTAL";
    PaymentChannel["CASHIER_PORTAL"] = "CASHIER_PORTAL";
    PaymentChannel["MOBILE_APP"] = "MOBILE_APP";
    PaymentChannel["OFFICE"] = "OFFICE";
    PaymentChannel["WEBSITE"] = "WEBSITE";
    PaymentChannel["BANK"] = "BANK";
    PaymentChannel["ATM"] = "ATM";
})(PaymentChannel || (exports.PaymentChannel = PaymentChannel = {}));
var PaymentStatus;
(function (PaymentStatus) {
    PaymentStatus["PENDING"] = "PENDING";
    PaymentStatus["COMPLETED"] = "COMPLETED";
    PaymentStatus["FAILED"] = "FAILED";
    PaymentStatus["REFUNDED"] = "REFUNDED";
    PaymentStatus["CANCELLED"] = "CANCELLED";
})(PaymentStatus || (exports.PaymentStatus = PaymentStatus = {}));
let IsPositiveAmountConstraint = class IsPositiveAmountConstraint {
    validate(value) {
        return typeof value === 'number' && value > 0;
    }
    defaultMessage() {
        return 'Payment amount must be greater than 0';
    }
};
exports.IsPositiveAmountConstraint = IsPositiveAmountConstraint;
exports.IsPositiveAmountConstraint = IsPositiveAmountConstraint = __decorate([
    (0, class_validator_1.ValidatorConstraint)({ name: 'isPositiveAmount', async: false })
], IsPositiveAmountConstraint);
let IsNotFutureDateConstraint = class IsNotFutureDateConstraint {
    validate(value) {
        if (!(value instanceof Date) || isNaN(value.getTime())) {
            return false;
        }
        const now = new Date();
        return value <= now;
    }
    defaultMessage() {
        return 'Payment date cannot be in the future';
    }
};
exports.IsNotFutureDateConstraint = IsNotFutureDateConstraint;
exports.IsNotFutureDateConstraint = IsNotFutureDateConstraint = __decorate([
    (0, class_validator_1.ValidatorConstraint)({ name: 'isNotFutureDate', async: false })
], IsNotFutureDateConstraint);
let TransactionRefRequiredConstraint = class TransactionRefRequiredConstraint {
    validate(_value, args) {
        const payment = args.object;
        const requiresRef = exports.PAYMENT_METHODS_REQUIRING_REF.includes(payment.paymentMethod);
        if (requiresRef && payment.paymentStatus === PaymentStatus.COMPLETED) {
            return payment.transactionRef !== null && payment.transactionRef.trim().length > 0;
        }
        return true;
    }
    defaultMessage(args) {
        const payment = args.object;
        return `Transaction reference is required for completed ${payment.paymentMethod} payments`;
    }
};
exports.TransactionRefRequiredConstraint = TransactionRefRequiredConstraint;
exports.TransactionRefRequiredConstraint = TransactionRefRequiredConstraint = __decorate([
    (0, class_validator_1.ValidatorConstraint)({ name: 'transactionRefRequired', async: false })
], TransactionRefRequiredConstraint);
let StripePaymentIntentRequiredConstraint = class StripePaymentIntentRequiredConstraint {
    validate(_value, args) {
        const payment = args.object;
        const isStripePayment = exports.STRIPE_PAYMENT_METHODS.includes(payment.paymentMethod);
        if (isStripePayment) {
            return (payment.stripePaymentIntentId != null && payment.stripePaymentIntentId.trim().length > 0);
        }
        return true;
    }
    defaultMessage(args) {
        const payment = args.object;
        return `Stripe Payment Intent ID is required for ${payment.paymentMethod} payments`;
    }
};
exports.StripePaymentIntentRequiredConstraint = StripePaymentIntentRequiredConstraint;
exports.StripePaymentIntentRequiredConstraint = StripePaymentIntentRequiredConstraint = __decorate([
    (0, class_validator_1.ValidatorConstraint)({ name: 'stripePaymentIntentRequired', async: false })
], StripePaymentIntentRequiredConstraint);
function RequiresTransactionRef(validationOptions) {
    return function (object, propertyName) {
        (0, class_validator_1.registerDecorator)({
            name: 'requiresTransactionRef',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: TransactionRefRequiredConstraint,
        });
    };
}
function RequiresStripePaymentIntent(validationOptions) {
    return function (object, propertyName) {
        (0, class_validator_1.registerDecorator)({
            name: 'requiresStripePaymentIntent',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: StripePaymentIntentRequiredConstraint,
        });
    };
}
let Payment = class Payment {
    get receiptNumber() {
        if (!this.paymentId || !this.paymentDate) {
            return '';
        }
        const year = new Date(this.paymentDate).getFullYear();
        const paddedId = String(this.paymentId).padStart(5, '0');
        return `RCP-${year}-${paddedId}`;
    }
    get parsedMetadata() {
        if (!this.metadata)
            return null;
        try {
            return JSON.parse(this.metadata);
        }
        catch {
            return null;
        }
    }
    requiresTransactionRef() {
        return exports.PAYMENT_METHODS_REQUIRING_REF.includes(this.paymentMethod);
    }
    isStripePayment() {
        return exports.STRIPE_PAYMENT_METHODS.includes(this.paymentMethod);
    }
    isOnlinePayment() {
        return (this.paymentChannel === PaymentChannel.CUSTOMER_PORTAL ||
            this.paymentChannel === PaymentChannel.MOBILE_APP ||
            this.paymentChannel === PaymentChannel.WEBSITE);
    }
    isCashierPayment() {
        return (this.paymentChannel === PaymentChannel.CASHIER_PORTAL ||
            this.paymentChannel === PaymentChannel.OFFICE);
    }
    isPending() {
        return this.paymentStatus === PaymentStatus.PENDING;
    }
    isCompleted() {
        return this.paymentStatus === PaymentStatus.COMPLETED;
    }
    isRefundable() {
        return this.paymentStatus === PaymentStatus.COMPLETED;
    }
    getPaymentMethodDisplay() {
        const displayMap = {
            [PaymentMethod.STRIPE_CARD]: 'Card (Online)',
            [PaymentMethod.STRIPE_WALLET]: 'Digital Wallet',
            [PaymentMethod.CASH]: 'Cash',
            [PaymentMethod.CARD_TERMINAL]: 'Card (Terminal)',
            [PaymentMethod.BANK_TRANSFER]: 'Bank Transfer',
            [PaymentMethod.CHEQUE]: 'Cheque',
            [PaymentMethod.CARD]: 'Card',
            [PaymentMethod.ONLINE]: 'Online Payment',
            [PaymentMethod.MOBILE_MONEY]: 'Mobile Money',
        };
        return displayMap[this.paymentMethod] || this.paymentMethod;
    }
    getPaymentChannelDisplay() {
        const displayMap = {
            [PaymentChannel.CUSTOMER_PORTAL]: 'Customer Portal',
            [PaymentChannel.CASHIER_PORTAL]: 'Office Counter',
            [PaymentChannel.MOBILE_APP]: 'Mobile App',
            [PaymentChannel.OFFICE]: 'Office',
            [PaymentChannel.WEBSITE]: 'Website',
            [PaymentChannel.BANK]: 'Bank',
            [PaymentChannel.ATM]: 'ATM',
        };
        return displayMap[this.paymentChannel] || this.paymentChannel;
    }
    getPaymentStatusDisplay() {
        const displayMap = {
            [PaymentStatus.PENDING]: 'Pending',
            [PaymentStatus.COMPLETED]: 'Completed',
            [PaymentStatus.FAILED]: 'Failed',
            [PaymentStatus.REFUNDED]: 'Refunded',
            [PaymentStatus.CANCELLED]: 'Cancelled',
        };
        return this.paymentStatus ? displayMap[this.paymentStatus] || this.paymentStatus : 'Unknown';
    }
    setMetadata(data) {
        this.metadata = JSON.stringify(data);
    }
    updateMetadata(data) {
        const existing = this.parsedMetadata || {};
        this.metadata = JSON.stringify({ ...existing, ...data });
    }
};
exports.Payment = Payment;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'payment_id', type: 'bigint' }),
    __metadata("design:type", Number)
], Payment.prototype, "paymentId", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, typeorm_1.Column)({ name: 'bill_id', type: 'bigint' }),
    __metadata("design:type", Number)
], Payment.prototype, "billId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, typeorm_1.Column)({ name: 'customer_id', type: 'bigint', nullable: true }),
    __metadata("design:type", Object)
], Payment.prototype, "customerId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, typeorm_1.Column)({ name: 'employee_id', type: 'bigint', nullable: true }),
    __metadata("design:type", Object)
], Payment.prototype, "employeeId", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsDate)(),
    (0, class_validator_1.Validate)(IsNotFutureDateConstraint),
    (0, typeorm_1.Column)({ name: 'payment_date', type: 'datetime2', precision: 0 }),
    __metadata("design:type", Date)
], Payment.prototype, "paymentDate", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Validate)(IsPositiveAmountConstraint),
    (0, typeorm_1.Column)({ name: 'payment_amount', type: 'decimal', precision: 12, scale: 2 }),
    __metadata("design:type", Number)
], Payment.prototype, "paymentAmount", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsEnum)(PaymentMethod),
    (0, typeorm_1.Column)({ name: 'payment_method', type: 'varchar', length: 30 }),
    __metadata("design:type", String)
], Payment.prototype, "paymentMethod", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsEnum)(PaymentChannel),
    (0, typeorm_1.Column)({ name: 'payment_channel', type: 'varchar', length: 30 }),
    __metadata("design:type", String)
], Payment.prototype, "paymentChannel", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsEnum)(PaymentStatus),
    (0, typeorm_1.Column)({ name: 'payment_status', type: 'varchar', length: 20, default: PaymentStatus.COMPLETED, select: false, insert: false, update: false, nullable: true }),
    __metadata("design:type", String)
], Payment.prototype, "paymentStatus", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MaxLength)(120),
    RequiresTransactionRef(),
    (0, typeorm_1.Column)({ name: 'transaction_ref', type: 'varchar', length: 120, nullable: true }),
    __metadata("design:type", Object)
], Payment.prototype, "transactionRef", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MaxLength)(120),
    RequiresStripePaymentIntent(),
    (0, typeorm_1.Column)({ name: 'stripe_payment_intent_id', type: 'varchar', length: 120, nullable: true, select: false, insert: false, update: false }),
    __metadata("design:type", Object)
], Payment.prototype, "stripePaymentIntentId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MaxLength)(120),
    (0, typeorm_1.Column)({ name: 'stripe_charge_id', type: 'varchar', length: 120, nullable: true, select: false, insert: false, update: false }),
    __metadata("design:type", Object)
], Payment.prototype, "stripeChargeId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MaxLength)(120),
    (0, typeorm_1.Column)({ name: 'stripe_customer_id', type: 'varchar', length: 120, nullable: true, select: false, insert: false, update: false }),
    __metadata("design:type", Object)
], Payment.prototype, "stripeCustomerId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, typeorm_1.Column)({ name: 'metadata', type: 'nvarchar', length: 'max', nullable: true, select: false, insert: false, update: false }),
    __metadata("design:type", Object)
], Payment.prototype, "metadata", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => bill_entity_1.Bill, (bill) => bill.payments),
    (0, typeorm_1.JoinColumn)({ name: 'bill_id' }),
    __metadata("design:type", bill_entity_1.Bill)
], Payment.prototype, "bill", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => customer_entity_1.Customer, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'customer_id' }),
    __metadata("design:type", Object)
], Payment.prototype, "customer", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => employee_entity_1.Employee, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'employee_id' }),
    __metadata("design:type", Object)
], Payment.prototype, "employee", void 0);
exports.Payment = Payment = __decorate([
    (0, typeorm_1.Entity)({ name: 'Payment', synchronize: false }),
    (0, typeorm_1.Index)('IX_Payment_bill', ['billId']),
    (0, typeorm_1.Index)('IX_Payment_date', ['paymentDate']),
    (0, typeorm_1.Index)('IX_Payment_customer', ['customerId']),
    (0, typeorm_1.Index)('IX_Payment_transaction_ref', ['transactionRef']),
    (0, typeorm_1.Index)('IX_Payment_status', ['paymentStatus']),
    (0, typeorm_1.Index)('IX_Payment_stripe_intent', ['stripePaymentIntentId'], {
        unique: true,
        where: 'stripe_payment_intent_id IS NOT NULL',
    }),
    (0, typeorm_1.Index)('IX_Payment_customer_date', ['customerId', 'paymentDate'])
], Payment);
//# sourceMappingURL=payment.entity.js.map