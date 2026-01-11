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
exports.BillingController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const billing_service_1 = require("./billing.service");
const dto_1 = require("./dto");
let BillingController = class BillingController {
    constructor(billingService) {
        this.billingService = billingService;
    }
    async calculateBill(body) {
        const periodStart = new Date(body.periodStart);
        const periodEnd = new Date(body.periodEnd);
        return this.billingService.calculateBill(body.meterId, periodStart, periodEnd);
    }
    async createBill(createDto, req) {
        const employeeId = req.user?.employeeId;
        const bill = await this.billingService.create(createDto.meterId, new Date(createDto.billingPeriodStart), new Date(createDto.billingPeriodEnd), employeeId);
        return this.transformBillToResponse(bill);
    }
    async createBulk(bulkDto) {
        const result = await this.billingService.createBulk(bulkDto.utilityTypeId, bulkDto.customerType, bulkDto.meterIds, bulkDto.billingPeriodStart ? new Date(bulkDto.billingPeriodStart) : undefined, bulkDto.billingPeriodEnd ? new Date(bulkDto.billingPeriodEnd) : undefined, bulkDto.dryRun);
        return {
            ...result,
            summary: {
                total: result.success.length + result.failed.length,
                successful: result.success.length,
                failed: result.failed.length,
            },
        };
    }
    async searchBills(query) {
        if (!query) {
            return { success: false, data: [] };
        }
        try {
            const filters = {
                search: query,
                status: 'UNPAID',
                limit: 100,
                page: 1,
            };
            const { bills } = await this.billingService.findAll(filters);
            const billsData = bills.map((bill) => {
                const totalAmount = bill.getTotalAmount();
                const paidAmount = bill.getTotalPaid();
                const outstandingAmount = totalAmount - paidAmount;
                const isPaid = bill.isPaid();
                const billStatus = isPaid ? 'PAID' : (new Date() > new Date(bill.dueDate) ? 'OVERDUE' : 'UNPAID');
                return {
                    billId: bill.billId,
                    billNumber: `BILL-${String(bill.billId).padStart(6, '0')}`,
                    meterSerialNo: bill.meter?.meterSerialNo,
                    connectionId: bill.meter?.meterId,
                    utilityType: bill.meter?.utilityType?.name,
                    billingPeriodStart: bill.billingPeriodStart,
                    billingPeriodEnd: bill.billingPeriodEnd,
                    billDate: bill.billDate,
                    dueDate: bill.dueDate,
                    totalAmount: totalAmount,
                    paidAmount: paidAmount,
                    outstandingAmount: outstandingAmount,
                    balanceAmount: outstandingAmount,
                    status: billStatus,
                    isOverdue: new Date() > new Date(bill.dueDate) && !isPaid,
                };
            });
            return { success: true, data: billsData };
        }
        catch (error) {
            console.error('Error searching bills:', error);
            return { success: false, data: [] };
        }
    }
    async findAll(filters) {
        const filterOptions = {
            customerId: filters.customerId,
            meterId: filters.meterId,
            connectionId: filters.connectionId,
            search: filters.search,
            utilityTypeId: filters.utilityTypeId,
            status: filters.status,
            startDate: filters.startDate ? new Date(filters.startDate) : undefined,
            endDate: filters.endDate ? new Date(filters.endDate) : undefined,
            page: filters.page || 1,
            limit: filters.limit || 20,
            sortBy: filters.sortBy || 'billDate',
            order: filters.order || 'DESC',
        };
        const { bills, total } = await this.billingService.findAll(filterOptions);
        const page = filterOptions.page;
        const limit = filterOptions.limit;
        const totalPages = Math.ceil(total / limit);
        return {
            bills,
            total,
            page,
            limit,
            totalPages,
        };
    }
    async findOne(id) {
        const bill = await this.billingService.findOne(id);
        return this.transformBillToResponse(bill);
    }
    async findByMeter(meterId, limit, startDate, endDate) {
        const options = {
            limit,
            startDate: startDate ? new Date(startDate) : undefined,
            endDate: endDate ? new Date(endDate) : undefined,
        };
        return this.billingService.findByMeter(meterId, options);
    }
    async findByCustomer(customerId) {
        return this.billingService.findByCustomer(customerId);
    }
    async checkBillingEligibility(meterId) {
        return this.billingService.checkBillingEligibility(meterId);
    }
    async autoGenerateBill(meterId, options) {
        const bill = await this.billingService.generateBillFromReading(meterId, new Date(), options);
        if (bill) {
            return {
                success: true,
                bill: this.transformBillToResponse(bill),
                message: `Bill #${bill.billId} generated successfully`,
            };
        }
        const eligibility = await this.billingService.checkBillingEligibility(meterId);
        return {
            success: false,
            message: eligibility.reason,
        };
    }
    async getSummary(customerId, utilityTypeId, startDate, endDate) {
        const filters = {
            customerId,
            utilityTypeId,
            startDate: startDate ? new Date(startDate) : undefined,
            endDate: endDate ? new Date(endDate) : undefined,
        };
        const result = await this.billingService.getSummary(filters);
        return {
            totalBills: result.totalBills,
            totalAmount: result.totalAmount,
            totalPaid: result.paidAmount,
            totalOutstanding: result.outstanding,
            overdueBills: result.overdueBills,
            overdueAmount: result.overdueAmount,
        };
    }
    async update(id, updateDto, req) {
        const employeeId = req.user?.employeeId;
        const updates = {
            dueDate: updateDto.dueDate ? new Date(updateDto.dueDate) : undefined,
            subsidyAmount: updateDto.subsidyAmount,
            solarExportCredit: updateDto.solarExportCredit,
        };
        const bill = await this.billingService.update(id, updates, employeeId);
        return this.transformBillToResponse(bill);
    }
    async recalculate(id) {
        const bill = await this.billingService.recalculate(id);
        return this.transformBillToResponse(bill);
    }
    async void(id, body, req) {
        const employeeId = req.user?.employeeId || 1;
        await this.billingService.void(id, body.reason, employeeId);
    }
    async downloadPdf(_id) {
        void _id;
        throw new Error('PDF generation not yet implemented');
    }
    async exportCsv(_filters) {
        void _filters;
        throw new Error('CSV export not yet implemented');
    }
    async getOverdue(utilityTypeId, customerId) {
        const filters = {
            status: 'OVERDUE',
            utilityTypeId,
            customerId,
            endDate: new Date(),
        };
        const { bills } = await this.billingService.findAll(filters);
        return bills;
    }
    transformBillToResponse(bill) {
        const totalAmount = bill.getTotalAmount();
        const taxAmount = bill.billTaxes?.reduce((sum, tax) => sum + (tax.taxableBaseAmount * tax.ratePercentApplied) / 100, 0) || 0;
        return {
            billId: bill.billId,
            meterId: bill.meterId,
            meterSerialNo: bill.meter?.meterSerialNo || '',
            customerName: 'N/A',
            connectionAddress: 'N/A',
            tariffCategoryName: 'Standard',
            utilityTypeName: bill.meter?.utilityType?.name || 'Unknown',
            billingPeriodStart: bill.billingPeriodStart,
            billingPeriodEnd: bill.billingPeriodEnd,
            billDate: bill.billDate,
            dueDate: bill.dueDate,
            totalImportUnit: bill.totalImportUnit,
            totalExportUnit: bill.totalExportUnit || 0,
            energyChargeAmount: bill.energyChargeAmount,
            fixedChargeAmount: bill.fixedChargeAmount,
            subsidyAmount: bill.subsidyAmount || 0,
            solarExportCredit: bill.solarExportCredit || 0,
            details: bill.billDetails?.map((detail) => ({
                slabRange: `${detail.tariffSlab?.fromUnit || 0}-${detail.tariffSlab?.toUnit || 'Above'} units`,
                unitsInSlab: detail.unitsInSlab,
                ratePerUnit: detail.tariffSlab?.ratePerUnit || 0,
                amount: detail.amount,
            })) || [],
            taxes: bill.billTaxes?.map((tax) => ({
                taxName: tax.taxConfig?.taxName || 'Unknown Tax',
                ratePercent: tax.ratePercentApplied,
                taxableAmount: tax.taxableBaseAmount,
                taxAmount: (tax.taxableBaseAmount * tax.ratePercentApplied) / 100,
            })) || [],
            totalAmount,
            taxAmount,
            isPaid: bill.isPaid(),
            isOverdue: bill.isOverdue(),
            payments: bill.payments?.map((payment) => ({
                paymentId: payment.paymentId,
                paymentDate: payment.paymentDate,
                paymentAmount: payment.paymentAmount,
                paymentMethod: payment.paymentMethod,
                transactionRef: payment.transactionRef || '',
            })),
        };
    }
};
exports.BillingController = BillingController;
__decorate([
    (0, common_1.Post)('calculate'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Calculate bill preview',
        description: 'Calculate bill without saving to database. Used for previewing charges.',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Bill calculation successful',
        type: dto_1.BillCalculationDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Invalid input or insufficient readings',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Meter not found or no service connection',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BillingController.prototype, "calculateBill", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({
        summary: 'Generate single bill',
        description: 'Generate and save a bill for a specific meter and billing period',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CREATED,
        description: 'Bill generated successfully',
        type: dto_1.BillResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Invalid input or calculation failed',
    }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.CreateBillDto, Object]),
    __metadata("design:returntype", Promise)
], BillingController.prototype, "createBill", null);
__decorate([
    (0, common_1.Post)('bulk'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Generate bulk bills',
        description: 'Generate bills for multiple meters based on filters. Supports dry-run mode.',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Bulk billing completed with success/failure breakdown',
        schema: {
            properties: {
                success: { type: 'array', items: { $ref: '#/components/schemas/Bill' } },
                failed: { type: 'array', items: { type: 'object' } },
                summary: {
                    type: 'object',
                    properties: {
                        total: { type: 'number' },
                        successful: { type: 'number' },
                        failed: { type: 'number' },
                    },
                },
            },
        },
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.BulkBillGenerationDto]),
    __metadata("design:returntype", Promise)
], BillingController.prototype, "createBulk", null);
__decorate([
    (0, common_1.Get)('search'),
    (0, swagger_1.ApiOperation)({
        summary: 'Search bills by connection or meter number (Public)',
        description: 'Public endpoint for searching unpaid bills by connection or meter number. Used for guest payments by renters.',
    }),
    (0, swagger_1.ApiQuery)({ name: 'query', description: 'Connection ID or Meter Serial Number', required: true }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'List of unpaid bills for the connection',
    }),
    __param(0, (0, common_1.Query)('query')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BillingController.prototype, "searchBills", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Get bills with filters',
        description: 'Retrieve bills with optional filters, pagination, and sorting',
    }),
    (0, swagger_1.ApiQuery)({ name: 'customerId', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'meterId', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'connectionId', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'search', required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'utilityTypeId', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'status', required: false, enum: ['PAID', 'UNPAID', 'OVERDUE', 'PARTIAL'] }),
    (0, swagger_1.ApiQuery)({ name: 'startDate', required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'endDate', required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number, example: 1 }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number, example: 20 }),
    (0, swagger_1.ApiQuery)({ name: 'sortBy', required: false, enum: ['billDate', 'dueDate', 'billId', 'totalAmount'] }),
    (0, swagger_1.ApiQuery)({ name: 'order', required: false, enum: ['ASC', 'DESC'] }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Bills retrieved successfully',
        schema: {
            properties: {
                bills: { type: 'array', items: { $ref: '#/components/schemas/Bill' } },
                total: { type: 'number' },
                page: { type: 'number' },
                limit: { type: 'number' },
                totalPages: { type: 'number' },
            },
        },
    }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.BillFilterDto]),
    __metadata("design:returntype", Promise)
], BillingController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get bill details',
        description: 'Retrieve complete bill information including breakdown, taxes, and payments',
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Bill ID' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Bill retrieved successfully',
        type: dto_1.BillResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Bill not found',
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], BillingController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)('meter/:meterId'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get meter bill history',
        description: 'Retrieve billing history for a specific meter',
    }),
    (0, swagger_1.ApiParam)({ name: 'meterId', description: 'Meter ID' }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'startDate', required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'endDate', required: false, type: String }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Meter bills retrieved successfully',
        type: [dto_1.BillResponseDto],
    }),
    __param(0, (0, common_1.Param)('meterId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('startDate')),
    __param(3, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String, String]),
    __metadata("design:returntype", Promise)
], BillingController.prototype, "findByMeter", null);
__decorate([
    (0, common_1.Get)('customer/:customerId'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get customer bills',
        description: 'Retrieve all bills for a customer across all their service connections',
    }),
    (0, swagger_1.ApiParam)({ name: 'customerId', description: 'Customer ID' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Customer bills retrieved successfully',
        type: [dto_1.BillResponseDto],
    }),
    __param(0, (0, common_1.Param)('customerId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], BillingController.prototype, "findByCustomer", null);
__decorate([
    (0, common_1.Get)('meter/:meterId/eligibility'),
    (0, swagger_1.ApiOperation)({
        summary: 'Check billing eligibility',
        description: 'Check if a meter is eligible for automatic bill generation and get suggested billing period',
    }),
    (0, swagger_1.ApiParam)({ name: 'meterId', description: 'Meter ID' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Billing eligibility status',
        schema: {
            properties: {
                eligible: { type: 'boolean', description: 'Whether the meter is eligible for billing' },
                reason: { type: 'string', description: 'Explanation of eligibility status' },
                lastBillDate: {
                    type: 'string',
                    format: 'date',
                    description: 'Date of last bill end period',
                    nullable: true,
                },
                readingCount: { type: 'number', description: 'Number of unbilled readings available' },
                suggestedPeriodStart: {
                    type: 'string',
                    format: 'date',
                    description: 'Suggested billing period start date',
                    nullable: true,
                },
            },
        },
    }),
    __param(0, (0, common_1.Param)('meterId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], BillingController.prototype, "checkBillingEligibility", null);
__decorate([
    (0, common_1.Post)('meter/:meterId/auto-generate'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Auto-generate bill from readings',
        description: 'Manually trigger automatic bill generation for a meter based on available readings',
    }),
    (0, swagger_1.ApiParam)({ name: 'meterId', description: 'Meter ID' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Bill generation result',
        schema: {
            properties: {
                success: { type: 'boolean' },
                bill: { $ref: '#/components/schemas/BillResponseDto', nullable: true },
                message: { type: 'string' },
            },
        },
    }),
    __param(0, (0, common_1.Param)('meterId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], BillingController.prototype, "autoGenerateBill", null);
__decorate([
    (0, common_1.Get)('summary'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get billing summary',
        description: 'Retrieve billing statistics including total, paid, outstanding, and overdue amounts',
    }),
    (0, swagger_1.ApiQuery)({ name: 'customerId', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'utilityTypeId', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'startDate', required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'endDate', required: false, type: String }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Billing summary retrieved successfully',
        type: dto_1.BillSummaryDto,
    }),
    __param(0, (0, common_1.Query)('customerId')),
    __param(1, (0, common_1.Query)('utilityTypeId')),
    __param(2, (0, common_1.Query)('startDate')),
    __param(3, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String, String]),
    __metadata("design:returntype", Promise)
], BillingController.prototype, "getSummary", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiOperation)({
        summary: 'Update bill',
        description: 'Update bill fields such as due date, subsidy, or solar credit',
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Bill ID' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Bill updated successfully',
        type: dto_1.BillResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Bill not found',
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, dto_1.UpdateBillDto, Object]),
    __metadata("design:returntype", Promise)
], BillingController.prototype, "update", null);
__decorate([
    (0, common_1.Post)(':id/recalculate'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Recalculate bill',
        description: 'Recalculate bill with updated tariffs or readings',
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Bill ID' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Bill recalculated successfully',
        type: dto_1.BillResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Bill not found',
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], BillingController.prototype, "recalculate", null);
__decorate([
    (0, common_1.Post)(':id/void'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({
        summary: 'Void bill',
        description: 'Cancel/void a bill that has not been paid',
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Bill ID' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NO_CONTENT,
        description: 'Bill voided successfully',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Bill has payments and cannot be voided',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Bill not found',
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, Object]),
    __metadata("design:returntype", Promise)
], BillingController.prototype, "void", null);
__decorate([
    (0, common_1.Get)(':id/download'),
    (0, common_1.Header)('Content-Type', 'application/pdf'),
    (0, common_1.Header)('Content-Disposition', 'attachment; filename="bill.pdf"'),
    (0, swagger_1.ApiOperation)({
        summary: 'Download bill PDF',
        description: 'Generate and download bill as PDF document',
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Bill ID' }),
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
        description: 'Bill not found',
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], BillingController.prototype, "downloadPdf", null);
__decorate([
    (0, common_1.Get)('export'),
    (0, common_1.Header)('Content-Type', 'text/csv'),
    (0, common_1.Header)('Content-Disposition', 'attachment; filename="bills.csv"'),
    (0, swagger_1.ApiOperation)({
        summary: 'Export bills to CSV',
        description: 'Export filtered bills to CSV file',
    }),
    (0, swagger_1.ApiQuery)({ name: 'customerId', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'meterId', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'utilityTypeId', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'startDate', required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'endDate', required: false, type: String }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'CSV generated successfully',
        content: {
            'text/csv': {
                schema: {
                    type: 'string',
                },
            },
        },
    }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.BillFilterDto]),
    __metadata("design:returntype", Promise)
], BillingController.prototype, "exportCsv", null);
__decorate([
    (0, common_1.Get)('overdue'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get overdue bills',
        description: 'Retrieve all bills that are past their due date and not fully paid',
    }),
    (0, swagger_1.ApiQuery)({ name: 'utilityTypeId', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'customerId', required: false, type: Number }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Overdue bills retrieved successfully',
        type: [dto_1.BillResponseDto],
    }),
    __param(0, (0, common_1.Query)('utilityTypeId')),
    __param(1, (0, common_1.Query)('customerId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], BillingController.prototype, "getOverdue", null);
exports.BillingController = BillingController = __decorate([
    (0, swagger_1.ApiTags)('bills'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('bills'),
    __metadata("design:paramtypes", [billing_service_1.BillingService])
], BillingController);
//# sourceMappingURL=billing.controller.js.map