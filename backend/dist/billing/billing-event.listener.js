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
var BillingEventListener_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.BillingEventListener = void 0;
const common_1 = require("@nestjs/common");
const event_emitter_1 = require("@nestjs/event-emitter");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const events_1 = require("../readings/events");
const billing_service_1 = require("./billing.service");
const entities_1 = require("../database/entities");
const service_connection_entity_1 = require("../database/entities/service-connection.entity");
let BillingEventListener = BillingEventListener_1 = class BillingEventListener {
    constructor(billingService, readingRepository, billRepository, connectionRepository) {
        this.billingService = billingService;
        this.readingRepository = readingRepository;
        this.billRepository = billRepository;
        this.connectionRepository = connectionRepository;
        this.logger = new common_1.Logger(BillingEventListener_1.name);
    }
    async handleMeterReadingCreated(event) {
        const { reading, options } = event;
        this.logger.log(`📨 Event received: meter-reading.created for meter ${reading.meterId}, reading ID ${reading.readingId}`);
        if (options?.autoGenerateBill === false) {
            this.logger.log(`⏭️ Auto-bill generation disabled for meter ${reading.meterId}`);
            return;
        }
        try {
            const connection = await this.connectionRepository.findOne({
                where: {
                    meterId: reading.meterId,
                    connectionStatus: service_connection_entity_1.ConnectionStatus.ACTIVE,
                },
                relations: ['tariffCategory'],
            });
            if (!connection) {
                this.logger.warn(`⚠️ No active connection found for meter ${reading.meterId}. Skipping bill generation.`);
                return;
            }
            if (!connection.tariffCategory) {
                this.logger.warn(`⚠️ No tariff category assigned to meter ${reading.meterId}. Skipping bill generation.`);
                return;
            }
            const allReadings = await this.readingRepository.find({
                where: { meterId: reading.meterId },
                order: { readingDate: 'DESC' },
                take: 2,
            });
            const previousReading = allReadings.length > 1 ? allReadings[1] : null;
            let periodStart;
            if (previousReading) {
                periodStart = new Date(previousReading.readingDate);
                this.logger.debug(`✓ Previous reading found (ID: ${previousReading.readingId}, Date: ${previousReading.readingDate.toISOString()})`);
            }
            else {
                periodStart = new Date(reading.readingDate);
                periodStart.setDate(periodStart.getDate() - 30);
                this.logger.debug(`✓ First reading for meter ${reading.meterId}. Using ${periodStart.toISOString()} as period start.`);
            }
            const periodEnd = new Date(reading.readingDate);
            const existingBill = await this.billRepository.findOne({
                where: {
                    meterId: reading.meterId,
                    billingPeriodEnd: periodEnd,
                },
            });
            if (existingBill) {
                this.logger.warn(`⚠️ Bill already exists for meter ${reading.meterId} with end date ${periodEnd.toISOString()} (Bill ID: ${existingBill.billId}). Skipping duplicate generation.`);
                return;
            }
            const minDays = options?.minDaysBetweenBills ?? 25;
            const daysBetween = Math.ceil((periodEnd.getTime() - periodStart.getTime()) / (1000 * 60 * 60 * 24));
            if (daysBetween < minDays) {
                this.logger.log(`⏳ Only ${daysBetween} days between readings for meter ${reading.meterId}. Minimum required: ${minDays} days. Skipping bill generation.`);
                return;
            }
            const readingsInPeriod = await this.readingRepository
                .createQueryBuilder('reading')
                .where('reading.meterId = :meterId', { meterId: reading.meterId })
                .andWhere('reading.readingDate >= :periodStart', { periodStart })
                .andWhere('reading.readingDate <= :periodEnd', { periodEnd })
                .getCount();
            if (readingsInPeriod < 2) {
                this.logger.log(`⏳ Insufficient readings for meter ${reading.meterId}. Found ${readingsInPeriod}, need at least 2. Skipping bill generation.`);
                return;
            }
            this.logger.log(`🔧 Generating bill for meter ${reading.meterId}, period: ${periodStart.toISOString()} to ${periodEnd.toISOString()}`);
            const bill = await this.billingService.create(reading.meterId, periodStart, periodEnd);
            const dueDays = options?.dueDaysFromBillDate ?? 15;
            if (dueDays !== 15 && bill) {
                bill.dueDate = new Date(bill.billDate);
                bill.dueDate.setDate(bill.dueDate.getDate() + dueDays);
                await this.billRepository.save(bill);
            }
            this.logger.log(`✅ AUTO-BILL GENERATED via Event: Bill #${bill.billId} for meter ${reading.meterId}, Amount: Rs ${bill.getTotalAmount().toFixed(2)}`);
            this.logger.log(`   Reading ID: ${reading.readingId}, Period: ${periodStart.toISOString()} to ${periodEnd.toISOString()}`);
        }
        catch (error) {
            this.logger.error(`❌ Failed to auto-generate bill for meter ${reading.meterId} after reading ${reading.readingId}`);
            this.logger.error(`   Error: ${error.message}`);
            this.logger.error(error.stack);
        }
    }
};
exports.BillingEventListener = BillingEventListener;
__decorate([
    (0, event_emitter_1.OnEvent)('meter-reading.created', { async: true }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [events_1.MeterReadingCreatedEvent]),
    __metadata("design:returntype", Promise)
], BillingEventListener.prototype, "handleMeterReadingCreated", null);
exports.BillingEventListener = BillingEventListener = BillingEventListener_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, typeorm_1.InjectRepository)(entities_1.MeterReading)),
    __param(2, (0, typeorm_1.InjectRepository)(entities_1.Bill)),
    __param(3, (0, typeorm_1.InjectRepository)(entities_1.ServiceConnection)),
    __metadata("design:paramtypes", [billing_service_1.BillingService,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], BillingEventListener);
//# sourceMappingURL=billing-event.listener.js.map