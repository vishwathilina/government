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
exports.CustomerPortalService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const customer_entity_1 = require("../../database/entities/customer.entity");
const bill_entity_1 = require("../../database/entities/bill.entity");
const payment_entity_1 = require("../../database/entities/payment.entity");
const service_connection_entity_1 = require("../../database/entities/service-connection.entity");
const meter_reading_entity_1 = require("../../database/entities/meter-reading.entity");
let CustomerPortalService = class CustomerPortalService {
    constructor(customerRepository, billRepository, paymentRepository, connectionRepository, readingRepository) {
        this.customerRepository = customerRepository;
        this.billRepository = billRepository;
        this.paymentRepository = paymentRepository;
        this.connectionRepository = connectionRepository;
        this.readingRepository = readingRepository;
    }
    async getDashboardData(customerId) {
        const customer = await this.customerRepository.findOne({
            where: { customerId },
            relations: ['address', 'phoneNumbers'],
        });
        if (!customer) {
            throw new common_1.NotFoundException('Customer not found');
        }
        const unpaidBills = await this.getUnpaidBills(customerId);
        const recentPayments = await this.getRecentPayments(customerId, 5);
        const connections = await this.connectionRepository.find({
            where: { customerId },
            relations: ['utilityType', 'meter'],
        });
        const totalOutstanding = unpaidBills.bills.reduce((sum, bill) => sum + bill.outstandingAmount, 0);
        const nextDueBill = unpaidBills.bills
            .filter((b) => !b.isPaid)
            .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())[0];
        return {
            customer: {
                customerId: customer.customerId,
                firstName: customer.firstName,
                lastName: customer.lastName,
                fullName: customer.fullName,
                email: customer.email,
                customerType: customer.customerType,
                address: customer.address
                    ? {
                        line1: customer.address.line1,
                        postalCode: customer.address.postalCode,
                    }
                    : null,
                phoneNumbers: customer.phoneNumbers?.map((p) => p.phone) || [],
            },
            accountSummary: {
                totalOutstanding,
                unpaidBillCount: unpaidBills.bills.filter((b) => !b.isPaid).length,
                overdueBillCount: unpaidBills.bills.filter((b) => b.isOverdue).length,
                nextDueDate: nextDueBill?.dueDate || null,
                nextDueAmount: nextDueBill?.outstandingAmount || 0,
            },
            unpaidBills: unpaidBills.bills.slice(0, 5),
            recentPayments,
            connections: connections.map((c) => ({
                connectionId: c.connectionId,
                utilityType: c.utilityType?.name || 'Unknown',
                status: c.connectionStatus,
                meterSerialNo: c.meter?.meterSerialNo || 'Not assigned',
            })),
        };
    }
    async getCustomerProfile(customerId) {
        const customer = await this.customerRepository.findOne({
            where: { customerId },
            relations: ['address', 'phoneNumbers'],
        });
        if (!customer) {
            throw new common_1.NotFoundException('Customer not found');
        }
        return {
            customerId: customer.customerId,
            firstName: customer.firstName,
            middleName: customer.middleName,
            lastName: customer.lastName,
            fullName: customer.fullName,
            email: customer.email,
            customerType: customer.customerType,
            identityType: customer.identityType,
            identityRef: customer.identityRef,
            registrationDate: customer.registrationDate,
            address: customer.address
                ? {
                    line1: customer.address.line1,
                    postalCode: customer.address.postalCode,
                }
                : null,
            phoneNumbers: customer.phoneNumbers?.map((p) => p.phone) || [],
        };
    }
    async getUnpaidBills(customerId) {
        const connections = await this.connectionRepository.find({
            where: { customerId },
            select: ['connectionId', 'meterId'],
        });
        if (connections.length === 0) {
            return { bills: [], totalOutstanding: 0 };
        }
        const meterIds = connections
            .filter((c) => c.meterId)
            .map((c) => c.meterId);
        if (meterIds.length === 0) {
            return { bills: [], totalOutstanding: 0 };
        }
        const bills = await this.billRepository
            .createQueryBuilder('bill')
            .leftJoinAndSelect('bill.meter', 'meter')
            .leftJoinAndSelect('meter.utilityType', 'utilityType')
            .leftJoinAndSelect('bill.payments', 'payments')
            .leftJoinAndSelect('bill.billTaxes', 'billTaxes')
            .where('bill.meterId IN (:...meterIds)', { meterIds })
            .orderBy('bill.dueDate', 'ASC')
            .getMany();
        const now = new Date();
        const unpaidBills = bills
            .filter((bill) => !bill.isPaid())
            .map((bill) => ({
            billId: bill.billId,
            billNumber: `BILL-${bill.billId.toString().padStart(6, '0')}`,
            meterSerialNo: bill.meter?.meterSerialNo || 'Unknown',
            utilityType: bill.meter?.utilityType?.name || 'Unknown',
            billingPeriodStart: bill.billingPeriodStart,
            billingPeriodEnd: bill.billingPeriodEnd,
            billDate: bill.billDate,
            dueDate: bill.dueDate,
            totalAmount: bill.getTotalAmount(),
            paidAmount: bill.getTotalPaid(),
            outstandingAmount: bill.getOutstandingBalance(),
            isPaid: bill.isPaid(),
            isOverdue: bill.isOverdue(now),
            daysOverdue: bill.getDaysOverdue(now),
        }));
        const totalOutstanding = unpaidBills.reduce((sum, bill) => sum + bill.outstandingAmount, 0);
        return {
            bills: unpaidBills,
            totalOutstanding,
        };
    }
    async getBillHistory(customerId, options) {
        const connections = await this.connectionRepository.find({
            where: { customerId },
            select: ['connectionId', 'meterId'],
        });
        if (connections.length === 0) {
            return { bills: [], total: 0, page: options.page, limit: options.limit, totalPages: 0 };
        }
        const meterIds = connections.filter((c) => c.meterId).map((c) => c.meterId);
        if (meterIds.length === 0) {
            return { bills: [], total: 0, page: options.page, limit: options.limit, totalPages: 0 };
        }
        const skip = (options.page - 1) * options.limit;
        const queryBuilder = this.billRepository
            .createQueryBuilder('bill')
            .leftJoinAndSelect('bill.meter', 'meter')
            .leftJoinAndSelect('meter.utilityType', 'utilityType')
            .leftJoinAndSelect('bill.payments', 'payments')
            .leftJoinAndSelect('bill.billTaxes', 'billTaxes')
            .where('bill.meterId IN (:...meterIds)', { meterIds });
        const [bills, total] = await queryBuilder
            .orderBy('bill.billDate', 'DESC')
            .skip(skip)
            .take(options.limit)
            .getManyAndCount();
        const now = new Date();
        let billsFormatted = bills.map((bill) => {
            const isPaid = bill.isPaid();
            const isOverdue = bill.isOverdue(now);
            let status = 'UNPAID';
            if (isPaid)
                status = 'PAID';
            else if (isOverdue)
                status = 'OVERDUE';
            else if (bill.getTotalPaid() > 0)
                status = 'PARTIAL';
            return {
                billId: bill.billId,
                billNumber: `BILL-${bill.billId.toString().padStart(6, '0')}`,
                meterSerialNo: bill.meter?.meterSerialNo || 'Unknown',
                utilityType: bill.meter?.utilityType?.name || 'Unknown',
                billingPeriodStart: bill.billingPeriodStart,
                billingPeriodEnd: bill.billingPeriodEnd,
                billDate: bill.billDate,
                dueDate: bill.dueDate,
                totalAmount: bill.getTotalAmount(),
                paidAmount: bill.getTotalPaid(),
                outstandingAmount: bill.getOutstandingBalance(),
                status,
                isPaid,
                isOverdue,
            };
        });
        if (options.status) {
            billsFormatted = billsFormatted.filter((b) => b.status === options.status);
        }
        return {
            bills: billsFormatted,
            total,
            page: options.page,
            limit: options.limit,
            totalPages: Math.ceil(total / options.limit),
        };
    }
    async getBillDetails(customerId, billId) {
        const connections = await this.connectionRepository.find({
            where: { customerId },
            select: ['meterId'],
        });
        const meterIds = connections.filter((c) => c.meterId).map((c) => c.meterId);
        const bill = await this.billRepository.findOne({
            where: { billId },
            relations: ['meter', 'meter.utilityType', 'billDetails', 'billTaxes', 'payments'],
        });
        if (!bill) {
            throw new common_1.NotFoundException('Bill not found');
        }
        if (!meterIds.includes(bill.meterId)) {
            throw new common_1.ForbiddenException('You do not have access to this bill');
        }
        const now = new Date();
        const isPaid = bill.isPaid();
        const isOverdue = bill.isOverdue(now);
        let status = 'UNPAID';
        if (isPaid)
            status = 'PAID';
        else if (isOverdue)
            status = 'OVERDUE';
        else if (bill.getTotalPaid() > 0)
            status = 'PARTIAL';
        return {
            billId: bill.billId,
            billNumber: `BILL-${bill.billId.toString().padStart(6, '0')}`,
            meterSerialNo: bill.meter?.meterSerialNo || 'Unknown',
            utilityType: bill.meter?.utilityType?.name || 'Unknown',
            billingPeriodStart: bill.billingPeriodStart,
            billingPeriodEnd: bill.billingPeriodEnd,
            billDate: bill.billDate,
            dueDate: bill.dueDate,
            totalImportUnit: Number(bill.totalImportUnit),
            totalExportUnit: Number(bill.totalExportUnit),
            energyChargeAmount: Number(bill.energyChargeAmount),
            fixedChargeAmount: Number(bill.fixedChargeAmount),
            subsidyAmount: Number(bill.subsidyAmount),
            solarExportCredit: Number(bill.solarExportCredit),
            taxAmount: bill.getTaxAmount(),
            totalAmount: bill.getTotalAmount(),
            paidAmount: bill.getTotalPaid(),
            outstandingAmount: bill.getOutstandingBalance(),
            status,
            isPaid,
            isOverdue,
            daysOverdue: bill.getDaysOverdue(now),
            details: bill.billDetails?.map((d) => ({
                slabId: d.slabId,
                unitsInSlab: Number(d.unitsInSlab),
                amount: Number(d.amount),
            })) || [],
            taxes: bill.billTaxes?.map((t) => ({
                taxId: t.taxId,
                amount: t.getTaxAmount(),
            })) || [],
            payments: bill.payments?.map((p) => ({
                paymentId: p.paymentId,
                paymentDate: p.paymentDate,
                amount: Number(p.paymentAmount),
                method: p.paymentMethod,
            })) || [],
        };
    }
    async getRecentPayments(customerId, limit) {
        const connections = await this.connectionRepository.find({
            where: { customerId },
            select: ['meterId'],
        });
        const meterIds = connections.filter((c) => c.meterId).map((c) => c.meterId);
        if (meterIds.length === 0) {
            return [];
        }
        const bills = await this.billRepository.find({
            where: { meterId: (0, typeorm_2.In)(meterIds) },
            select: ['billId'],
        });
        const billIds = bills.map((b) => b.billId);
        if (billIds.length === 0) {
            return [];
        }
        const payments = await this.paymentRepository.find({
            where: { billId: (0, typeorm_2.In)(billIds) },
            order: { paymentDate: 'DESC' },
            take: limit,
            relations: ['bill'],
        });
        return payments.map((p) => ({
            paymentId: p.paymentId,
            paymentDate: p.paymentDate,
            amount: Number(p.paymentAmount),
            method: p.paymentMethod,
            receiptNumber: p.transactionRef || `RCP-${p.paymentId.toString().padStart(6, '0')}`,
            billNumber: `BILL-${p.billId.toString().padStart(6, '0')}`,
        }));
    }
    async getPaymentHistory(customerId, options) {
        const connections = await this.connectionRepository.find({
            where: { customerId },
            select: ['meterId'],
        });
        const meterIds = connections.filter((c) => c.meterId).map((c) => c.meterId);
        if (meterIds.length === 0) {
            return { payments: [], total: 0, page: options.page, limit: options.limit, totalPages: 0 };
        }
        const bills = await this.billRepository.find({
            where: { meterId: (0, typeorm_2.In)(meterIds) },
            select: ['billId'],
        });
        const billIds = bills.map((b) => b.billId);
        if (billIds.length === 0) {
            return { payments: [], total: 0, page: options.page, limit: options.limit, totalPages: 0 };
        }
        const skip = (options.page - 1) * options.limit;
        const [payments, total] = await this.paymentRepository.findAndCount({
            where: { billId: (0, typeorm_2.In)(billIds) },
            order: { paymentDate: 'DESC' },
            skip,
            take: options.limit,
            relations: ['bill'],
        });
        return {
            payments: payments.map((p) => ({
                paymentId: p.paymentId,
                paymentDate: p.paymentDate,
                amount: Number(p.paymentAmount),
                method: p.paymentMethod,
                channel: p.paymentChannel,
                status: p.paymentStatus,
                receiptNumber: p.transactionRef || `RCP-${p.paymentId.toString().padStart(6, '0')}`,
                billNumber: `BILL-${p.billId.toString().padStart(6, '0')}`,
            })),
            total,
            page: options.page,
            limit: options.limit,
            totalPages: Math.ceil(total / options.limit),
        };
    }
    async getPaymentReceipt(customerId, paymentId) {
        const connections = await this.connectionRepository.find({
            where: { customerId },
            select: ['meterId'],
        });
        const meterIds = connections.filter((c) => c.meterId).map((c) => c.meterId);
        const bills = await this.billRepository.find({
            where: { meterId: (0, typeorm_2.In)(meterIds) },
            select: ['billId'],
        });
        const billIds = bills.map((b) => b.billId);
        const payment = await this.paymentRepository.findOne({
            where: { paymentId },
            relations: ['bill', 'bill.meter', 'bill.meter.utilityType', 'bill.payments', 'bill.billTaxes'],
        });
        if (!payment) {
            throw new common_1.NotFoundException('Payment not found');
        }
        if (!billIds.includes(payment.billId)) {
            throw new common_1.ForbiddenException('You do not have access to this payment');
        }
        const customer = await this.customerRepository.findOne({
            where: { customerId },
            relations: ['address'],
        });
        return {
            receiptNumber: payment.transactionRef || `RCP-${payment.paymentId.toString().padStart(6, '0')}`,
            paymentId: payment.paymentId,
            paymentDate: payment.paymentDate,
            amount: Number(payment.paymentAmount),
            method: payment.paymentMethod,
            channel: payment.paymentChannel,
            status: payment.paymentStatus,
            bill: {
                billId: payment.billId,
                billNumber: `BILL-${payment.billId.toString().padStart(6, '0')}`,
                utilityType: payment.bill?.meter?.utilityType?.name || 'Unknown',
                meterSerialNo: payment.bill?.meter?.meterSerialNo || 'Unknown',
                totalAmount: payment.bill?.getTotalAmount() || 0,
            },
            customer: {
                customerId: customer?.customerId,
                name: customer?.fullName,
                email: customer?.email,
                address: customer?.address?.line1,
            },
        };
    }
    async getConnections(customerId) {
        const connections = await this.connectionRepository.find({
            where: { customerId },
            relations: ['utilityType', 'meter', 'connectionAddress'],
        });
        return connections.map((c) => ({
            connectionId: c.connectionId,
            utilityType: {
                id: c.utilityType?.utilityTypeId,
                name: c.utilityType?.name,
                code: c.utilityType?.code,
            },
            status: c.connectionStatus,
            meter: c.meter
                ? {
                    meterId: c.meter.meterId,
                    meterSerialNo: c.meter.meterSerialNo,
                    status: c.meter.status,
                    installationDate: c.meter.installationDate,
                }
                : null,
            address: c.connectionAddress
                ? {
                    line1: c.connectionAddress.line1,
                    postalCode: c.connectionAddress.postalCode,
                }
                : null,
        }));
    }
    async getConsumptionHistory(customerId, connectionId, months) {
        const connection = await this.connectionRepository.findOne({
            where: { connectionId, customerId },
            relations: ['meter'],
        });
        if (!connection) {
            throw new common_1.ForbiddenException('You do not have access to this connection');
        }
        if (!connection.meterId) {
            return { history: [], averageConsumption: 0 };
        }
        const startDate = new Date();
        startDate.setMonth(startDate.getMonth() - months);
        const readings = await this.readingRepository.find({
            where: {
                meterId: connection.meterId,
            },
            order: { readingDate: 'DESC' },
            take: months + 1,
        });
        const history = [];
        for (let i = 0; i < readings.length - 1; i++) {
            const current = readings[i];
            const previous = readings[i + 1];
            const consumption = Number(current.importReading || 0) - Number(previous.importReading || 0);
            history.push({
                readingId: current.readingId,
                readingDate: current.readingDate,
                currentReading: Number(current.importReading || 0),
                previousReading: Number(previous.importReading || 0),
                consumption: consumption > 0 ? consumption : 0,
                readingSource: current.readingSource,
            });
        }
        const totalConsumption = history.reduce((sum, h) => sum + h.consumption, 0);
        const averageConsumption = history.length > 0 ? totalConsumption / history.length : 0;
        return {
            connectionId,
            meterSerialNo: connection.meter?.meterSerialNo,
            history,
            averageConsumption: Math.round(averageConsumption * 100) / 100,
            totalConsumption,
        };
    }
};
exports.CustomerPortalService = CustomerPortalService;
exports.CustomerPortalService = CustomerPortalService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(customer_entity_1.Customer)),
    __param(1, (0, typeorm_1.InjectRepository)(bill_entity_1.Bill)),
    __param(2, (0, typeorm_1.InjectRepository)(payment_entity_1.Payment)),
    __param(3, (0, typeorm_1.InjectRepository)(service_connection_entity_1.ServiceConnection)),
    __param(4, (0, typeorm_1.InjectRepository)(meter_reading_entity_1.MeterReading)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], CustomerPortalService);
//# sourceMappingURL=customer-portal.service.js.map