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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const payment_service_1 = require("./payment.service");
const dto_1 = require("./dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
let PaymentController = class PaymentController {
    constructor(paymentService) {
        this.paymentService = paymentService;
    }
    async create(createDto, employeeId) {
        const payment = await this.paymentService.create(createDto, employeeId);
        return this.transformToResponse(payment);
    }
    async findAll(filters) {
        const { payments, total } = await this.paymentService.findAll(filters);
        const page = filters.page || 1;
        const limit = filters.limit || 10;
        const totalPages = Math.ceil(total / limit);
        return {
            payments: payments.map((p) => this.transformToResponse(p)),
            total,
            page,
            limit,
            totalPages,
        };
    }
    async getSummary(startDate, endDate, employeeId, customerId) {
        return this.paymentService.getSummary({
            startDate: startDate ? new Date(startDate) : undefined,
            endDate: endDate ? new Date(endDate) : undefined,
            employeeId,
            customerId,
        });
    }
    async getDailyReport(date, employeeId, currentEmployeeId) {
        const targetEmployeeId = employeeId || currentEmployeeId;
        if (!targetEmployeeId) {
            throw new Error('Employee ID is required');
        }
        return this.paymentService.getDailyCollectionReport(targetEmployeeId, new Date(date));
    }
    async getOverpayments() {
        return this.paymentService.getOverpayments();
    }
    async getPendingReconciliation(date) {
        return this.paymentService.getPendingReconciliation(new Date(date));
    }
    async exportPayments(filters, res) {
        const buffer = await this.paymentService.exportPayments(filters);
        res.set({
            'Content-Type': 'text/csv',
            'Content-Disposition': `attachment; filename="payments-${new Date().toISOString().split('T')[0]}.csv"`,
        });
        return new common_1.StreamableFile(buffer);
    }
    async searchByTransactionRef(transactionRef) {
        const payment = await this.paymentService.searchByTransactionRef(transactionRef);
        return payment ? this.transformToResponse(payment) : null;
    }
    async getCashierCollections(employeeId, date) {
        return this.paymentService.findByEmployee(employeeId, new Date(date));
    }
    async findByBill(billId) {
        const payments = await this.paymentService.findByBill(billId);
        return payments.map((p) => this.transformToResponse(p));
    }
    async getBillOutstanding(billId) {
        const outstanding = await this.paymentService.getBillOutstanding(billId);
        return {
            billId,
            totalAmount: 0,
            totalPaid: 0,
            outstanding,
        };
    }
    async findByCustomer(customerId, startDate, endDate, limit) {
        const payments = await this.paymentService.findByCustomer(customerId, {
            startDate: startDate ? new Date(startDate) : undefined,
            endDate: endDate ? new Date(endDate) : undefined,
            limit,
        });
        return payments.map((p) => this.transformToResponse(p));
    }
    async findOne(id) {
        const payment = await this.paymentService.findOne(id);
        return this.transformToResponse(payment);
    }
    async downloadReceipt(id, res) {
        const payment = await this.paymentService.findOne(id);
        const pdfContent = `Payment Receipt\n\nPayment ID: ${payment.paymentId}\nReceipt: ${payment.receiptNumber}\nAmount: ${payment.paymentAmount}\nDate: ${payment.paymentDate}\n`;
        const buffer = Buffer.from(pdfContent, 'utf-8');
        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename="receipt-${payment.receiptNumber}.pdf"`,
        });
        return new common_1.StreamableFile(buffer);
    }
    async update(id, updateDto) {
        const payment = await this.paymentService.update(id, updateDto);
        return this.transformToResponse(payment);
    }
    async processRefund(id, refundDto, employeeId) {
        const refundPayment = await this.paymentService.processRefund({
            paymentId: id,
            refundAmount: refundDto.refundAmount,
            refundReason: refundDto.refundReason,
            refundMethod: refundDto.refundMethod,
        }, employeeId);
        return this.transformToResponse(refundPayment);
    }
    async voidPayment(id, body, employeeId) {
        await this.paymentService.voidPayment(id, body.reason, employeeId);
    }
    async reconcilePayments(body) {
        return this.paymentService.reconcilePayments(new Date(body.date), body.expectedAmount, body.actualAmount);
    }
    transformToResponse(payment) {
        const bill = payment.bill;
        const customer = payment.customer;
        const employee = payment.employee;
        const billAmount = bill?.getTotalAmount() || 0;
        const billPaid = bill?.getTotalPaid() || 0;
        const outstandingBefore = billAmount - billPaid + Number(payment.paymentAmount);
        const newOutstanding = billAmount - billPaid;
        return {
            paymentId: payment.paymentId,
            billId: payment.billId,
            customerId: payment.customerId,
            employeeId: payment.employeeId,
            paymentDate: payment.paymentDate,
            paymentAmount: Number(payment.paymentAmount),
            paymentMethod: payment.paymentMethod,
            paymentChannel: payment.paymentChannel,
            transactionRef: payment.transactionRef,
            notes: null,
            billNumber: `BILL-${bill?.billId || 0}`,
            customerName: customer?.fullName || 'Unknown',
            customerEmail: customer?.email || null,
            billAmount: billAmount,
            billOutstanding: outstandingBefore,
            newOutstanding: newOutstanding,
            receiptNumber: payment.receiptNumber,
            recordedByName: employee?.fullName || null,
            billDetails: {
                period: bill
                    ? `${bill.billingPeriodStart?.toISOString().split('T')[0] || ''} to ${bill.billingPeriodEnd?.toISOString().split('T')[0] || ''}`
                    : '',
                utilityType: bill?.meter?.utilityType?.name || 'Unknown',
                meterSerialNo: bill?.meter?.meterSerialNo || '',
            },
        };
    }
};
exports.PaymentController = PaymentController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('CASHIER', 'ADMIN', 'MANAGER'),
    (0, swagger_1.ApiOperation)({
        summary: 'Record a payment',
        description: 'Record a new payment against a bill',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CREATED,
        description: 'Payment recorded successfully',
        type: dto_1.PaymentResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Invalid payment data or validation failed',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Bill not found',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CONFLICT,
        description: 'Duplicate transaction reference',
    }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)('employeeId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.CreatePaymentDto, Number]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({
        summary: 'Get payments with filters',
        description: 'Retrieve payments with optional filters, pagination, and sorting',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Payments retrieved successfully',
        schema: {
            properties: {
                payments: { type: 'array', items: { $ref: '#/components/schemas/PaymentResponseDto' } },
                total: { type: 'number' },
                page: { type: 'number' },
                limit: { type: 'number' },
                totalPages: { type: 'number' },
            },
        },
    }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.PaymentFilterDto]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('summary'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({
        summary: 'Get payment statistics',
        description: 'Retrieve payment statistics with breakdowns by method and channel',
    }),
    (0, swagger_1.ApiQuery)({ name: 'startDate', required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'endDate', required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'employeeId', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'customerId', required: false, type: Number }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Payment summary retrieved successfully',
    }),
    __param(0, (0, common_1.Query)('startDate')),
    __param(1, (0, common_1.Query)('endDate')),
    __param(2, (0, common_1.Query)('employeeId')),
    __param(3, (0, common_1.Query)('customerId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Number, Number]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "getSummary", null);
__decorate([
    (0, common_1.Get)('daily-report/:date'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({
        summary: 'Get daily collection report',
        description: 'Generate daily collection report for a cashier',
    }),
    (0, swagger_1.ApiParam)({ name: 'date', description: 'Date (YYYY-MM-DD format)' }),
    (0, swagger_1.ApiQuery)({ name: 'employeeId', required: false, type: Number }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Daily report generated successfully',
    }),
    __param(0, (0, common_1.Param)('date')),
    __param(1, (0, common_1.Query)('employeeId')),
    __param(2, (0, current_user_decorator_1.CurrentUser)('employeeId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Number]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "getDailyReport", null);
__decorate([
    (0, common_1.Get)('overpayments'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMIN', 'MANAGER', 'CASHIER'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get overpaid bills',
        description: 'Retrieve all overpaid bills for refund processing',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Overpayments retrieved successfully',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "getOverpayments", null);
__decorate([
    (0, common_1.Get)('pending-reconciliation'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMIN', 'MANAGER', 'CASHIER'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get payments pending reconciliation',
        description: 'Retrieve payments needing manual reconciliation',
    }),
    (0, swagger_1.ApiQuery)({ name: 'date', required: true, type: String }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Pending payments retrieved successfully',
    }),
    __param(0, (0, common_1.Query)('date')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "getPendingReconciliation", null);
__decorate([
    (0, common_1.Get)('export'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Header)('Content-Type', 'text/csv'),
    (0, common_1.Header)('Content-Disposition', 'attachment; filename="payments.csv"'),
    (0, swagger_1.ApiOperation)({
        summary: 'Export payments to CSV',
        description: 'Export filtered payments to CSV file',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'CSV exported successfully',
        content: {
            'text/csv': {
                schema: {
                    type: 'string',
                },
            },
        },
    }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.PaymentFilterDto, Object]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "exportPayments", null);
__decorate([
    (0, common_1.Get)('search/transaction/:transactionRef'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({
        summary: 'Find payment by transaction reference',
        description: 'Search for a payment using its transaction reference',
    }),
    (0, swagger_1.ApiParam)({ name: 'transactionRef', description: 'Transaction reference' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Payment found',
        type: dto_1.PaymentResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Payment not found',
    }),
    __param(0, (0, common_1.Param)('transactionRef')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "searchByTransactionRef", null);
__decorate([
    (0, common_1.Get)('cashier/:employeeId/collections'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({
        summary: 'Get cashier collections for day',
        description: 'Retrieve all payments collected by a cashier on a specific date',
    }),
    (0, swagger_1.ApiParam)({ name: 'employeeId', description: 'Employee/Cashier ID' }),
    (0, swagger_1.ApiQuery)({ name: 'date', required: true, type: String }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Cashier collections retrieved successfully',
    }),
    __param(0, (0, common_1.Param)('employeeId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)('date')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "getCashierCollections", null);
__decorate([
    (0, common_1.Get)('bill/:billId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({
        summary: 'Get payments for a bill',
        description: 'Retrieve all payments made against a specific bill',
    }),
    (0, swagger_1.ApiParam)({ name: 'billId', description: 'Bill ID' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Payments retrieved successfully',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Bill not found',
    }),
    __param(0, (0, common_1.Param)('billId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "findByBill", null);
__decorate([
    (0, common_1.Get)('bill/:billId/outstanding'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({
        summary: 'Get outstanding amount for bill',
        description: 'Calculate the outstanding balance for a bill',
    }),
    (0, swagger_1.ApiParam)({ name: 'billId', description: 'Bill ID' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Outstanding amount calculated',
        schema: {
            properties: {
                billId: { type: 'number' },
                totalAmount: { type: 'number' },
                totalPaid: { type: 'number' },
                outstanding: { type: 'number' },
            },
        },
    }),
    __param(0, (0, common_1.Param)('billId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "getBillOutstanding", null);
__decorate([
    (0, common_1.Get)('customer/:customerId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({
        summary: 'Get payment history for customer',
        description: 'Retrieve payment history for a specific customer',
    }),
    (0, swagger_1.ApiParam)({ name: 'customerId', description: 'Customer ID' }),
    (0, swagger_1.ApiQuery)({ name: 'startDate', required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'endDate', required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Payment history retrieved successfully',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Customer not found',
    }),
    __param(0, (0, common_1.Param)('customerId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)('startDate')),
    __param(2, (0, common_1.Query)('endDate')),
    __param(3, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, String, Number]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "findByCustomer", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({
        summary: 'Get payment details',
        description: 'Retrieve complete payment information',
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Payment ID' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Payment retrieved successfully',
        type: dto_1.PaymentResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Payment not found',
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)(':id/receipt'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Header)('Content-Type', 'application/pdf'),
    (0, swagger_1.ApiOperation)({
        summary: 'Download payment receipt as PDF',
        description: 'Generate and download payment receipt as PDF',
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Payment ID' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'PDF generated successfully',
        content: {
            'application/pdf': {
                schema: {
                    type: 'string',
                    format: 'binary',
                },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Payment not found',
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "downloadReceipt", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMIN', 'MANAGER'),
    (0, swagger_1.ApiOperation)({
        summary: 'Update payment details',
        description: 'Update payment details (corrections only)',
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Payment ID' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Payment updated successfully',
        type: dto_1.PaymentResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Payment not found',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CONFLICT,
        description: 'Duplicate transaction reference',
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, dto_1.UpdatePaymentDto]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "update", null);
__decorate([
    (0, common_1.Post)(':id/refund'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMIN', 'MANAGER'),
    (0, swagger_1.ApiOperation)({
        summary: 'Process refund',
        description: 'Process a refund for a payment',
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Payment ID to refund' }),
    (0, swagger_1.ApiBody)({ type: dto_1.RefundDto }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CREATED,
        description: 'Refund processed successfully',
        type: dto_1.PaymentResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Invalid refund amount or already refunded',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Payment not found',
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)('employeeId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, dto_1.RefundDto, Number]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "processRefund", null);
__decorate([
    (0, common_1.Post)(':id/void'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMIN', 'MANAGER'),
    (0, swagger_1.ApiOperation)({
        summary: 'Void payment',
        description: 'Void/cancel a payment while maintaining audit trail',
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Payment ID to void' }),
    (0, swagger_1.ApiBody)({
        schema: {
            properties: {
                reason: { type: 'string', description: 'Reason for voiding' },
            },
            required: ['reason'],
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NO_CONTENT,
        description: 'Payment voided successfully',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Payment already voided or is a refund',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Payment not found',
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)('employeeId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, Number]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "voidPayment", null);
__decorate([
    (0, common_1.Post)('reconcile'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMIN', 'MANAGER'),
    (0, swagger_1.ApiOperation)({
        summary: 'Reconcile daily payments',
        description: 'Compare expected vs actual payments for reconciliation',
    }),
    (0, swagger_1.ApiBody)({
        schema: {
            properties: {
                date: { type: 'string', format: 'date' },
                expectedAmount: { type: 'number' },
                actualAmount: { type: 'number' },
            },
            required: ['date', 'expectedAmount', 'actualAmount'],
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Reconciliation report generated',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "reconcilePayments", null);
exports.PaymentController = PaymentController = __decorate([
    (0, swagger_1.ApiTags)('payments'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('payments'),
    __metadata("design:paramtypes", [payment_service_1.PaymentService])
], PaymentController);
//# sourceMappingURL=payment.controller.js.map