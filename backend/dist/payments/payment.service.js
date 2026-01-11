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
var PaymentService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const payment_entity_1 = require("../database/entities/payment.entity");
const bill_entity_1 = require("../database/entities/bill.entity");
const customer_entity_1 = require("../database/entities/customer.entity");
const employee_entity_1 = require("../database/entities/employee.entity");
const stripe_service_1 = require("../stripe/stripe.service");
const dto_1 = require("./dto");
let PaymentService = PaymentService_1 = class PaymentService {
    constructor(paymentRepository, billRepository, customerRepository, employeeRepository, dataSource, stripeService) {
        this.paymentRepository = paymentRepository;
        this.billRepository = billRepository;
        this.customerRepository = customerRepository;
        this.employeeRepository = employeeRepository;
        this.dataSource = dataSource;
        this.stripeService = stripeService;
        this.logger = new common_1.Logger(PaymentService_1.name);
        this.OVERPAYMENT_TOLERANCE = 0.1;
    }
    async create(createDto, employeeId) {
        this.logger.log(`Recording payment for bill ${createDto.billId}, amount: ${createDto.paymentAmount}`);
        const bill = await this.billRepository.findOne({
            where: { billId: createDto.billId },
            relations: ['meter', 'payments', 'billDetails', 'billTaxes'],
        });
        if (!bill) {
            throw new common_1.NotFoundException(`Bill with ID ${createDto.billId} not found`);
        }
        const totalBillAmount = bill.getTotalAmount();
        const totalPaid = bill.getTotalPaid();
        const outstanding = totalBillAmount - totalPaid;
        this.logger.debug(`Bill ${createDto.billId}: Total=${totalBillAmount}, Paid=${totalPaid}, Outstanding=${outstanding}`);
        const maxAllowedPayment = outstanding * (1 + this.OVERPAYMENT_TOLERANCE);
        if (createDto.paymentAmount > maxAllowedPayment && outstanding > 0) {
            throw new common_1.BadRequestException(`Payment amount ${createDto.paymentAmount} exceeds maximum allowed ${maxAllowedPayment.toFixed(2)} ` +
                `(outstanding ${outstanding.toFixed(2)} + ${this.OVERPAYMENT_TOLERANCE * 100}% tolerance)`);
        }
        if (createDto.paymentAmount > outstanding && outstanding > 0) {
            this.logger.warn(`Overpayment detected for bill ${createDto.billId}: ` +
                `Paying ${createDto.paymentAmount} when outstanding is ${outstanding}. ` +
                `Consider creating credit note.`);
        }
        if (payment_entity_1.PAYMENT_METHODS_REQUIRING_REF.includes(createDto.paymentMethod)) {
            if (!createDto.transactionRef || createDto.transactionRef.trim().length === 0) {
                throw new common_1.BadRequestException(`Transaction reference is required for ${createDto.paymentMethod} payments`);
            }
            const existingPayment = await this.paymentRepository.findOne({
                where: { transactionRef: createDto.transactionRef },
            });
            if (existingPayment) {
                throw new common_1.ConflictException(`Transaction reference '${createDto.transactionRef}' already exists (Payment ID: ${existingPayment.paymentId})`);
            }
        }
        const customerId = await this.getCustomerIdFromBill(bill);
        if (employeeId) {
            const employee = await this.employeeRepository.findOne({
                where: { employeeId },
            });
            if (!employee) {
                throw new common_1.NotFoundException(`Employee with ID ${employeeId} not found`);
            }
        }
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const payment = this.paymentRepository.create({
                billId: createDto.billId,
                customerId: customerId,
                employeeId: employeeId || null,
                paymentDate: createDto.paymentDate || new Date(),
                paymentAmount: createDto.paymentAmount,
                paymentMethod: createDto.paymentMethod,
                paymentChannel: createDto.paymentChannel || payment_entity_1.PaymentChannel.CASHIER_PORTAL,
                paymentStatus: payment_entity_1.PaymentStatus.COMPLETED,
                transactionRef: createDto.transactionRef || null,
            });
            const savedPayment = (await queryRunner.manager.save(payment_entity_1.Payment, payment));
            const newOutstanding = outstanding - createDto.paymentAmount;
            if (newOutstanding <= 0) {
                this.logger.log(`Bill ${createDto.billId} is now fully paid`);
            }
            await queryRunner.commitTransaction();
            this.logger.log(`Payment ${savedPayment.paymentId} created successfully. ` +
                `Receipt: ${savedPayment.receiptNumber}, Amount: ${savedPayment.paymentAmount}`);
            return this.findOne(savedPayment.paymentId);
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            this.logger.error(`Failed to create payment for bill ${createDto.billId}:`, error);
            throw error;
        }
        finally {
            await queryRunner.release();
        }
    }
    async findAll(filters) {
        this.logger.debug(`Finding payments with filters: ${JSON.stringify(filters)}`);
        const queryBuilder = this.paymentRepository
            .createQueryBuilder('payment')
            .leftJoinAndSelect('payment.bill', 'bill')
            .leftJoinAndSelect('bill.meter', 'meter')
            .leftJoinAndSelect('meter.utilityType', 'utilityType')
            .leftJoinAndSelect('payment.customer', 'customer')
            .leftJoinAndSelect('payment.employee', 'employee');
        if (filters.billId) {
            queryBuilder.andWhere('payment.billId = :billId', { billId: filters.billId });
        }
        if (filters.customerId) {
            queryBuilder.andWhere('payment.customerId = :customerId', { customerId: filters.customerId });
        }
        if (filters.employeeId) {
            queryBuilder.andWhere('payment.employeeId = :employeeId', { employeeId: filters.employeeId });
        }
        if (filters.paymentMethod) {
            queryBuilder.andWhere('payment.paymentMethod = :paymentMethod', {
                paymentMethod: filters.paymentMethod,
            });
        }
        if (filters.paymentChannel) {
            queryBuilder.andWhere('payment.paymentChannel = :paymentChannel', {
                paymentChannel: filters.paymentChannel,
            });
        }
        if (filters.startDate) {
            queryBuilder.andWhere('payment.paymentDate >= :startDate', { startDate: filters.startDate });
        }
        if (filters.endDate) {
            queryBuilder.andWhere('payment.paymentDate <= :endDate', { endDate: filters.endDate });
        }
        if (filters.minAmount !== undefined) {
            queryBuilder.andWhere('payment.paymentAmount >= :minAmount', {
                minAmount: filters.minAmount,
            });
        }
        if (filters.maxAmount !== undefined) {
            queryBuilder.andWhere('payment.paymentAmount <= :maxAmount', {
                maxAmount: filters.maxAmount,
            });
        }
        if (filters.transactionRef) {
            queryBuilder.andWhere('payment.transactionRef LIKE :transactionRef', {
                transactionRef: `%${filters.transactionRef}%`,
            });
        }
        const page = filters.page || 1;
        const limit = filters.limit || 10;
        const sortBy = filters.sortBy || 'paymentDate';
        const order = filters.order || 'DESC';
        const sortColumn = this.mapSortColumn(sortBy);
        queryBuilder
            .orderBy(`payment.${sortColumn}`, order)
            .skip((page - 1) * limit)
            .take(limit);
        const [payments, total] = await queryBuilder.getManyAndCount();
        this.logger.debug(`Found ${total} payments, returning page ${page} with ${payments.length} items`);
        return { payments, total };
    }
    async findOne(paymentId) {
        this.logger.debug(`Finding payment ${paymentId}`);
        const payment = await this.paymentRepository.findOne({
            where: { paymentId },
            relations: [
                'bill',
                'bill.meter',
                'bill.meter.utilityType',
                'bill.billDetails',
                'bill.billTaxes',
                'bill.payments',
                'customer',
                'customer.address',
                'employee',
            ],
        });
        if (!payment) {
            throw new common_1.NotFoundException(`Payment with ID ${paymentId} not found`);
        }
        return payment;
    }
    async findByBill(billId) {
        this.logger.debug(`Finding payments for bill ${billId}`);
        const bill = await this.billRepository.findOne({
            where: { billId },
        });
        if (!bill) {
            throw new common_1.NotFoundException(`Bill with ID ${billId} not found`);
        }
        const payments = await this.paymentRepository.find({
            where: { billId },
            relations: ['employee', 'customer'],
            order: { paymentDate: 'DESC' },
        });
        return payments;
    }
    async findByCustomer(customerId, options) {
        this.logger.debug(`Finding payments for customer ${customerId}`);
        const customer = await this.customerRepository.findOne({
            where: { customerId },
        });
        if (!customer) {
            throw new common_1.NotFoundException(`Customer with ID ${customerId} not found`);
        }
        const queryBuilder = this.paymentRepository
            .createQueryBuilder('payment')
            .leftJoinAndSelect('payment.bill', 'bill')
            .leftJoinAndSelect('bill.meter', 'meter')
            .leftJoinAndSelect('meter.utilityType', 'utilityType')
            .leftJoinAndSelect('payment.employee', 'employee')
            .where('payment.customerId = :customerId', { customerId });
        if (options?.startDate) {
            queryBuilder.andWhere('payment.paymentDate >= :startDate', {
                startDate: options.startDate,
            });
        }
        if (options?.endDate) {
            queryBuilder.andWhere('payment.paymentDate <= :endDate', {
                endDate: options.endDate,
            });
        }
        queryBuilder.orderBy('payment.paymentDate', 'DESC');
        if (options?.limit) {
            queryBuilder.take(options.limit);
        }
        return queryBuilder.getMany();
    }
    async findByEmployee(employeeId, date) {
        this.logger.debug(`Finding payments for employee ${employeeId} on ${date.toDateString()}`);
        const employee = await this.employeeRepository.findOne({
            where: { employeeId },
        });
        if (!employee) {
            throw new common_1.NotFoundException(`Employee with ID ${employeeId} not found`);
        }
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);
        const payments = await this.paymentRepository
            .createQueryBuilder('payment')
            .leftJoinAndSelect('payment.bill', 'bill')
            .leftJoinAndSelect('bill.meter', 'meter')
            .leftJoinAndSelect('payment.customer', 'customer')
            .where('payment.employeeId = :employeeId', { employeeId })
            .andWhere('payment.paymentDate >= :startOfDay', { startOfDay })
            .andWhere('payment.paymentDate <= :endOfDay', { endOfDay })
            .orderBy('payment.paymentDate', 'ASC')
            .getMany();
        return payments;
    }
    async update(paymentId, updateDto) {
        this.logger.log(`Updating payment ${paymentId}`);
        const payment = await this.findOne(paymentId);
        const changes = [];
        if (updateDto.transactionRef !== undefined) {
            if (updateDto.transactionRef && updateDto.transactionRef !== payment.transactionRef) {
                const existingPayment = await this.paymentRepository.findOne({
                    where: { transactionRef: updateDto.transactionRef },
                });
                if (existingPayment && existingPayment.paymentId !== paymentId) {
                    throw new common_1.ConflictException(`Transaction reference '${updateDto.transactionRef}' already exists`);
                }
            }
            payment.transactionRef = updateDto.transactionRef;
            changes.push(`transactionRef: ${updateDto.transactionRef}`);
        }
        if (updateDto.paymentDate !== undefined) {
            const newDate = new Date(updateDto.paymentDate);
            if (newDate > new Date()) {
                throw new common_1.BadRequestException('Payment date cannot be in the future');
            }
            payment.paymentDate = newDate;
            changes.push(`paymentDate: ${newDate.toISOString()}`);
        }
        if (updateDto.notes !== undefined) {
            changes.push(`notes: ${updateDto.notes}`);
        }
        if (changes.length > 0) {
            this.logger.log(`Payment ${paymentId} corrected: ${changes.join(', ')}`);
        }
        await this.paymentRepository.save(payment);
        return this.findOne(paymentId);
    }
    async getBillOutstanding(billId) {
        this.logger.debug(`Calculating outstanding for bill ${billId}`);
        const bill = await this.billRepository.findOne({
            where: { billId },
            relations: ['payments', 'billDetails', 'billTaxes'],
        });
        if (!bill) {
            throw new common_1.NotFoundException(`Bill with ID ${billId} not found`);
        }
        const totalAmount = bill.getTotalAmount();
        const totalPaid = bill.getTotalPaid();
        const outstanding = this.roundAmount(totalAmount - totalPaid);
        this.logger.debug(`Bill ${billId} outstanding: ${outstanding} (Total: ${totalAmount}, Paid: ${totalPaid})`);
        return outstanding;
    }
    async getSummary(filters) {
        this.logger.debug(`Getting payment summary with filters: ${JSON.stringify(filters)}`);
        const queryBuilder = this.paymentRepository.createQueryBuilder('payment');
        if (filters?.startDate) {
            queryBuilder.andWhere('payment.paymentDate >= :startDate', { startDate: filters.startDate });
        }
        if (filters?.endDate) {
            queryBuilder.andWhere('payment.paymentDate <= :endDate', { endDate: filters.endDate });
        }
        if (filters?.employeeId) {
            queryBuilder.andWhere('payment.employeeId = :employeeId', { employeeId: filters.employeeId });
        }
        if (filters?.customerId) {
            queryBuilder.andWhere('payment.customerId = :customerId', { customerId: filters.customerId });
        }
        const totalPayments = await queryBuilder.getCount();
        const sumResult = await queryBuilder
            .select('SUM(payment.paymentAmount)', 'totalAmount')
            .getRawOne();
        const totalAmount = parseFloat(sumResult?.totalAmount || '0');
        const byMethodResult = await this.paymentRepository
            .createQueryBuilder('payment')
            .select('payment.paymentMethod', 'category')
            .addSelect('COUNT(*)', 'count')
            .addSelect('SUM(payment.paymentAmount)', 'amount')
            .where(filters?.startDate ? 'payment.paymentDate >= :startDate' : '1=1', {
            startDate: filters?.startDate,
        })
            .andWhere(filters?.endDate ? 'payment.paymentDate <= :endDate' : '1=1', {
            endDate: filters?.endDate,
        })
            .andWhere(filters?.employeeId ? 'payment.employeeId = :employeeId' : '1=1', {
            employeeId: filters?.employeeId,
        })
            .andWhere(filters?.customerId ? 'payment.customerId = :customerId' : '1=1', {
            customerId: filters?.customerId,
        })
            .groupBy('payment.paymentMethod')
            .getRawMany();
        const byChannelResult = await this.paymentRepository
            .createQueryBuilder('payment')
            .select('payment.paymentChannel', 'category')
            .addSelect('COUNT(*)', 'count')
            .addSelect('SUM(payment.paymentAmount)', 'amount')
            .where(filters?.startDate ? 'payment.paymentDate >= :startDate' : '1=1', {
            startDate: filters?.startDate,
        })
            .andWhere(filters?.endDate ? 'payment.paymentDate <= :endDate' : '1=1', {
            endDate: filters?.endDate,
        })
            .andWhere(filters?.employeeId ? 'payment.employeeId = :employeeId' : '1=1', {
            employeeId: filters?.employeeId,
        })
            .andWhere(filters?.customerId ? 'payment.customerId = :customerId' : '1=1', {
            customerId: filters?.customerId,
        })
            .andWhere('payment.paymentChannel IS NOT NULL')
            .groupBy('payment.paymentChannel')
            .getRawMany();
        const byMethod = byMethodResult.map((r) => ({
            category: r.category,
            count: parseInt(r.count, 10),
            amount: parseFloat(r.amount || '0'),
        }));
        const byChannel = byChannelResult.map((r) => ({
            category: r.category || 'UNKNOWN',
            count: parseInt(r.count, 10),
            amount: parseFloat(r.amount || '0'),
        }));
        return {
            totalPayments,
            totalAmount: this.roundAmount(totalAmount),
            byMethod,
            byChannel,
            period: {
                start: filters?.startDate || new Date(0),
                end: filters?.endDate || new Date(),
            },
        };
    }
    async getDailyCollectionReport(employeeId, date) {
        this.logger.log(`Generating daily collection report for employee ${employeeId} on ${date.toDateString()}`);
        const employee = await this.employeeRepository.findOne({
            where: { employeeId },
        });
        if (!employee) {
            throw new common_1.NotFoundException(`Employee with ID ${employeeId} not found`);
        }
        const payments = await this.findByEmployee(employeeId, date);
        const byMethodMap = new Map();
        let cashCollected = 0;
        let nonCashCollected = 0;
        for (const payment of payments) {
            const method = payment.paymentMethod;
            const existing = byMethodMap.get(method) || { count: 0, amount: 0 };
            existing.count++;
            existing.amount += Number(payment.paymentAmount);
            byMethodMap.set(method, existing);
            if (method === payment_entity_1.PaymentMethod.CASH) {
                cashCollected += Number(payment.paymentAmount);
            }
            else {
                nonCashCollected += Number(payment.paymentAmount);
            }
        }
        const byMethod = Array.from(byMethodMap.entries()).map(([category, data]) => ({
            category,
            count: data.count,
            amount: this.roundAmount(data.amount),
        }));
        const totalCollected = payments.reduce((sum, p) => sum + Number(p.paymentAmount), 0);
        const openingBalance = 0;
        const closingBalance = openingBalance + cashCollected;
        return {
            date,
            cashierName: employee.fullName,
            cashierId: employeeId,
            openingBalance: this.roundAmount(openingBalance),
            totalCollected: this.roundAmount(totalCollected),
            byMethod,
            paymentsList: payments,
            closingBalance: this.roundAmount(closingBalance),
            totalTransactions: payments.length,
            cashCollected: this.roundAmount(cashCollected),
            nonCashCollected: this.roundAmount(nonCashCollected),
        };
    }
    async processRefund(refundDto, employeeId) {
        this.logger.log(`Processing refund for payment ${refundDto.paymentId}, amount: ${refundDto.refundAmount}`);
        const originalPayment = await this.findOne(refundDto.paymentId);
        if (refundDto.refundAmount > Number(originalPayment.paymentAmount)) {
            throw new common_1.BadRequestException(`Refund amount ${refundDto.refundAmount} exceeds original payment amount ${originalPayment.paymentAmount}`);
        }
        if (refundDto.refundAmount <= 0) {
            throw new common_1.BadRequestException('Refund amount must be greater than 0');
        }
        const existingRefunds = await this.paymentRepository
            .createQueryBuilder('payment')
            .where('payment.transactionRef LIKE :ref', { ref: `REFUND-${refundDto.paymentId}-%` })
            .getMany();
        const totalRefunded = existingRefunds.reduce((sum, r) => sum + Math.abs(Number(r.paymentAmount)), 0);
        const remainingRefundable = Number(originalPayment.paymentAmount) - totalRefunded;
        if (refundDto.refundAmount > remainingRefundable) {
            throw new common_1.BadRequestException(`Cannot refund ${refundDto.refundAmount}. Maximum refundable amount is ${remainingRefundable} ` +
                `(already refunded: ${totalRefunded})`);
        }
        const employee = await this.employeeRepository.findOne({
            where: { employeeId },
        });
        if (!employee) {
            throw new common_1.NotFoundException(`Employee with ID ${employeeId} not found`);
        }
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const refundPayment = this.paymentRepository.create({
                billId: originalPayment.billId,
                customerId: originalPayment.customerId,
                employeeId: employeeId,
                paymentDate: new Date(),
                paymentAmount: -refundDto.refundAmount,
                paymentMethod: refundDto.refundMethod,
                paymentChannel: originalPayment.paymentChannel,
                transactionRef: `REFUND-${refundDto.paymentId}-${Date.now()}`,
            });
            const savedRefund = await queryRunner.manager.save(payment_entity_1.Payment, refundPayment);
            await queryRunner.commitTransaction();
            this.logger.log(`Refund ${savedRefund.paymentId} processed for payment ${refundDto.paymentId}. ` +
                `Amount: ${refundDto.refundAmount}, Reason: ${refundDto.refundReason}, ` +
                `Processed by: ${employee.fullName}`);
            return this.findOne(savedRefund.paymentId);
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            this.logger.error(`Failed to process refund for payment ${refundDto.paymentId}:`, error);
            throw error;
        }
        finally {
            await queryRunner.release();
        }
    }
    async voidPayment(paymentId, reason, employeeId) {
        this.logger.log(`Voiding payment ${paymentId}, reason: ${reason}`);
        const payment = await this.findOne(paymentId);
        if (Number(payment.paymentAmount) < 0) {
            throw new common_1.BadRequestException('Cannot void a refund payment');
        }
        const existingVoid = await this.paymentRepository.findOne({
            where: { transactionRef: `VOID-${paymentId}` },
        });
        if (existingVoid) {
            throw new common_1.BadRequestException(`Payment ${paymentId} has already been voided`);
        }
        const employee = await this.employeeRepository.findOne({
            where: { employeeId },
        });
        if (!employee) {
            throw new common_1.NotFoundException(`Employee with ID ${employeeId} not found`);
        }
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const voidPayment = this.paymentRepository.create({
                billId: payment.billId,
                customerId: payment.customerId,
                employeeId: employeeId,
                paymentDate: new Date(),
                paymentAmount: -Number(payment.paymentAmount),
                paymentMethod: payment.paymentMethod,
                paymentChannel: payment.paymentChannel,
                transactionRef: `VOID-${paymentId}`,
            });
            await queryRunner.manager.save(payment_entity_1.Payment, voidPayment);
            await queryRunner.commitTransaction();
            this.logger.log(`Payment ${paymentId} voided. Amount: ${payment.paymentAmount}, ` +
                `Reason: ${reason}, Voided by: ${employee.fullName}`);
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            this.logger.error(`Failed to void payment ${paymentId}:`, error);
            throw error;
        }
        finally {
            await queryRunner.release();
        }
    }
    async reconcilePayments(date, expectedAmount, actualAmount) {
        this.logger.log(`Reconciling payments for ${date.toDateString()}`);
        const VARIANCE_THRESHOLD = 0.01;
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);
        const payments = await this.paymentRepository.find({
            where: {
                paymentDate: (0, typeorm_2.Between)(startOfDay, endOfDay),
            },
        });
        const byMethodMap = new Map();
        for (const payment of payments) {
            const method = payment.paymentMethod;
            const existing = byMethodMap.get(method) || { count: 0, amount: 0 };
            existing.count++;
            existing.amount += Number(payment.paymentAmount);
            byMethodMap.set(method, existing);
        }
        const byMethod = Array.from(byMethodMap.entries()).map(([category, data]) => ({
            category,
            count: data.count,
            amount: this.roundAmount(data.amount),
        }));
        const systemTotal = payments.reduce((sum, p) => sum + Number(p.paymentAmount), 0);
        const totalVariance = actualAmount - expectedAmount;
        const discrepancies = [];
        if (Math.abs(totalVariance) > 0) {
            const variancePercent = expectedAmount > 0 ? (totalVariance / expectedAmount) * 100 : 0;
            discrepancies.push({
                category: 'TOTAL',
                expectedAmount,
                actualAmount,
                variance: totalVariance,
                variancePercent: this.roundAmount(variancePercent),
                exceedsThreshold: Math.abs(variancePercent) > VARIANCE_THRESHOLD * 100,
            });
        }
        if (Math.abs(actualAmount - systemTotal) > 0.01) {
            discrepancies.push({
                category: 'SYSTEM_VS_ACTUAL',
                expectedAmount: systemTotal,
                actualAmount: actualAmount,
                variance: actualAmount - systemTotal,
                variancePercent: systemTotal > 0 ? ((actualAmount - systemTotal) / systemTotal) * 100 : 0,
                exceedsThreshold: true,
            });
        }
        const hasVariances = discrepancies.length > 0;
        let status = 'BALANCED';
        if (hasVariances) {
            const hasSignificantVariance = discrepancies.some((d) => d.exceedsThreshold);
            status = hasSignificantVariance ? 'DISCREPANCY_FOUND' : 'NEEDS_REVIEW';
        }
        return {
            date,
            expectedTotal: expectedAmount,
            actualTotal: actualAmount,
            totalVariance: this.roundAmount(totalVariance),
            totalPayments: payments.length,
            byMethod,
            discrepancies,
            hasVariances,
            status,
        };
    }
    async allocatePaymentToBills(paymentAmount, billIds, employeeId, paymentMethod = payment_entity_1.PaymentMethod.CASH, transactionRef) {
        this.logger.log(`Allocating payment of ${paymentAmount} to ${billIds.length} bills`);
        if (billIds.length === 0) {
            throw new common_1.BadRequestException('At least one bill ID is required');
        }
        const bills = [];
        for (const billId of billIds) {
            const bill = await this.billRepository.findOne({
                where: { billId },
                relations: ['payments', 'billDetails', 'billTaxes'],
            });
            if (!bill) {
                throw new common_1.NotFoundException(`Bill with ID ${billId} not found`);
            }
            const outstanding = await this.getBillOutstanding(billId);
            if (outstanding > 0) {
                bills.push({ bill, outstanding });
            }
        }
        if (bills.length === 0) {
            throw new common_1.BadRequestException('All specified bills are already fully paid');
        }
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const allocations = [];
            const paymentIds = [];
            let remainingAmount = paymentAmount;
            for (const { bill, outstanding } of bills) {
                if (remainingAmount <= 0)
                    break;
                const allocatedAmount = Math.min(remainingAmount, outstanding);
                remainingAmount -= allocatedAmount;
                const customerId = await this.getCustomerIdFromBill(bill);
                const payment = this.paymentRepository.create({
                    billId: bill.billId,
                    customerId,
                    employeeId: employeeId || null,
                    paymentDate: new Date(),
                    paymentAmount: allocatedAmount,
                    paymentMethod,
                    transactionRef: transactionRef ? `${transactionRef}-${bill.billId}` : null,
                });
                const savedPayment = await queryRunner.manager.save(payment_entity_1.Payment, payment);
                paymentIds.push(savedPayment.paymentId);
                allocations.push({
                    billId: bill.billId,
                    outstandingBefore: outstanding,
                    allocatedAmount: this.roundAmount(allocatedAmount),
                    outstandingAfter: this.roundAmount(outstanding - allocatedAmount),
                    isFullyPaid: outstanding - allocatedAmount <= 0,
                });
                this.logger.debug(`Allocated ${allocatedAmount} to bill ${bill.billId}`);
            }
            await queryRunner.commitTransaction();
            return {
                totalPaymentAmount: paymentAmount,
                totalAllocated: this.roundAmount(paymentAmount - remainingAmount),
                excessAmount: this.roundAmount(remainingAmount),
                allocations,
                paymentIds,
            };
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            this.logger.error('Failed to allocate payment to bills:', error);
            throw error;
        }
        finally {
            await queryRunner.release();
        }
    }
    async searchByTransactionRef(transactionRef) {
        this.logger.debug(`Searching for payment with transaction ref: ${transactionRef}`);
        const payment = await this.paymentRepository.findOne({
            where: { transactionRef },
            relations: ['bill', 'bill.meter', 'customer', 'employee'],
        });
        return payment;
    }
    async getOverpayments() {
        this.logger.debug('Finding overpaid bills');
        const bills = await this.billRepository.find({
            relations: ['payments', 'billDetails', 'billTaxes'],
        });
        const overpayments = [];
        for (const bill of bills) {
            const totalAmount = bill.getTotalAmount();
            const totalPaid = bill.getTotalPaid();
            if (totalPaid > totalAmount) {
                const lastPayment = bill.payments?.sort((a, b) => new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime())[0];
                if (lastPayment) {
                    let customerName = 'Unknown';
                    if (lastPayment.customerId) {
                        const customer = await this.customerRepository.findOne({
                            where: { customerId: lastPayment.customerId },
                        });
                        customerName = customer?.fullName || 'Unknown';
                    }
                    overpayments.push({
                        paymentId: lastPayment.paymentId,
                        billId: bill.billId,
                        customerId: lastPayment.customerId,
                        customerName,
                        billAmount: this.roundAmount(totalAmount),
                        totalPaid: this.roundAmount(totalPaid),
                        overpaymentAmount: this.roundAmount(totalPaid - totalAmount),
                        paymentDate: lastPayment.paymentDate,
                    });
                }
            }
        }
        return overpayments;
    }
    async getPendingReconciliation(date) {
        this.logger.debug(`Finding payments pending reconciliation for ${date.toDateString()}`);
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);
        const payments = await this.paymentRepository
            .createQueryBuilder('payment')
            .leftJoinAndSelect('payment.bill', 'bill')
            .leftJoinAndSelect('payment.customer', 'customer')
            .leftJoinAndSelect('payment.employee', 'employee')
            .where('payment.paymentDate >= :startOfDay', { startOfDay })
            .andWhere('payment.paymentDate <= :endOfDay', { endOfDay })
            .andWhere('(payment.transactionRef IS NULL AND payment.paymentMethod IN (:...methods))', {
            methods: payment_entity_1.PAYMENT_METHODS_REQUIRING_REF,
        })
            .orderBy('payment.paymentDate', 'ASC')
            .getMany();
        return payments;
    }
    async exportPayments(filters) {
        this.logger.log('Exporting payments to CSV');
        const filtersWithoutPagination = { ...filters, page: 1, limit: 100000 };
        const { payments } = await this.findAll(filtersWithoutPagination);
        const headers = [
            'Payment ID',
            'Receipt Number',
            'Bill ID',
            'Payment Date',
            'Payment Amount',
            'Payment Method',
            'Payment Channel',
            'Transaction Ref',
            'Customer ID',
            'Employee ID',
        ];
        const rows = payments.map((p) => [
            p.paymentId,
            p.receiptNumber,
            p.billId,
            p.paymentDate.toISOString(),
            p.paymentAmount,
            p.paymentMethod,
            p.paymentChannel || '',
            p.transactionRef || '',
            p.customerId || '',
            p.employeeId || '',
        ]);
        const csvContent = [
            headers.join(','),
            ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
        ].join('\n');
        return Buffer.from(csvContent, 'utf-8');
    }
    async createCheckoutSession(dto, customerId) {
        this.logger.log(`Creating checkout session for customer ${customerId}, bills: ${dto.billIds.join(',')}`);
        const customer = await this.customerRepository.findOne({
            where: { customerId },
        });
        if (!customer) {
            throw new common_1.NotFoundException(`Customer with ID ${customerId} not found`);
        }
        if (!customer.email) {
            throw new common_1.BadRequestException('Customer email is required for online payments');
        }
        const bills = await this.billRepository.find({
            where: { billId: (0, typeorm_2.In)(dto.billIds) },
            relations: ['payments', 'meter', 'billDetails'],
        });
        if (bills.length !== dto.billIds.length) {
            const foundIds = bills.map((b) => b.billId);
            const missingIds = dto.billIds.filter((id) => !foundIds.includes(id));
            throw new common_1.NotFoundException(`Bills not found: ${missingIds.join(', ')}`);
        }
        for (const bill of bills) {
            const billCustomerId = await this.getCustomerIdFromBill(bill);
            if (billCustomerId !== customerId) {
                throw new common_1.BadRequestException(`Bill ${bill.billId} does not belong to customer ${customerId}`);
            }
            const outstanding = bill.getTotalAmount() - bill.getTotalPaid();
            if (outstanding <= 0) {
                throw new common_1.BadRequestException(`Bill ${bill.billId} is already fully paid`);
            }
        }
        const lineItems = bills.map((bill) => {
            const outstanding = bill.getTotalAmount() - bill.getTotalPaid();
            const periodStart = bill.billingPeriodStart
                ? new Date(bill.billingPeriodStart).toLocaleDateString()
                : '';
            const periodEnd = bill.billingPeriodEnd
                ? new Date(bill.billingPeriodEnd).toLocaleDateString()
                : '';
            const period = periodStart && periodEnd ? `${periodStart} - ${periodEnd}` : 'N/A';
            return {
                billId: bill.billId,
                billNumber: `BILL-${bill.billId}`,
                description: `Utility Bill - ${period}`,
                amount: this.roundAmount(outstanding),
            };
        });
        const totalAmount = lineItems.reduce((sum, item) => sum + item.amount, 0);
        const session = await this.stripeService.createCheckoutSession(lineItems, customerId, customer.email, dto.successUrl, dto.cancelUrl);
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            for (const bill of bills) {
                const outstanding = bill.getTotalAmount() - bill.getTotalPaid();
                const payment = this.paymentRepository.create({
                    billId: bill.billId,
                    customerId: customerId,
                    employeeId: null,
                    paymentDate: new Date(),
                    paymentAmount: outstanding,
                    paymentMethod: payment_entity_1.PaymentMethod.STRIPE_CARD,
                    paymentChannel: payment_entity_1.PaymentChannel.CUSTOMER_PORTAL,
                    paymentStatus: payment_entity_1.PaymentStatus.PENDING,
                    stripePaymentIntentId: session.payment_intent || null,
                    transactionRef: session.id,
                    metadata: JSON.stringify({
                        checkoutSessionId: session.id,
                        billIds: dto.billIds,
                        customerId,
                    }),
                });
                await queryRunner.manager.save(payment_entity_1.Payment, payment);
            }
            await queryRunner.commitTransaction();
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            this.logger.error('Failed to create pending payment records:', error);
            throw new common_1.InternalServerErrorException('Failed to create payment records');
        }
        finally {
            await queryRunner.release();
        }
        this.logger.log(`Checkout session created: ${session.id}, URL: ${session.url}`);
        return {
            sessionId: session.id,
            sessionUrl: session.url || '',
            expiresAt: new Date((session.expires_at || 0) * 1000),
            totalAmount,
            currency: 'LKR',
        };
    }
    async createPaymentIntent(billIds, customerId) {
        this.logger.log(`Creating payment intent for customer ${customerId}, bills: ${billIds.join(',')}`);
        const customer = await this.customerRepository.findOne({
            where: { customerId },
        });
        if (!customer) {
            throw new common_1.NotFoundException(`Customer with ID ${customerId} not found`);
        }
        const bills = await this.billRepository.find({
            where: { billId: (0, typeorm_2.In)(billIds) },
            relations: ['payments'],
        });
        if (bills.length !== billIds.length) {
            throw new common_1.NotFoundException('One or more bills not found');
        }
        let totalAmount = 0;
        for (const bill of bills) {
            const billCustomerId = await this.getCustomerIdFromBill(bill);
            if (billCustomerId !== customerId) {
                throw new common_1.BadRequestException(`Bill ${bill.billId} does not belong to customer`);
            }
            const outstanding = bill.getTotalAmount() - bill.getTotalPaid();
            if (outstanding <= 0) {
                throw new common_1.BadRequestException(`Bill ${bill.billId} is already fully paid`);
            }
            totalAmount += outstanding;
        }
        const paymentIntent = await this.stripeService.createPaymentIntent(totalAmount, {
            billIds: billIds.join(','),
            customerId: customerId.toString(),
            customerEmail: customer.email || '',
            source: 'payment_intent',
        });
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            for (const bill of bills) {
                const outstanding = bill.getTotalAmount() - bill.getTotalPaid();
                const payment = this.paymentRepository.create({
                    billId: bill.billId,
                    customerId: customerId,
                    employeeId: null,
                    paymentDate: new Date(),
                    paymentAmount: outstanding,
                    paymentMethod: payment_entity_1.PaymentMethod.STRIPE_CARD,
                    paymentChannel: payment_entity_1.PaymentChannel.CUSTOMER_PORTAL,
                    paymentStatus: payment_entity_1.PaymentStatus.PENDING,
                    stripePaymentIntentId: paymentIntent.id,
                    transactionRef: paymentIntent.id,
                });
                await queryRunner.manager.save(payment_entity_1.Payment, payment);
            }
            await queryRunner.commitTransaction();
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        }
        finally {
            await queryRunner.release();
        }
        this.logger.log(`Payment intent created: ${paymentIntent.id}`);
        return {
            paymentIntentId: paymentIntent.id,
            clientSecret: paymentIntent.client_secret || '',
            amount: totalAmount,
            currency: 'LKR',
            status: paymentIntent.status,
            publicKey: this.stripeService.getPublishableKey(),
            billIds,
        };
    }
    async confirmStripePayment(dto) {
        this.logger.log(`Confirming Stripe payment: ${dto.paymentIntentId}`);
        const payments = await this.paymentRepository.find({
            where: {
                stripePaymentIntentId: dto.paymentIntentId,
                paymentStatus: payment_entity_1.PaymentStatus.PENDING,
            },
            relations: ['bill'],
        });
        if (payments.length === 0 && dto.metadata?.billIds) {
            this.logger.warn(`No pending payments found for ${dto.paymentIntentId}, attempting to create from metadata`);
            const billIds = dto.metadata.billIds.split(',').map((id) => parseInt(id, 10));
            const customerId = dto.metadata.customerId ? parseInt(dto.metadata.customerId, 10) : null;
            const bills = await this.billRepository.find({
                where: { billId: (0, typeorm_2.In)(billIds) },
                relations: ['payments'],
            });
            const queryRunner = this.dataSource.createQueryRunner();
            await queryRunner.connect();
            await queryRunner.startTransaction();
            try {
                for (const bill of bills) {
                    const outstanding = bill.getTotalAmount() - bill.getTotalPaid();
                    const payment = this.paymentRepository.create({
                        billId: bill.billId,
                        customerId: customerId,
                        employeeId: null,
                        paymentDate: new Date(),
                        paymentAmount: outstanding,
                        paymentMethod: dto.paymentMethodType === 'card'
                            ? payment_entity_1.PaymentMethod.STRIPE_CARD
                            : payment_entity_1.PaymentMethod.STRIPE_WALLET,
                        paymentChannel: payment_entity_1.PaymentChannel.CUSTOMER_PORTAL,
                        paymentStatus: payment_entity_1.PaymentStatus.COMPLETED,
                        stripePaymentIntentId: dto.paymentIntentId,
                        stripeChargeId: dto.stripeChargeId,
                        transactionRef: dto.paymentIntentId,
                    });
                    const savedPayment = (await queryRunner.manager.save(payment_entity_1.Payment, payment));
                    payments.push(savedPayment);
                }
                await queryRunner.commitTransaction();
            }
            catch (error) {
                await queryRunner.rollbackTransaction();
                throw error;
            }
            finally {
                await queryRunner.release();
            }
        }
        else {
            const queryRunner = this.dataSource.createQueryRunner();
            await queryRunner.connect();
            await queryRunner.startTransaction();
            try {
                for (const payment of payments) {
                    payment.paymentStatus = payment_entity_1.PaymentStatus.COMPLETED;
                    payment.stripeChargeId = dto.stripeChargeId;
                    payment.paymentDate = new Date();
                    await queryRunner.manager.save(payment_entity_1.Payment, payment);
                }
                await queryRunner.commitTransaction();
            }
            catch (error) {
                await queryRunner.rollbackTransaction();
                throw error;
            }
            finally {
                await queryRunner.release();
            }
        }
        this.logger.log(`Confirmed ${payments.length} payments for ${dto.paymentIntentId}`);
        return payments;
    }
    async handleStripeWebhook(event) {
        this.logger.log(`Processing webhook event: ${event.eventType}, ID: ${event.eventId}`);
        const existingPayment = await this.paymentRepository.findOne({
            where: { metadata: (0, typeorm_2.Like)(`%"webhookEventId":"${event.eventId}"%`) },
        });
        if (existingPayment) {
            this.logger.warn(`Webhook event ${event.eventId} already processed, skipping`);
            return;
        }
        try {
            switch (event.eventType) {
                case dto_1.StripeWebhookEventType.PAYMENT_INTENT_SUCCEEDED:
                    await this.handlePaymentIntentSucceeded(event);
                    break;
                case dto_1.StripeWebhookEventType.PAYMENT_INTENT_FAILED:
                    await this.handlePaymentIntentFailed(event);
                    break;
                case dto_1.StripeWebhookEventType.CHECKOUT_SESSION_COMPLETED:
                    await this.handleCheckoutSessionCompleted(event);
                    break;
                case dto_1.StripeWebhookEventType.CHECKOUT_SESSION_EXPIRED:
                    await this.handleCheckoutSessionExpired(event);
                    break;
                case dto_1.StripeWebhookEventType.CHARGE_REFUNDED:
                    await this.handleChargeRefunded(event);
                    break;
                default:
                    this.logger.warn(`Unhandled webhook event type: ${event.eventType}`);
            }
        }
        catch (error) {
            this.logger.error(`Error processing webhook ${event.eventId}:`, error);
            throw error;
        }
    }
    async handlePaymentIntentSucceeded(event) {
        this.logger.log(`Payment intent succeeded: ${event.paymentIntentId}`);
        await this.confirmStripePayment({
            paymentIntentId: event.paymentIntentId || '',
            stripeChargeId: event.chargeId || '',
            amount: event.amount,
            currency: event.currency,
            paymentMethodType: 'card',
            metadata: event.metadata,
        });
    }
    async handlePaymentIntentFailed(event) {
        this.logger.warn(`Payment intent failed: ${event.paymentIntentId}`);
        const payments = await this.paymentRepository.find({
            where: {
                stripePaymentIntentId: event.paymentIntentId,
                paymentStatus: payment_entity_1.PaymentStatus.PENDING,
            },
        });
        for (const payment of payments) {
            payment.paymentStatus = payment_entity_1.PaymentStatus.FAILED;
            payment.metadata = JSON.stringify({
                ...(payment.parsedMetadata || {}),
                failureReason: 'Payment failed',
                webhookEventId: event.eventId,
            });
            await this.paymentRepository.save(payment);
        }
        this.logger.log(`Marked ${payments.length} payments as FAILED`);
    }
    async handleCheckoutSessionCompleted(event) {
        this.logger.log(`Checkout session completed: ${event.checkoutSessionId}`);
        const payments = await this.paymentRepository.find({
            where: { transactionRef: event.checkoutSessionId },
        });
        for (const payment of payments) {
            if (payment.paymentStatus === payment_entity_1.PaymentStatus.PENDING) {
                payment.paymentStatus = payment_entity_1.PaymentStatus.COMPLETED;
                payment.paymentDate = new Date();
                await this.paymentRepository.save(payment);
            }
        }
        this.logger.log(`Confirmed ${payments.length} payments from checkout session`);
    }
    async handleCheckoutSessionExpired(event) {
        this.logger.log(`Checkout session expired: ${event.checkoutSessionId}`);
        const payments = await this.paymentRepository.find({
            where: {
                transactionRef: event.checkoutSessionId,
                paymentStatus: payment_entity_1.PaymentStatus.PENDING,
            },
        });
        for (const payment of payments) {
            payment.paymentStatus = payment_entity_1.PaymentStatus.CANCELLED;
            await this.paymentRepository.save(payment);
        }
        this.logger.log(`Cancelled ${payments.length} expired checkout payments`);
    }
    async handleChargeRefunded(event) {
        this.logger.log(`Charge refunded: ${event.chargeId}`);
        const payment = await this.paymentRepository.findOne({
            where: { stripeChargeId: event.chargeId },
        });
        if (payment) {
            payment.paymentStatus = payment_entity_1.PaymentStatus.REFUNDED;
            await this.paymentRepository.save(payment);
            this.logger.log(`Payment ${payment.paymentId} marked as REFUNDED`);
        }
    }
    async getCustomerUnpaidBills(customerId) {
        this.logger.log(`Getting unpaid bills for customer ${customerId}`);
        const customer = await this.customerRepository.findOne({
            where: { customerId },
        });
        if (!customer) {
            throw new common_1.NotFoundException(`Customer with ID ${customerId} not found`);
        }
        const bills = await this.dataSource.query(`SELECT b.*, m.serial_no as meterSerialNo, ut.type_name as utilityType
             FROM Bill b
             INNER JOIN Meter m ON m.meter_id = b.meter_id
             INNER JOIN ServiceConnection sc ON sc.meter_id = m.meter_id
             INNER JOIN UtilityType ut ON ut.utility_type_id = m.utility_type_id
             WHERE sc.customer_id = @0
             ORDER BY b.due_date ASC`, [customerId]);
        const unpaidBills = [];
        let totalOutstanding = 0;
        let overdueBillCount = 0;
        for (const bill of bills) {
            const paymentsResult = await this.dataSource.query(`SELECT COALESCE(SUM(payment_amount), 0) as total_paid
                 FROM Payment
                 WHERE bill_id = @0 AND payment_status = 'COMPLETED'`, [bill.bill_id]);
            const totalPaid = parseFloat(paymentsResult[0]?.total_paid || '0');
            const billAmount = parseFloat(bill.total_amount || '0');
            const outstanding = billAmount - totalPaid;
            if (outstanding > 0) {
                const dueDate = new Date(bill.due_date);
                const today = new Date();
                const isOverdue = dueDate < today;
                const daysOverdue = isOverdue
                    ? Math.floor((today.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24))
                    : undefined;
                if (isOverdue) {
                    overdueBillCount++;
                }
                totalOutstanding += outstanding;
                unpaidBills.push({
                    billId: bill.bill_id,
                    billNumber: bill.bill_number,
                    billDate: new Date(bill.bill_date),
                    dueDate: dueDate,
                    amount: billAmount,
                    outstanding: outstanding,
                    isOverdue,
                    daysOverdue,
                    meterSerialNo: bill.meterSerialNo,
                    utilityType: bill.utilityType,
                    billingPeriod: `${bill.billing_period_start || ''} - ${bill.billing_period_end || ''}`,
                    selected: false,
                });
            }
        }
        unpaidBills.sort((a, b) => {
            if (a.isOverdue && !b.isOverdue)
                return -1;
            if (!a.isOverdue && b.isOverdue)
                return 1;
            return a.dueDate.getTime() - b.dueDate.getTime();
        });
        return {
            customerId,
            customerName: `${customer.firstName || ''} ${customer.lastName || ''}`.trim(),
            customerEmail: customer.email || '',
            totalOutstanding: this.roundAmount(totalOutstanding),
            unpaidBillCount: unpaidBills.length,
            overdueBillCount,
            bills: unpaidBills,
        };
    }
    async createCashierPayment(dto, employeeId) {
        this.logger.log(`Creating cashier payment for bill ${dto.billId} by employee ${employeeId}`);
        const employee = await this.employeeRepository.findOne({
            where: { employeeId },
        });
        if (!employee) {
            throw new common_1.NotFoundException(`Employee with ID ${employeeId} not found`);
        }
        const allowedRoles = ['CASHIER', 'MANAGER', 'ADMIN', 'CLERK'];
        if (!allowedRoles.includes(employee.role?.toUpperCase() || '')) {
            throw new common_1.ForbiddenException('Employee does not have permission to record payments');
        }
        const bill = await this.billRepository.findOne({
            where: { billId: dto.billId },
            relations: ['payments', 'meter'],
        });
        if (!bill) {
            throw new common_1.NotFoundException(`Bill with ID ${dto.billId} not found`);
        }
        const totalBillAmount = bill.getTotalAmount();
        const totalPaid = bill.getTotalPaid();
        const outstanding = totalBillAmount - totalPaid;
        const maxAllowedPayment = outstanding * (1 + this.OVERPAYMENT_TOLERANCE);
        if (dto.paymentAmount > maxAllowedPayment && outstanding > 0) {
            throw new common_1.BadRequestException(`Payment amount ${dto.paymentAmount} exceeds maximum allowed ${maxAllowedPayment.toFixed(2)}`);
        }
        const customerId = dto.customerId || (await this.getCustomerIdFromBill(bill));
        if (dto.customerId) {
            const customer = await this.customerRepository.findOne({
                where: { customerId: dto.customerId },
            });
            if (!customer) {
                throw new common_1.NotFoundException(`Customer with ID ${dto.customerId} not found`);
            }
        }
        if (dto.paymentMethod !== dto_1.CashierPaymentMethod.CASH && !dto.transactionRef) {
            throw new common_1.BadRequestException(`Transaction reference required for ${dto.paymentMethod} payments`);
        }
        const paymentMethodMap = {
            [dto_1.CashierPaymentMethod.CASH]: payment_entity_1.PaymentMethod.CASH,
            [dto_1.CashierPaymentMethod.CARD_TERMINAL]: payment_entity_1.PaymentMethod.CARD_TERMINAL,
            [dto_1.CashierPaymentMethod.CHEQUE]: payment_entity_1.PaymentMethod.CHEQUE,
            [dto_1.CashierPaymentMethod.BANK_TRANSFER]: payment_entity_1.PaymentMethod.BANK_TRANSFER,
        };
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const payment = this.paymentRepository.create({
                billId: dto.billId,
                customerId: customerId,
                employeeId: employeeId,
                paymentDate: new Date(),
                paymentAmount: dto.paymentAmount,
                paymentMethod: paymentMethodMap[dto.paymentMethod],
                paymentChannel: payment_entity_1.PaymentChannel.CASHIER_PORTAL,
                paymentStatus: payment_entity_1.PaymentStatus.COMPLETED,
                transactionRef: dto.transactionRef || `CASH-${Date.now()}`,
                metadata: dto.notes ? JSON.stringify({ notes: dto.notes }) : null,
            });
            const savedPayment = (await queryRunner.manager.save(payment_entity_1.Payment, payment));
            const newOutstanding = outstanding - dto.paymentAmount;
            if (newOutstanding <= 0) {
                this.logger.log(`Bill ${dto.billId} is now fully paid`);
            }
            await queryRunner.commitTransaction();
            this.logger.log(`Cashier payment ${savedPayment.paymentId} created. Receipt: ${savedPayment.receiptNumber}, ` +
                `Amount: ${savedPayment.paymentAmount}, Method: ${dto.paymentMethod}`);
            return this.findOne(savedPayment.paymentId);
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            this.logger.error(`Failed to create cashier payment for bill ${dto.billId}:`, error);
            throw error;
        }
        finally {
            await queryRunner.release();
        }
    }
    async getCustomerPaymentHistory(customerId, options) {
        this.logger.log(`Getting payment history for customer ${customerId}`);
        const queryBuilder = this.paymentRepository
            .createQueryBuilder('p')
            .leftJoinAndSelect('p.bill', 'b')
            .where('p.customerId = :customerId', { customerId })
            .andWhere('p.paymentStatus IN (:...statuses)', {
            statuses: [payment_entity_1.PaymentStatus.COMPLETED, payment_entity_1.PaymentStatus.REFUNDED],
        });
        if (options?.startDate) {
            queryBuilder.andWhere('p.paymentDate >= :startDate', { startDate: options.startDate });
        }
        if (options?.endDate) {
            queryBuilder.andWhere('p.paymentDate <= :endDate', { endDate: options.endDate });
        }
        queryBuilder.orderBy('p.paymentDate', 'DESC');
        if (options?.limit) {
            queryBuilder.take(options.limit);
        }
        return queryBuilder.getMany();
    }
    async getPendingStripePayments(customerId) {
        this.logger.log(`Getting pending Stripe payments${customerId ? ` for customer ${customerId}` : ''}`);
        const whereConditions = {
            paymentStatus: payment_entity_1.PaymentStatus.PENDING,
            paymentMethod: (0, typeorm_2.In)([payment_entity_1.PaymentMethod.STRIPE_CARD, payment_entity_1.PaymentMethod.STRIPE_WALLET]),
        };
        if (customerId) {
            whereConditions.customerId = customerId;
        }
        const pendingPayments = await this.paymentRepository.find({
            where: whereConditions,
            relations: ['bill'],
            order: { paymentDate: 'DESC' },
        });
        const now = new Date();
        const expiryHours = 24;
        const expiredPayments = [];
        const activePayments = [];
        for (const payment of pendingPayments) {
            const ageHours = (now.getTime() - new Date(payment.paymentDate).getTime()) / (1000 * 60 * 60);
            if (ageHours > expiryHours) {
                payment.paymentStatus = payment_entity_1.PaymentStatus.CANCELLED;
                payment.metadata = JSON.stringify({
                    ...(payment.parsedMetadata || {}),
                    expiredAt: now.toISOString(),
                    reason: 'Payment intent expired',
                });
                await this.paymentRepository.save(payment);
                expiredPayments.push(payment);
            }
            else {
                activePayments.push(payment);
            }
        }
        if (expiredPayments.length > 0) {
            this.logger.log(`Marked ${expiredPayments.length} pending payments as expired`);
        }
        return activePayments;
    }
    async refundStripePayment(paymentId, amount, reason, employeeId) {
        this.logger.log(`Processing Stripe refund for payment ${paymentId}`);
        const payment = await this.paymentRepository.findOne({
            where: { paymentId },
            relations: ['bill'],
        });
        if (!payment) {
            throw new common_1.NotFoundException(`Payment with ID ${paymentId} not found`);
        }
        if (!payment_entity_1.STRIPE_PAYMENT_METHODS.includes(payment.paymentMethod)) {
            throw new common_1.BadRequestException('This payment was not made via Stripe');
        }
        if (payment.paymentStatus !== payment_entity_1.PaymentStatus.COMPLETED) {
            throw new common_1.BadRequestException('Only completed payments can be refunded');
        }
        if (!payment.stripePaymentIntentId) {
            throw new common_1.BadRequestException('Stripe payment intent ID not found');
        }
        const refundAmount = amount || payment.paymentAmount;
        if (refundAmount > payment.paymentAmount) {
            throw new common_1.BadRequestException('Refund amount cannot exceed payment amount');
        }
        const stripeReason = reason === 'duplicate' || reason === 'fraudulent' || reason === 'requested_by_customer'
            ? reason
            : 'requested_by_customer';
        const refund = await this.stripeService.refundPayment(payment.stripePaymentIntentId, refundAmount, stripeReason);
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const refundPayment = this.paymentRepository.create({
                billId: payment.billId,
                customerId: payment.customerId,
                employeeId: employeeId || null,
                paymentDate: new Date(),
                paymentAmount: -refundAmount,
                paymentMethod: payment.paymentMethod,
                paymentChannel: payment.paymentChannel,
                paymentStatus: payment_entity_1.PaymentStatus.REFUNDED,
                transactionRef: refund.id,
                stripePaymentIntentId: payment.stripePaymentIntentId,
                stripeChargeId: refund.charge || null,
                metadata: JSON.stringify({
                    originalPaymentId: paymentId,
                    refundReason: reason,
                    stripeRefundId: refund.id,
                }),
            });
            const savedRefund = (await queryRunner.manager.save(payment_entity_1.Payment, refundPayment));
            if (refundAmount >= payment.paymentAmount) {
                payment.paymentStatus = payment_entity_1.PaymentStatus.REFUNDED;
            }
            payment.metadata = JSON.stringify({
                ...(payment.parsedMetadata || {}),
                refundedAt: new Date().toISOString(),
                refundAmount,
                refundPaymentId: savedRefund.paymentId,
            });
            await queryRunner.manager.save(payment_entity_1.Payment, payment);
            await queryRunner.commitTransaction();
            this.logger.log(`Stripe refund processed: ${savedRefund.paymentId}, Amount: ${refundAmount}`);
            return savedRefund;
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        }
        finally {
            await queryRunner.release();
        }
    }
    async refundCashierPayment(paymentId, refundDto, employeeId) {
        this.logger.log(`Processing cashier refund for payment ${paymentId} by employee ${employeeId}`);
        const employee = await this.employeeRepository.findOne({
            where: { employeeId },
        });
        if (!employee) {
            throw new common_1.NotFoundException(`Employee with ID ${employeeId} not found`);
        }
        const MANAGER_APPROVAL_THRESHOLD = 10000;
        if (refundDto.refundAmount > MANAGER_APPROVAL_THRESHOLD) {
            const managerRoles = ['MANAGER', 'ADMIN'];
            if (!managerRoles.includes(employee.role?.toUpperCase() || '')) {
                throw new common_1.ForbiddenException('Manager approval required for refunds over ' + MANAGER_APPROVAL_THRESHOLD);
            }
        }
        const payment = await this.paymentRepository.findOne({
            where: { paymentId },
            relations: ['bill'],
        });
        if (!payment) {
            throw new common_1.NotFoundException(`Payment with ID ${paymentId} not found`);
        }
        if (payment.paymentStatus !== payment_entity_1.PaymentStatus.COMPLETED) {
            throw new common_1.BadRequestException('Only completed payments can be refunded');
        }
        if (refundDto.refundAmount > payment.paymentAmount) {
            throw new common_1.BadRequestException('Refund amount cannot exceed payment amount');
        }
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const refundMethodMap = {
                CASH: payment_entity_1.PaymentMethod.CASH,
                BANK_TRANSFER: payment_entity_1.PaymentMethod.BANK_TRANSFER,
            };
            const refundPayment = this.paymentRepository.create({
                billId: payment.billId,
                customerId: payment.customerId,
                employeeId: employeeId,
                paymentDate: new Date(),
                paymentAmount: -refundDto.refundAmount,
                paymentMethod: refundMethodMap[refundDto.refundMethod] || payment_entity_1.PaymentMethod.CASH,
                paymentChannel: payment_entity_1.PaymentChannel.CASHIER_PORTAL,
                paymentStatus: payment_entity_1.PaymentStatus.REFUNDED,
                transactionRef: `REFUND-${Date.now()}`,
                metadata: JSON.stringify({
                    originalPaymentId: paymentId,
                    refundReason: refundDto.refundReason,
                    refundNotes: refundDto.notes,
                    authorizedBy: employeeId,
                    bankDetails: refundDto.refundMethod === 'BANK_TRANSFER' ? refundDto.bankDetails : undefined,
                }),
            });
            const savedRefund = (await queryRunner.manager.save(payment_entity_1.Payment, refundPayment));
            if (refundDto.refundAmount >= payment.paymentAmount) {
                payment.paymentStatus = payment_entity_1.PaymentStatus.REFUNDED;
            }
            payment.metadata = JSON.stringify({
                ...(payment.parsedMetadata || {}),
                refundedAt: new Date().toISOString(),
                refundAmount: refundDto.refundAmount,
                refundPaymentId: savedRefund.paymentId,
            });
            await queryRunner.manager.save(payment_entity_1.Payment, payment);
            await queryRunner.commitTransaction();
            this.logger.log(`Cashier refund processed: ${savedRefund.paymentId}, Amount: ${refundDto.refundAmount}`);
            return savedRefund;
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        }
        finally {
            await queryRunner.release();
        }
    }
    async getPaymentSummary(filters) {
        this.logger.log('Getting payment summary');
        const queryBuilder = this.paymentRepository.createQueryBuilder('p');
        if (filters?.startDate) {
            queryBuilder.andWhere('p.paymentDate >= :startDate', { startDate: filters.startDate });
        }
        if (filters?.endDate) {
            queryBuilder.andWhere('p.paymentDate <= :endDate', { endDate: filters.endDate });
        }
        if (filters?.customerId) {
            queryBuilder.andWhere('p.customerId = :customerId', { customerId: filters.customerId });
        }
        const payments = await queryBuilder.getMany();
        const byChannel = {};
        const byMethod = {};
        const byStatus = {};
        let totalAmount = 0;
        let totalCount = 0;
        let failedCount = 0;
        let refundedAmount = 0;
        for (const payment of payments) {
            const amount = Math.abs(payment.paymentAmount);
            const channel = payment.paymentChannel || 'UNKNOWN';
            if (!byChannel[channel]) {
                byChannel[channel] = { count: 0, amount: 0 };
            }
            byChannel[channel].count++;
            byChannel[channel].amount += amount;
            const method = payment.paymentMethod;
            if (!byMethod[method]) {
                byMethod[method] = { count: 0, amount: 0 };
            }
            byMethod[method].count++;
            byMethod[method].amount += amount;
            const status = payment.paymentStatus ?? payment_entity_1.PaymentStatus.COMPLETED;
            if (!byStatus[status]) {
                byStatus[status] = { count: 0, amount: 0 };
            }
            byStatus[status].count++;
            byStatus[status].amount += amount;
            if (payment.paymentAmount > 0) {
                totalAmount += payment.paymentAmount;
                totalCount++;
            }
            const paymentStatusForCheck = payment.paymentStatus ?? payment_entity_1.PaymentStatus.COMPLETED;
            if (paymentStatusForCheck === payment_entity_1.PaymentStatus.FAILED) {
                failedCount++;
            }
            else if (paymentStatusForCheck === payment_entity_1.PaymentStatus.REFUNDED && payment.paymentAmount < 0) {
                refundedAmount += Math.abs(payment.paymentAmount);
            }
        }
        const stripeTotal = (byMethod[payment_entity_1.PaymentMethod.STRIPE_CARD]?.count || 0) +
            (byMethod[payment_entity_1.PaymentMethod.STRIPE_WALLET]?.count || 0);
        const stripeCompleted = payments.filter((p) => payment_entity_1.STRIPE_PAYMENT_METHODS.includes(p.paymentMethod) &&
            p.paymentStatus === payment_entity_1.PaymentStatus.COMPLETED).length;
        const stripeSuccessRate = stripeTotal > 0 ? (stripeCompleted / stripeTotal) * 100 : 100;
        return {
            totalPayments: totalCount,
            totalAmount: this.roundAmount(totalAmount),
            byChannel: Object.entries(byChannel).map(([category, data]) => ({
                category,
                count: data.count,
                amount: this.roundAmount(data.amount),
            })),
            byMethod: Object.entries(byMethod).map(([category, data]) => ({
                category,
                count: data.count,
                amount: this.roundAmount(data.amount),
            })),
            byStatus: Object.entries(byStatus).map(([category, data]) => ({
                category,
                count: data.count,
                amount: this.roundAmount(data.amount),
            })),
            stripeSuccessRate: this.roundAmount(stripeSuccessRate),
            failedCount,
            refundedAmount: this.roundAmount(refundedAmount),
            period: {
                start: filters?.startDate || new Date(),
                end: filters?.endDate || new Date(),
            },
        };
    }
    async getCashierDailyReport(date, employeeId) {
        this.logger.log(`Getting daily cashier report for ${date.toDateString()}`);
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);
        const queryBuilder = this.paymentRepository
            .createQueryBuilder('p')
            .where('p.paymentChannel = :channel', { channel: payment_entity_1.PaymentChannel.CASHIER_PORTAL })
            .andWhere('p.paymentDate BETWEEN :start AND :end', { start: startOfDay, end: endOfDay })
            .andWhere('p.paymentStatus = :status', { status: payment_entity_1.PaymentStatus.COMPLETED })
            .andWhere('p.paymentAmount > 0');
        if (employeeId) {
            queryBuilder.andWhere('p.employeeId = :employeeId', { employeeId });
        }
        const payments = await queryBuilder.getMany();
        let cashierName = 'All Cashiers';
        if (employeeId) {
            const employee = await this.employeeRepository.findOne({ where: { employeeId } });
            if (employee) {
                cashierName = `${employee.firstName || ''} ${employee.lastName || ''}`.trim();
            }
        }
        const byMethod = {};
        let totalCollected = 0;
        let cashCollected = 0;
        let nonCashCollected = 0;
        for (const payment of payments) {
            const method = payment.paymentMethod;
            if (!byMethod[method]) {
                byMethod[method] = { count: 0, amount: 0 };
            }
            byMethod[method].count++;
            byMethod[method].amount += payment.paymentAmount;
            totalCollected += payment.paymentAmount;
            if (method === payment_entity_1.PaymentMethod.CASH) {
                cashCollected += payment.paymentAmount;
            }
            else {
                nonCashCollected += payment.paymentAmount;
            }
        }
        return {
            date: date,
            cashierName,
            cashierId: employeeId || 0,
            openingBalance: 0,
            totalCollected: this.roundAmount(totalCollected),
            cashCollected: this.roundAmount(cashCollected),
            nonCashCollected: this.roundAmount(nonCashCollected),
            totalTransactions: payments.length,
            byMethod: Object.entries(byMethod).map(([category, data]) => ({
                category,
                count: data.count,
                amount: this.roundAmount(data.amount),
            })),
            closingBalance: this.roundAmount(cashCollected),
            paymentsList: [],
        };
    }
    async getCustomerIdFromBill(bill) {
        try {
            const result = await this.dataSource.query(`SELECT c.customer_id 
         FROM ServiceConnection sc
         INNER JOIN Customer c ON c.customer_id = sc.customer_id
         WHERE sc.meter_id = @0`, [bill.meterId]);
            return result?.[0]?.customer_id || null;
        }
        catch (error) {
            this.logger.warn(`Could not get customer ID for bill ${bill.billId}:`, error.message);
            return null;
        }
    }
    mapSortColumn(sortBy) {
        const columnMap = {
            paymentDate: 'payment_date',
            paymentAmount: 'payment_amount',
            paymentMethod: 'payment_method',
            paymentChannel: 'payment_channel',
            transactionRef: 'transaction_ref',
            billId: 'bill_id',
            customerId: 'customer_id',
            employeeId: 'employee_id',
        };
        return columnMap[sortBy] || sortBy;
    }
    roundAmount(amount) {
        return Math.round(amount * 100) / 100;
    }
};
exports.PaymentService = PaymentService;
exports.PaymentService = PaymentService = PaymentService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(payment_entity_1.Payment)),
    __param(1, (0, typeorm_1.InjectRepository)(bill_entity_1.Bill)),
    __param(2, (0, typeorm_1.InjectRepository)(customer_entity_1.Customer)),
    __param(3, (0, typeorm_1.InjectRepository)(employee_entity_1.Employee)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.DataSource,
        stripe_service_1.StripeService])
], PaymentService);
//# sourceMappingURL=payment.service.js.map