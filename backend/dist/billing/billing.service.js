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
var BillingService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.BillingService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const entities_1 = require("../database/entities");
const tax_config_entity_1 = require("../database/entities/tax-config.entity");
const service_connection_entity_1 = require("../database/entities/service-connection.entity");
let BillingService = BillingService_1 = class BillingService {
    constructor(meterRepository, readingRepository, billRepository, billDetailRepository, billTaxRepository, tariffSlabRepository, taxConfigRepository, connectionRepository, customerRepository) {
        this.meterRepository = meterRepository;
        this.readingRepository = readingRepository;
        this.billRepository = billRepository;
        this.billDetailRepository = billDetailRepository;
        this.billTaxRepository = billTaxRepository;
        this.tariffSlabRepository = tariffSlabRepository;
        this.taxConfigRepository = taxConfigRepository;
        this.connectionRepository = connectionRepository;
        this.customerRepository = customerRepository;
        this.logger = new common_1.Logger(BillingService_1.name);
    }
    async calculateBill(meterId, periodStart, periodEnd) {
        this.logger.log(`Calculating bill for meter ${meterId}, period: ${periodStart.toISOString()} to ${periodEnd.toISOString()}`);
        const meter = await this.meterRepository.findOne({
            where: { meterId },
            relations: ['utilityType'],
        });
        if (!meter) {
            throw new common_1.NotFoundException(`Meter with ID ${meterId} not found`);
        }
        const connection = await this.connectionRepository.findOne({
            where: { meterId },
            relations: ['customer', 'tariffCategory'],
        });
        if (!connection) {
            throw new common_1.NotFoundException(`No service connection found for meter ${meterId}`);
        }
        if (!connection.tariffCategory) {
            throw new common_1.BadRequestException(`Tariff category not configured for meter ${meterId}`);
        }
        const readings = await this.readingRepository.find({
            where: {
                meterId,
                readingDate: (0, typeorm_2.Between)(periodStart, periodEnd),
            },
            order: {
                readingDate: 'ASC',
            },
        });
        if (readings.length < 2) {
            throw new common_1.BadRequestException(`Insufficient readings for meter ${meterId} in the specified period. At least 2 readings required.`);
        }
        const firstReading = readings[0];
        const lastReading = readings[readings.length - 1];
        const consumption = (lastReading.importReading || 0) - (firstReading.importReading || 0);
        const exportUnits = (lastReading.exportReading || 0) - (firstReading.exportReading || 0);
        if (consumption < 0) {
            throw new common_1.BadRequestException(`Invalid readings detected for meter ${meterId}. ` +
                `Last reading (${lastReading.importReading}) is less than first reading (${firstReading.importReading})`);
        }
        this.logger.debug(`Consumption: ${consumption} units, Export: ${exportUnits} units`);
        const billDate = new Date();
        const slabResult = await this.applyTariffSlabs(consumption, connection.tariffCategoryId, billDate);
        const subtotal = slabResult.energyCharge + slabResult.fixedCharge;
        this.logger.debug(`Energy charge: ${slabResult.energyCharge}, Fixed charge: ${slabResult.fixedCharge}, Subtotal: ${subtotal}`);
        const subsidy = await this.calculateSubsidy(connection.customerId, subtotal, billDate);
        const solarCredit = await this.calculateSolarCredit(exportUnits, meter.utilityTypeId, billDate);
        const beforeTax = Math.max(0, subtotal - subsidy - solarCredit);
        this.logger.debug(`Subsidy: ${subsidy}, Solar credit: ${solarCredit}, Before tax: ${beforeTax}`);
        const taxes = await this.calculateTaxes(beforeTax, billDate);
        const totalTax = taxes.reduce((sum, tax) => sum + tax.amount, 0);
        const totalAmount = this.roundAmount(beforeTax + totalTax);
        this.logger.log(`Bill calculation completed for meter ${meterId}. Total: ${totalAmount}`);
        return {
            startReading: this.roundAmount(firstReading.importReading || 0),
            endReading: this.roundAmount(lastReading.importReading || 0),
            consumption: this.roundAmount(consumption),
            slabBreakdown: slabResult.slabs,
            energyCharge: this.roundAmount(slabResult.energyCharge),
            fixedCharge: this.roundAmount(slabResult.fixedCharge),
            subtotal: this.roundAmount(subtotal),
            subsidy: this.roundAmount(subsidy),
            solarCredit: this.roundAmount(solarCredit),
            beforeTax: this.roundAmount(beforeTax),
            taxes,
            totalAmount,
        };
    }
    async applyTariffSlabs(consumption, tariffCategoryId, billDate) {
        this.logger.debug(`Applying tariff slabs for category ${tariffCategoryId}, consumption: ${consumption}`);
        const slabs = await this.tariffSlabRepository.find({
            where: {
                tariffCategoryId,
            },
            order: {
                fromUnit: 'ASC',
            },
        });
        if (slabs.length === 0) {
            throw new common_1.BadRequestException(`No tariff slabs found for tariff category ${tariffCategoryId}`);
        }
        const validSlabs = slabs.filter((slab) => slab.isValid(billDate));
        if (validSlabs.length === 0) {
            throw new common_1.BadRequestException(`No valid tariff slabs found for tariff category ${tariffCategoryId} on ${billDate.toDateString()}`);
        }
        const breakdown = [];
        let totalEnergyCharge = 0;
        let accumulatedUnits = 0;
        const fixedCharge = validSlabs[0].fixedCharge;
        for (let i = 0; i < validSlabs.length; i++) {
            const slab = validSlabs[i];
            if (consumption <= slab.fromUnit) {
                break;
            }
            let unitsInSlab = 0;
            if (slab.toUnit === null) {
                unitsInSlab = consumption - slab.fromUnit;
            }
            else if (consumption > slab.toUnit) {
                unitsInSlab = slab.toUnit - slab.fromUnit;
            }
            else {
                unitsInSlab = consumption - slab.fromUnit;
            }
            const amount = unitsInSlab * slab.ratePerUnit;
            totalEnergyCharge += amount;
            accumulatedUnits += unitsInSlab;
            breakdown.push({
                from: slab.fromUnit,
                to: slab.toUnit,
                units: this.roundAmount(unitsInSlab),
                rate: slab.ratePerUnit,
                amount: this.roundAmount(amount),
            });
            this.logger.debug(`Slab ${i + 1}: ${slab.fromUnit}-${slab.toUnit || '∞'} units, ` +
                `${unitsInSlab} units @ ${slab.ratePerUnit} = ${amount}`);
            if (accumulatedUnits >= consumption) {
                break;
            }
        }
        return {
            slabs: breakdown,
            energyCharge: totalEnergyCharge,
            fixedCharge,
        };
    }
    async calculateSubsidy(customerId, billAmount, _billDate) {
        this.logger.debug(`Calculating subsidy for customer ${customerId}, bill amount: ${billAmount}`);
        void _billDate;
        const subsidy = 0;
        this.logger.debug(`Subsidy calculated: ${subsidy}`);
        return subsidy;
    }
    async calculateSolarCredit(exportUnits, _utilityTypeId, _billDate) {
        this.logger.debug(`Calculating solar credit for ${exportUnits} export units`);
        void _utilityTypeId;
        void _billDate;
        if (exportUnits <= 0) {
            return 0;
        }
        const exportRate = 5.0;
        const credit = exportUnits * exportRate;
        this.logger.debug(`Solar credit calculated: ${exportUnits} units @ ${exportRate} = ${credit}`);
        return credit;
    }
    async calculateTaxes(taxableAmount, billDate) {
        this.logger.debug(`Calculating taxes on taxable amount: ${taxableAmount}`);
        const activeTaxes = await this.taxConfigRepository.find({
            where: {
                status: tax_config_entity_1.TaxStatus.ACTIVE,
            },
        });
        const applicableTaxes = activeTaxes.filter((tax) => tax.isActive(billDate));
        if (applicableTaxes.length === 0) {
            this.logger.warn(`No active taxes found for date ${billDate.toDateString()}`);
            return [];
        }
        const taxes = [];
        for (const tax of applicableTaxes) {
            const taxAmount = (taxableAmount * tax.ratePercent) / 100;
            taxes.push({
                name: tax.taxName,
                rate: tax.ratePercent,
                amount: this.roundAmount(taxAmount),
            });
            this.logger.debug(`Tax: ${tax.taxName} @ ${tax.ratePercent}% = ${taxAmount}`);
        }
        return taxes;
    }
    roundAmount(amount) {
        return Math.round(amount * 100) / 100;
    }
    async create(meterId, periodStart, periodEnd, _employeeId) {
        void _employeeId;
        this.logger.log(`Generating bill for meter ${meterId}, period: ${periodStart} to ${periodEnd}`);
        const calculation = await this.calculateBill(meterId, periodStart, periodEnd);
        if (!calculation || calculation.totalAmount < 0) {
            throw new common_1.BadRequestException('Bill calculation failed or resulted in negative amount');
        }
        const queryRunner = this.billRepository.manager.connection.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const bill = this.billRepository.create({
                meterId,
                billingPeriodStart: periodStart,
                billingPeriodEnd: periodEnd,
                billDate: new Date(),
                dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
                totalImportUnit: calculation.consumption,
                totalExportUnit: 0,
                energyChargeAmount: calculation.energyCharge,
                fixedChargeAmount: calculation.fixedCharge,
                subsidyAmount: calculation.subsidy,
                solarExportCredit: calculation.solarCredit,
            });
            const savedBill = await queryRunner.manager.save(entities_1.Bill, bill);
            const billDetails = [];
            for (const slab of calculation.slabBreakdown) {
                const detail = this.billDetailRepository.create({
                    billId: savedBill.billId,
                    slabId: null,
                    unitsInSlab: slab.units,
                    amount: slab.amount,
                });
                billDetails.push(detail);
            }
            if (billDetails.length > 0) {
                await queryRunner.manager.save(entities_1.BillDetail, billDetails);
            }
            const billTaxes = [];
            for (const tax of calculation.taxes) {
                const taxConfig = await this.taxConfigRepository.findOne({
                    where: { taxName: tax.name, status: tax_config_entity_1.TaxStatus.ACTIVE },
                });
                if (taxConfig) {
                    const billTax = this.billTaxRepository.create({
                        billId: savedBill.billId,
                        taxId: taxConfig.taxId,
                        ratePercentApplied: tax.rate,
                        taxableBaseAmount: calculation.beforeTax,
                    });
                    billTaxes.push(billTax);
                }
            }
            if (billTaxes.length > 0) {
                await queryRunner.manager.save(entities_1.BillTax, billTaxes);
            }
            await queryRunner.commitTransaction();
            const result = await this.findOne(savedBill.billId);
            this.logger.log(`Bill ${result.billId} generated successfully for meter ${meterId}. Total: ${calculation.totalAmount}`);
            return result;
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            this.logger.error(`Failed to create bill for meter ${meterId}:`, error);
            throw error;
        }
        finally {
            await queryRunner.release();
        }
    }
    async createBulk(utilityTypeId, customerType, meterIds, periodStart, periodEnd, dryRun = false) {
        this.logger.log('Starting bulk bill generation');
        const success = [];
        const failed = [];
        const queryBuilder = this.meterRepository
            .createQueryBuilder('meter')
            .innerJoin('meter.serviceConnections', 'connection')
            .where('connection.connectionStatus = :status', { status: 'ACTIVE' });
        if (utilityTypeId) {
            queryBuilder.andWhere('meter.utilityTypeId = :utilityTypeId', { utilityTypeId });
        }
        if (meterIds && meterIds.length > 0) {
            queryBuilder.andWhere('meter.meterId IN (:...meterIds)', { meterIds });
        }
        if (customerType) {
            queryBuilder
                .innerJoin('connection.customer', 'customer')
                .andWhere('customer.customerType = :customerType', { customerType });
        }
        const meters = await queryBuilder.getMany();
        this.logger.log(`Found ${meters.length} meters for bulk billing`);
        for (const meter of meters) {
            try {
                const start = periodStart || new Date(new Date().getFullYear(), new Date().getMonth(), 1);
                const end = periodEnd || new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);
                if (dryRun) {
                    const calculation = await this.calculateBill(meter.meterId, start, end);
                    success.push({ meterId: meter.meterId, calculation });
                }
                else {
                    const bill = await this.create(meter.meterId, start, end);
                    success.push(bill);
                }
            }
            catch (error) {
                this.logger.warn(`Failed to generate bill for meter ${meter.meterId}:`, error.message);
                failed.push({
                    meterId: meter.meterId,
                    meterSerialNo: meter.meterSerialNo,
                    error: error.message,
                });
            }
        }
        this.logger.log(`Bulk billing completed: ${success.length} successful, ${failed.length} failed`);
        return { success, failed };
    }
    async findAll(filters) {
        const queryBuilder = this.billRepository
            .createQueryBuilder('bill')
            .leftJoinAndSelect('bill.meter', 'meter')
            .leftJoinAndSelect('meter.utilityType', 'utilityType')
            .leftJoin('ServiceConnection', 'connection', 'connection.meter_id = meter.meter_id')
            .leftJoin('Customer', 'customer', 'customer.customer_id = connection.customer_id')
            .leftJoinAndSelect('bill.billDetails', 'billDetails')
            .leftJoinAndSelect('bill.billTaxes', 'billTaxes');
        if (filters?.meterId) {
            queryBuilder.andWhere('bill.meter_id = :meterId', { meterId: filters.meterId });
        }
        if (filters?.customerId) {
            queryBuilder.andWhere('connection.customer_id = :customerId', {
                customerId: filters.customerId,
            });
        }
        if (filters?.connectionId) {
            queryBuilder.andWhere('connection.connection_id = :connectionId', {
                connectionId: filters.connectionId,
            });
        }
        if (filters?.search) {
            queryBuilder.andWhere('(CAST(bill.bill_id AS VARCHAR) LIKE :search OR customer.first_name LIKE :search OR customer.last_name LIKE :search OR meter.meter_serial_no LIKE :search)', { search: `%${filters.search}%` });
        }
        if (filters?.utilityTypeId) {
            queryBuilder.andWhere('meter.utility_type_id = :utilityTypeId', {
                utilityTypeId: filters.utilityTypeId,
            });
        }
        if (filters?.status) {
            this.logger.warn(`Status filter '${filters.status}' is not currently supported - returning all bills`);
        }
        if (filters?.startDate) {
            queryBuilder.andWhere('bill.bill_date >= :startDate', { startDate: filters.startDate });
        }
        if (filters?.endDate) {
            queryBuilder.andWhere('bill.bill_date <= :endDate', { endDate: filters.endDate });
        }
        const page = filters?.page || 1;
        const limit = filters?.limit || 20;
        const sortBy = filters?.sortBy || 'billDate';
        const order = filters?.order || 'DESC';
        const sortColumnMap = {
            'billDate': 'bill.billDate',
            'dueDate': 'bill.dueDate',
            'totalAmount': 'bill.totalAmount',
            'billId': 'bill.billId',
        };
        const sortColumn = sortColumnMap[sortBy] || 'bill.billDate';
        queryBuilder
            .orderBy(sortColumn, order)
            .skip((page - 1) * limit)
            .take(limit);
        const [bills, total] = await queryBuilder.getManyAndCount();
        return { bills, total };
    }
    async findOne(billId) {
        const bill = await this.billRepository.findOne({
            where: { billId },
            relations: [
                'meter',
                'meter.utilityType',
                'billDetails',
                'billDetails.tariffSlab',
                'billTaxes',
                'billTaxes.taxConfig',
            ],
        });
        if (!bill) {
            throw new common_1.NotFoundException(`Bill with ID ${billId} not found`);
        }
        return bill;
    }
    async findByMeter(meterId, options) {
        const queryBuilder = this.billRepository
            .createQueryBuilder('bill')
            .leftJoinAndSelect('bill.billDetails', 'billDetails')
            .leftJoinAndSelect('bill.billTaxes', 'billTaxes')
            .where('bill.meterId = :meterId', { meterId });
        if (options?.startDate) {
            queryBuilder.andWhere('bill.billDate >= :startDate', { startDate: options.startDate });
        }
        if (options?.endDate) {
            queryBuilder.andWhere('bill.billDate <= :endDate', { endDate: options.endDate });
        }
        queryBuilder.orderBy('bill.billDate', 'DESC');
        if (options?.limit) {
            queryBuilder.take(options.limit);
        }
        return queryBuilder.getMany();
    }
    async findByCustomer(customerId) {
        const connections = await this.connectionRepository.find({
            where: { customerId },
            relations: ['meter'],
        });
        if (connections.length === 0) {
            return [];
        }
        const meterIds = connections.map((conn) => conn.meterId).filter((id) => id !== null);
        if (meterIds.length === 0) {
            return [];
        }
        const bills = await this.billRepository
            .createQueryBuilder('bill')
            .leftJoinAndSelect('bill.meter', 'meter')
            .leftJoinAndSelect('bill.billDetails', 'billDetails')
            .leftJoinAndSelect('bill.billTaxes', 'billTaxes')
            .where('bill.meterId IN (:...meterIds)', { meterIds })
            .orderBy('bill.billDate', 'DESC')
            .getMany();
        return bills;
    }
    async update(billId, updates, employeeId) {
        const bill = await this.findOne(billId);
        if (updates.dueDate) {
            bill.dueDate = updates.dueDate;
        }
        if (updates.subsidyAmount !== undefined) {
            bill.subsidyAmount = updates.subsidyAmount;
        }
        if (updates.solarExportCredit !== undefined) {
            bill.solarExportCredit = updates.solarExportCredit;
        }
        this.logger.log(`Bill ${billId} updated by employee ${employeeId || 'system'}. Changes: ${JSON.stringify(updates)}`);
        return this.billRepository.save(bill);
    }
    async recalculate(billId) {
        this.logger.log(`Recalculating bill ${billId}`);
        const bill = await this.findOne(billId);
        const calculation = await this.calculateBill(bill.meterId, bill.billingPeriodStart, bill.billingPeriodEnd);
        const queryRunner = this.billRepository.manager.connection.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            bill.totalImportUnit = calculation.consumption;
            bill.energyChargeAmount = calculation.energyCharge;
            bill.fixedChargeAmount = calculation.fixedCharge;
            bill.subsidyAmount = calculation.subsidy;
            bill.solarExportCredit = calculation.solarCredit;
            await queryRunner.manager.save(entities_1.Bill, bill);
            await queryRunner.manager.delete(entities_1.BillDetail, { billId });
            await queryRunner.manager.delete(entities_1.BillTax, { billId });
            const billDetails = [];
            for (const slab of calculation.slabBreakdown) {
                const detail = this.billDetailRepository.create({
                    billId: bill.billId,
                    slabId: null,
                    unitsInSlab: slab.units,
                    amount: slab.amount,
                });
                billDetails.push(detail);
            }
            if (billDetails.length > 0) {
                await queryRunner.manager.save(entities_1.BillDetail, billDetails);
            }
            const billTaxes = [];
            for (const tax of calculation.taxes) {
                const taxConfig = await this.taxConfigRepository.findOne({
                    where: { taxName: tax.name, status: tax_config_entity_1.TaxStatus.ACTIVE },
                });
                if (taxConfig) {
                    const billTax = this.billTaxRepository.create({
                        billId: bill.billId,
                        taxId: taxConfig.taxId,
                        ratePercentApplied: tax.rate,
                        taxableBaseAmount: calculation.beforeTax,
                    });
                    billTaxes.push(billTax);
                }
            }
            if (billTaxes.length > 0) {
                await queryRunner.manager.save(entities_1.BillTax, billTaxes);
            }
            await queryRunner.commitTransaction();
            const result = await this.findOne(bill.billId);
            this.logger.log(`Bill ${billId} recalculated successfully. New total: ${calculation.totalAmount}`);
            return result;
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            this.logger.error(`Failed to recalculate bill ${billId}:`, error);
            throw error;
        }
        finally {
            await queryRunner.release();
        }
    }
    async getSummary(filters) {
        const queryBuilder = this.billRepository
            .createQueryBuilder('bill')
            .leftJoin('bill.meter', 'meter')
            .leftJoin('ServiceConnection', 'connection', 'connection.meter_id = meter.meter_id');
        if (filters?.customerId) {
            queryBuilder.andWhere('connection.customerId = :customerId', {
                customerId: filters.customerId,
            });
        }
        if (filters?.utilityTypeId) {
            queryBuilder.andWhere('meter.utilityTypeId = :utilityTypeId', {
                utilityTypeId: filters.utilityTypeId,
            });
        }
        if (filters?.startDate) {
            queryBuilder.andWhere('bill.billDate >= :startDate', { startDate: filters.startDate });
        }
        if (filters?.endDate) {
            queryBuilder.andWhere('bill.billDate <= :endDate', { endDate: filters.endDate });
        }
        const result = await queryBuilder
            .select('COUNT(DISTINCT bill.billId)', 'totalBills')
            .addSelect('SUM(bill.energyChargeAmount + bill.fixedChargeAmount - bill.subsidyAmount - bill.solarExportCredit)', 'totalAmount')
            .addSelect('SUM(payments.paymentAmount)', 'paidAmount')
            .getRawOne();
        const totalBills = parseInt(result.totalBills) || 0;
        const totalAmount = parseFloat(result.totalAmount) || 0;
        const paidAmount = parseFloat(result.paidAmount) || 0;
        const outstanding = totalAmount - paidAmount;
        const overdueQuery = this.billRepository
            .createQueryBuilder('bill')
            .leftJoin('bill.meter', 'meter')
            .leftJoin('ServiceConnection', 'connection', 'connection.meter_id = meter.meter_id')
            .where('bill.dueDate < :today', { today: new Date() })
            .andWhere('(bill.paidAmount IS NULL OR bill.paidAmount < bill.totalAmount)');
        if (filters?.customerId) {
            overdueQuery.andWhere('connection.customerId = :customerId', {
                customerId: filters.customerId,
            });
        }
        if (filters?.utilityTypeId) {
            overdueQuery.andWhere('meter.utilityTypeId = :utilityTypeId', {
                utilityTypeId: filters.utilityTypeId,
            });
        }
        const overdueResult = await overdueQuery
            .select('COUNT(DISTINCT bill.billId)', 'overdueBills')
            .addSelect('SUM(bill.totalAmount - COALESCE(bill.paidAmount, 0))', 'overdueAmount')
            .getRawOne();
        const overdueBills = parseInt(overdueResult.overdueBills) || 0;
        const overdueAmount = parseFloat(overdueResult.overdueAmount) || 0;
        return {
            totalBills,
            totalAmount: this.roundAmount(totalAmount),
            paidAmount: this.roundAmount(paidAmount),
            outstanding: this.roundAmount(outstanding),
            overdueBills,
            overdueAmount: this.roundAmount(overdueAmount),
        };
    }
    async void(billId, reason, employeeId) {
        const bill = await this.findOne(billId);
        const paymentSum = await this.billRepository.manager
            .createQueryBuilder()
            .select('COALESCE(SUM(p.payment_amount), 0)', 'totalPaid')
            .from('Payment', 'p')
            .where('p.bill_id = :billId', { billId })
            .getRawOne();
        const totalPaid = parseFloat(paymentSum?.totalPaid) || 0;
        if (totalPaid > 0) {
            throw new common_1.BadRequestException(`Cannot void bill ${billId}. Bill has payments totaling ${totalPaid}`);
        }
        bill.dueDate = new Date('2099-12-31');
        bill.energyChargeAmount = 0;
        bill.fixedChargeAmount = 0;
        bill.subsidyAmount = 0;
        bill.solarExportCredit = 0;
        await this.billRepository.save(bill);
        this.logger.warn(`Bill ${billId} voided by employee ${employeeId}. Reason: ${reason}`);
    }
    async generateBillFromReading(meterId, readingDate, options) {
        const minDays = options?.minDaysBetweenBills ?? 25;
        const dueDays = options?.dueDaysFromBillDate ?? 15;
        this.logger.log(`🔍 Checking auto-bill generation for meter ${meterId} with reading date ${readingDate.toISOString()}`);
        this.logger.log(`   Settings: minDays=${minDays}, dueDays=${dueDays}`);
        try {
            const meter = await this.meterRepository.findOne({
                where: { meterId },
                relations: ['utilityType'],
            });
            if (!meter) {
                this.logger.warn(`❌ Auto-bill: Meter ${meterId} not found`);
                return null;
            }
            this.logger.log(`✓ Step 1: Meter ${meterId} found - ${meter.meterSerialNo}`);
            const connection = await this.connectionRepository.findOne({
                where: { meterId, connectionStatus: service_connection_entity_1.ConnectionStatus.ACTIVE },
                relations: ['tariffCategory'],
            });
            if (!connection) {
                this.logger.warn(`❌ Auto-bill: No active connection for meter ${meterId}. Check service_connection table.`);
                return null;
            }
            this.logger.log(`✓ Step 2: Active connection found - ID ${connection.connectionId}, Status: ${connection.connectionStatus}`);
            if (!connection.tariffCategory) {
                this.logger.warn(`❌ Auto-bill: No tariff category for meter ${meterId}. Assign a tariff category to the connection.`);
                return null;
            }
            this.logger.log(`✓ Step 3: Tariff category assigned - ${connection.tariffCategory.name}`);
            const lastBill = await this.billRepository.findOne({
                where: { meterId },
                order: { billingPeriodEnd: 'DESC' },
            });
            let periodStart;
            if (lastBill) {
                periodStart = new Date(lastBill.billingPeriodEnd);
                const daysSinceLastBill = Math.ceil((readingDate.getTime() - lastBill.billingPeriodEnd.getTime()) / (1000 * 60 * 60 * 24));
                this.logger.log(`✓ Step 4: Last bill found - ID ${lastBill.billId}, ended ${lastBill.billingPeriodEnd.toISOString()}`);
                this.logger.log(`   Days since last bill: ${daysSinceLastBill} (minimum required: ${minDays})`);
                if (daysSinceLastBill < minDays) {
                    this.logger.warn(`❌ Auto-bill: Only ${daysSinceLastBill} days since last bill. Minimum is ${minDays} days.`);
                    return null;
                }
            }
            else {
                this.logger.log(`✓ Step 4: No previous bill found - this will be the first bill`);
                const firstReading = await this.readingRepository.findOne({
                    where: { meterId },
                    order: { readingDate: 'ASC' },
                });
                if (!firstReading) {
                    this.logger.warn(`❌ Auto-bill: No readings found for meter ${meterId}`);
                    return null;
                }
                periodStart = new Date(firstReading.readingDate);
                this.logger.log(`   First reading date: ${periodStart.toISOString()}`);
            }
            this.logger.log(`🔍 Checking readings between ${periodStart.toISOString()} and ${readingDate.toISOString()}`);
            const readings = await this.readingRepository
                .createQueryBuilder('reading')
                .where('reading.meterId = :meterId', { meterId })
                .andWhere('reading.readingDate >= :periodStart', { periodStart })
                .andWhere('reading.readingDate <= :readingDate', { readingDate })
                .orderBy('reading.readingDate', 'ASC')
                .getMany();
            this.logger.log(`   Found ${readings.length} readings in billing period`);
            if (readings.length < 2) {
                this.logger.warn(`❌ Auto-bill: Insufficient readings for meter ${meterId}. Found ${readings.length}, need at least 2.`);
                return null;
            }
            this.logger.log(`✓ Step 5: Sufficient readings available (${readings.length} readings)`);
            this.logger.log(`🔧 Generating bill for meter ${meterId}, period: ${periodStart.toISOString()} to ${readingDate.toISOString()}`);
            const bill = await this.create(meterId, periodStart, readingDate);
            if (dueDays !== 15) {
                bill.dueDate = new Date(bill.billDate);
                bill.dueDate.setDate(bill.dueDate.getDate() + dueDays);
                await this.billRepository.save(bill);
            }
            this.logger.log(`✅ AUTO-BILL GENERATED: Bill #${bill.billId} for meter ${meterId}, Amount: ${bill.getTotalAmount().toFixed(2)}`);
            return bill;
        }
        catch (error) {
            this.logger.error(`❌ Auto-bill generation FAILED for meter ${meterId}: ${error.message}`);
            this.logger.error(error.stack);
            return null;
        }
    }
    async checkBillingEligibility(meterId) {
        try {
            const meter = await this.meterRepository.findOne({
                where: { meterId },
                relations: ['utilityType'],
            });
            if (!meter) {
                return { eligible: false, reason: 'Meter not found' };
            }
            const connection = await this.connectionRepository.findOne({
                where: { meterId, connectionStatus: service_connection_entity_1.ConnectionStatus.ACTIVE },
                relations: ['tariffCategory'],
            });
            if (!connection) {
                return { eligible: false, reason: 'No active service connection' };
            }
            if (!connection.tariffCategory) {
                return { eligible: false, reason: 'No tariff category assigned' };
            }
            const lastBill = await this.billRepository.findOne({
                where: { meterId },
                order: { billingPeriodEnd: 'DESC' },
            });
            let suggestedPeriodStart;
            if (lastBill) {
                suggestedPeriodStart = new Date(lastBill.billingPeriodEnd);
                suggestedPeriodStart.setDate(suggestedPeriodStart.getDate() + 1);
            }
            else {
                const firstReading = await this.readingRepository.findOne({
                    where: { meterId },
                    order: { readingDate: 'ASC' },
                });
                if (firstReading) {
                    suggestedPeriodStart = new Date(firstReading.readingDate);
                }
            }
            const readingCount = await this.readingRepository.count({
                where: {
                    meterId,
                    ...(suggestedPeriodStart
                        ? { readingDate: (0, typeorm_2.Between)(suggestedPeriodStart, new Date()) }
                        : {}),
                },
            });
            return {
                eligible: readingCount >= 2,
                reason: readingCount >= 2
                    ? 'Ready for billing'
                    : `Need at least 2 readings (currently ${readingCount})`,
                lastBillDate: lastBill?.billingPeriodEnd,
                readingCount,
                suggestedPeriodStart,
            };
        }
        catch (error) {
            return { eligible: false, reason: error.message };
        }
    }
};
exports.BillingService = BillingService;
exports.BillingService = BillingService = BillingService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(entities_1.Meter)),
    __param(1, (0, typeorm_1.InjectRepository)(entities_1.MeterReading)),
    __param(2, (0, typeorm_1.InjectRepository)(entities_1.Bill)),
    __param(3, (0, typeorm_1.InjectRepository)(entities_1.BillDetail)),
    __param(4, (0, typeorm_1.InjectRepository)(entities_1.BillTax)),
    __param(5, (0, typeorm_1.InjectRepository)(entities_1.TariffSlab)),
    __param(6, (0, typeorm_1.InjectRepository)(entities_1.TaxConfig)),
    __param(7, (0, typeorm_1.InjectRepository)(entities_1.ServiceConnection)),
    __param(8, (0, typeorm_1.InjectRepository)(entities_1.Customer)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], BillingService);
//# sourceMappingURL=billing.service.js.map