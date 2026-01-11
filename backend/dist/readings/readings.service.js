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
var ReadingsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReadingsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const event_emitter_1 = require("@nestjs/event-emitter");
const meter_reading_entity_1 = require("../database/entities/meter-reading.entity");
const meter_entity_1 = require("../database/entities/meter.entity");
const meter_reader_entity_1 = require("../database/entities/meter-reader.entity");
const dto_1 = require("./dto");
const billing_service_1 = require("../billing/billing.service");
const events_1 = require("./events");
let ReadingsService = ReadingsService_1 = class ReadingsService {
    constructor(readingRepository, meterRepository, meterReaderRepository, dataSource, billingService, eventEmitter) {
        this.readingRepository = readingRepository;
        this.meterRepository = meterRepository;
        this.meterReaderRepository = meterReaderRepository;
        this.dataSource = dataSource;
        this.billingService = billingService;
        this.eventEmitter = eventEmitter;
        this.logger = new common_1.Logger(ReadingsService_1.name);
        this.HIGH_CONSUMPTION_MULTIPLIER = 3;
        this.LOW_CONSUMPTION_THRESHOLD = 0;
        this.DAYS_FOR_AVERAGE = 90;
    }
    async findAll(filters) {
        const { meterId, meterReaderId, readingSource, startDate, endDate, page = 1, limit = 10, sortBy = 'readingDate', order = dto_1.SortOrder.DESC, } = filters;
        const skip = (page - 1) * limit;
        const queryBuilder = this.readingRepository
            .createQueryBuilder('reading')
            .leftJoinAndSelect('reading.meter', 'meter')
            .leftJoinAndSelect('meter.utilityType', 'utilityType')
            .leftJoinAndSelect('reading.meterReader', 'meterReader')
            .leftJoinAndSelect('meterReader.employee', 'employee');
        if (meterId) {
            queryBuilder.andWhere('reading.meterId = :meterId', { meterId });
        }
        if (meterReaderId) {
            queryBuilder.andWhere('reading.meterReaderId = :meterReaderId', { meterReaderId });
        }
        if (readingSource) {
            queryBuilder.andWhere('reading.readingSource = :readingSource', { readingSource });
        }
        if (startDate) {
            queryBuilder.andWhere('reading.readingDate >= :startDate', { startDate });
        }
        if (endDate) {
            queryBuilder.andWhere('reading.readingDate <= :endDate', { endDate });
        }
        const validSortFields = ['readingId', 'readingDate', 'importReading', 'createdAt'];
        const sortField = validSortFields.includes(sortBy)
            ? `reading.${sortBy}`
            : 'reading.readingDate';
        queryBuilder.orderBy(sortField, order === dto_1.SortOrder.DESC ? 'DESC' : 'ASC');
        queryBuilder.skip(skip).take(limit);
        const [readings, total] = await queryBuilder.getManyAndCount();
        this.logger.log(`Found ${readings.length} readings out of ${total} total (page ${page})`);
        const items = readings.map((reading) => dto_1.MeterReadingResponseDto.fromEntity(reading));
        return {
            items,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
                hasNextPage: page * limit < total,
                hasPreviousPage: page > 1,
            },
        };
    }
    async findOne(id) {
        const reading = await this.readingRepository.findOne({
            where: { readingId: id },
            relations: ['meter', 'meter.utilityType', 'meterReader', 'meterReader.employee'],
        });
        if (!reading) {
            this.logger.warn(`Reading with ID ${id} not found`);
            throw new common_1.NotFoundException(`Meter reading with ID ${id} not found`);
        }
        this.logger.log(`Retrieved reading ${id} for meter ${reading.meterId}`);
        return dto_1.MeterReadingResponseDto.fromEntity(reading);
    }
    async findByMeter(meterId, options) {
        const { limit = 100, startDate, endDate } = options || {};
        const queryBuilder = this.readingRepository
            .createQueryBuilder('reading')
            .leftJoinAndSelect('reading.meter', 'meter')
            .leftJoinAndSelect('meter.utilityType', 'utilityType')
            .leftJoinAndSelect('reading.meterReader', 'meterReader')
            .leftJoinAndSelect('meterReader.employee', 'employee')
            .where('reading.meterId = :meterId', { meterId })
            .orderBy('reading.readingDate', 'DESC')
            .take(limit);
        if (startDate) {
            queryBuilder.andWhere('reading.readingDate >= :startDate', { startDate });
        }
        if (endDate) {
            queryBuilder.andWhere('reading.readingDate <= :endDate', { endDate });
        }
        const readings = await queryBuilder.getMany();
        this.logger.log(`Found ${readings.length} readings for meter ${meterId}`);
        return readings.map((reading) => dto_1.MeterReadingResponseDto.fromEntity(reading));
    }
    async getLatestReading(meterId) {
        const reading = await this.readingRepository.findOne({
            where: { meterId },
            relations: ['meter', 'meter.utilityType', 'meterReader', 'meterReader.employee'],
            order: { readingDate: 'DESC' },
        });
        if (!reading) {
            this.logger.log(`No readings found for meter ${meterId}`);
            return null;
        }
        this.logger.log(`Latest reading for meter ${meterId}: ${reading.readingId}`);
        return dto_1.MeterReadingResponseDto.fromEntity(reading);
    }
    async create(createDto, meterReaderId, options) {
        const meter = await this.meterRepository.findOne({
            where: { meterId: createDto.meterId },
        });
        if (!meter) {
            throw new common_1.NotFoundException(`Meter with ID ${createDto.meterId} not found`);
        }
        if (new Date(createDto.readingDate) > new Date()) {
            throw new common_1.BadRequestException('Reading date cannot be in the future');
        }
        const previousReading = await this.readingRepository.findOne({
            where: { meterId: createDto.meterId },
            order: { readingDate: 'DESC' },
        });
        if (previousReading) {
            const validation = await this.validateReading(createDto.meterId, createDto.importReading, new Date(createDto.readingDate));
            if (!validation.isValid) {
                throw new common_1.BadRequestException(`Reading validation failed: ${validation.errors.join(', ')}`);
            }
        }
        const reading = this.readingRepository.create({
            meterId: createDto.meterId,
            meterReaderId: meterReaderId || null,
            readingDate: new Date(createDto.readingDate),
            readingSource: createDto.readingSource,
            importReading: createDto.importReading,
            prevImportReading: previousReading?.importReading
                ? Number(previousReading.importReading)
                : null,
            exportReading: createDto.exportReading || null,
            prevExportReading: previousReading?.exportReading
                ? Number(previousReading.exportReading)
                : null,
            deviceId: createDto.deviceId || null,
            createdAt: new Date(),
        });
        const savedReading = await this.readingRepository.save(reading);
        this.logger.log(`Created reading ${savedReading.readingId} for meter ${createDto.meterId}`);
        const readingResponse = await this.findOne(savedReading.readingId);
        this.logger.log(`📤 Emitting meter-reading.created event for reading ${savedReading.readingId}`);
        this.eventEmitter.emit('meter-reading.created', new events_1.MeterReadingCreatedEvent(savedReading, options));
        const generatedBill = undefined;
        return { ...readingResponse, generatedBill };
    }
    async createBulk(bulkDto) {
        const { readings, validateAll = true } = bulkDto;
        const results = [];
        if (validateAll) {
            const validationResults = await Promise.all(readings.map(async (dto, index) => {
                const result = await this.validateReading(dto.meterId, dto.importReading, new Date(dto.readingDate));
                return { index, ...result };
            }));
            const hasErrors = validationResults.some((r) => !r.isValid);
            if (hasErrors) {
                return {
                    success: false,
                    results: validationResults.map((r) => ({
                        index: r.index,
                        error: r.errors.join(', ') || undefined,
                    })),
                };
            }
        }
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            for (let i = 0; i < readings.length; i++) {
                try {
                    const dto = readings[i];
                    const previousReading = await queryRunner.manager.findOne(meter_reading_entity_1.MeterReading, {
                        where: { meterId: dto.meterId },
                        order: { readingDate: 'DESC' },
                    });
                    const reading = queryRunner.manager.create(meter_reading_entity_1.MeterReading, {
                        meterId: dto.meterId,
                        meterReaderId: null,
                        readingDate: new Date(dto.readingDate),
                        readingSource: dto.readingSource,
                        importReading: dto.importReading,
                        prevImportReading: previousReading?.importReading
                            ? Number(previousReading.importReading)
                            : null,
                        exportReading: dto.exportReading || null,
                        prevExportReading: previousReading?.exportReading
                            ? Number(previousReading.exportReading)
                            : null,
                        deviceId: dto.deviceId || null,
                        createdAt: new Date(),
                    });
                    const savedReading = await queryRunner.manager.save(reading);
                    const responseDto = dto_1.MeterReadingResponseDto.fromEntity(savedReading);
                    results.push({ index: i, reading: responseDto });
                }
                catch (error) {
                    if (!validateAll) {
                        results.push({ index: i, error: error.message });
                    }
                    else {
                        throw error;
                    }
                }
            }
            await queryRunner.commitTransaction();
            this.logger.log(`Bulk created ${results.length} readings`);
            return { success: true, results };
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            this.logger.error(`Bulk create failed: ${error.message}`, error.stack);
            throw new common_1.BadRequestException(`Bulk create failed: ${error.message}`);
        }
        finally {
            await queryRunner.release();
        }
    }
    async update(id, updateDto) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const reading = await queryRunner.manager.findOne(meter_reading_entity_1.MeterReading, {
                where: { readingId: id },
            });
            if (!reading) {
                throw new common_1.NotFoundException(`Meter reading with ID ${id} not found`);
            }
            const originalImport = reading.importReading;
            const originalExport = reading.exportReading;
            if (updateDto.importReading !== undefined) {
                reading.importReading = updateDto.importReading;
            }
            if (updateDto.exportReading !== undefined) {
                reading.exportReading = updateDto.exportReading;
            }
            if (updateDto.readingSource !== undefined) {
                reading.readingSource = updateDto.readingSource;
            }
            if (updateDto.importReading !== undefined &&
                updateDto.importReading !== Number(originalImport)) {
                reading.readingSource = meter_reading_entity_1.ReadingSource.CORRECTED;
                this.logger.log(`Reading ${id} marked as CORRECTED. Import changed from ${originalImport} to ${updateDto.importReading}`);
            }
            if (updateDto.exportReading !== undefined &&
                updateDto.exportReading !== Number(originalExport)) {
                reading.readingSource = meter_reading_entity_1.ReadingSource.CORRECTED;
                this.logger.log(`Reading ${id} marked as CORRECTED. Export changed from ${originalExport} to ${updateDto.exportReading}`);
            }
            await queryRunner.manager.save(reading);
            await queryRunner.commitTransaction();
            this.logger.log(`Updated reading ${id}`);
            return this.findOne(id);
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            this.logger.error(`Failed to update reading ${id}: ${error.message}`, error.stack);
            throw error;
        }
        finally {
            await queryRunner.release();
        }
    }
    async validateReading(meterId, newReading, readingDate) {
        const result = new dto_1.ReadingValidationResultDto();
        result.meterId = meterId;
        const meter = await this.meterRepository.findOne({
            where: { meterId },
        });
        if (!meter) {
            result.addError(`Meter with ID ${meterId} not found`);
            return result;
        }
        if (readingDate > new Date()) {
            result.addError('Reading date cannot be in the future');
        }
        const previousReading = await this.readingRepository.findOne({
            where: {
                meterId,
                readingDate: (0, typeorm_2.LessThanOrEqual)(readingDate),
            },
            order: { readingDate: 'DESC' },
        });
        if (previousReading) {
            if (newReading < Number(previousReading.importReading)) {
                result.addError(`Reading ${newReading} is less than previous reading ${previousReading.importReading}`);
            }
            if (readingDate < previousReading.readingDate) {
                result.addWarning(`Reading date ${readingDate.toISOString()} is before previous reading date ${previousReading.readingDate.toISOString()}`);
            }
            const consumption = newReading - Number(previousReading.importReading);
            const averageConsumption = await this.calculateAverageConsumption(meterId);
            if (averageConsumption > 0) {
                if (consumption > averageConsumption * this.HIGH_CONSUMPTION_MULTIPLIER) {
                    result.addWarning(`Consumption ${consumption} is unusually high (${this.HIGH_CONSUMPTION_MULTIPLIER}x average of ${averageConsumption.toFixed(2)})`);
                }
                if (consumption <= this.LOW_CONSUMPTION_THRESHOLD) {
                    result.addWarning(`Consumption ${consumption} is zero or negative`);
                }
            }
        }
        return result;
    }
    async calculateAverageConsumption(meterId) {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - this.DAYS_FOR_AVERAGE);
        const readings = await this.readingRepository.find({
            where: {
                meterId,
                readingDate: (0, typeorm_2.MoreThanOrEqual)(startDate),
            },
            order: { readingDate: 'ASC' },
        });
        if (readings.length < 2) {
            return 0;
        }
        let totalConsumption = 0;
        for (let i = 1; i < readings.length; i++) {
            const current = Number(readings[i].importReading) || 0;
            const previous = Number(readings[i - 1].importReading) || 0;
            totalConsumption += current - previous;
        }
        return totalConsumption / (readings.length - 1);
    }
    async getConsumptionSummary(meterId, startDate, endDate) {
        const meter = await this.meterRepository.findOne({
            where: { meterId },
            relations: ['utilityType'],
        });
        if (!meter) {
            throw new common_1.NotFoundException(`Meter with ID ${meterId} not found`);
        }
        const readings = await this.readingRepository.find({
            where: {
                meterId,
                readingDate: (0, typeorm_2.Between)(startDate, endDate),
            },
            order: { readingDate: 'ASC' },
        });
        const summary = new dto_1.ConsumptionSummaryDto();
        summary.meterId = meterId;
        summary.meterSerialNo = meter.meterSerialNo;
        summary.utilityTypeName = meter.utilityType?.name || '';
        summary.period = {
            start: startDate.toISOString(),
            end: endDate.toISOString(),
        };
        summary.readingCount = readings.length;
        if (readings.length === 0) {
            summary.calculate();
            return summary;
        }
        let minConsumption = Infinity;
        let maxConsumption = -Infinity;
        for (const reading of readings) {
            const consumption = reading.consumption || 0;
            const exported = reading.exportedEnergy || 0;
            summary.totalConsumption += consumption;
            summary.totalExported += exported;
            if (consumption > 0) {
                minConsumption = Math.min(minConsumption, consumption);
                maxConsumption = Math.max(maxConsumption, consumption);
            }
        }
        summary.minConsumption = minConsumption === Infinity ? 0 : minConsumption;
        summary.maxConsumption = maxConsumption === -Infinity ? 0 : maxConsumption;
        summary.firstReading = Number(readings[0].importReading) || 0;
        summary.lastReading = Number(readings[readings.length - 1].importReading) || 0;
        summary.calculate();
        this.logger.log(`Generated consumption summary for meter ${meterId}: ${summary.totalConsumption} total consumption`);
        return summary;
    }
    async getReadingsByReader(meterReaderId, date) {
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);
        const readings = await this.readingRepository.find({
            where: {
                meterReaderId,
                readingDate: (0, typeorm_2.Between)(startOfDay, endOfDay),
            },
            relations: ['meter', 'meter.utilityType', 'meterReader', 'meterReader.employee'],
            order: { readingDate: 'ASC' },
        });
        const uniqueMeters = new Set(readings.map((r) => r.meterId));
        this.logger.log(`Reader ${meterReaderId} recorded ${readings.length} readings on ${date.toDateString()}`);
        return {
            readings: readings.map((r) => dto_1.MeterReadingResponseDto.fromEntity(r)),
            totalMetersRead: uniqueMeters.size,
        };
    }
    async estimateReading(meterId, readingDate) {
        const meter = await this.meterRepository.findOne({
            where: { meterId },
        });
        if (!meter) {
            throw new common_1.NotFoundException(`Meter with ID ${meterId} not found`);
        }
        const historicalDays = 180;
        const historicalStart = new Date(readingDate);
        historicalStart.setDate(historicalStart.getDate() - historicalDays);
        const readings = await this.readingRepository.find({
            where: {
                meterId,
                readingDate: (0, typeorm_2.Between)(historicalStart, readingDate),
            },
            order: { readingDate: 'ASC' },
        });
        if (readings.length < 2) {
            throw new common_1.BadRequestException('Insufficient historical data for estimation (need at least 2 readings)');
        }
        const firstReading = readings[0];
        const lastReading = readings[readings.length - 1];
        const totalConsumption = Number(lastReading.importReading) - Number(firstReading.importReading);
        const daysBetween = Math.max(1, Math.ceil((lastReading.readingDate.getTime() - firstReading.readingDate.getTime()) /
            (1000 * 60 * 60 * 24)));
        const dailyAverage = totalConsumption / daysBetween;
        const daysSinceLastReading = Math.ceil((readingDate.getTime() - lastReading.readingDate.getTime()) / (1000 * 60 * 60 * 24));
        const estimatedReading = Number(lastReading.importReading) + dailyAverage * daysSinceLastReading;
        let confidence = 'HIGH';
        if (readings.length < 6)
            confidence = 'MEDIUM';
        if (readings.length < 3)
            confidence = 'LOW';
        if (daysSinceLastReading > 60)
            confidence = 'LOW';
        this.logger.log(`Estimated reading for meter ${meterId}: ${estimatedReading.toFixed(3)} (${confidence} confidence)`);
        return {
            estimatedReading: Number(estimatedReading.toFixed(3)),
            confidence,
            basedOnReadings: readings.length,
        };
    }
    async createEstimatedReading(meterId, readingDate) {
        const estimation = await this.estimateReading(meterId, readingDate);
        const createDto = {
            meterId,
            readingDate,
            readingSource: 'ESTIMATED',
            importReading: estimation.estimatedReading,
        };
        return this.create(createDto);
    }
    async remove(id) {
        const reading = await this.readingRepository.findOne({
            where: { readingId: id },
        });
        if (!reading) {
            throw new common_1.NotFoundException(`Meter reading with ID ${id} not found`);
        }
        this.logger.warn(`Attempted to delete reading ${id} - deletion is not allowed for audit trail`);
        throw new common_1.BadRequestException('Meter readings cannot be deleted to maintain audit trail. Use corrections instead.');
    }
    async exportToCsv(filters) {
        const queryBuilder = this.readingRepository
            .createQueryBuilder('reading')
            .leftJoinAndSelect('reading.meter', 'meter')
            .leftJoinAndSelect('meter.utilityType', 'utilityType')
            .leftJoinAndSelect('reading.meterReader', 'meterReader')
            .leftJoinAndSelect('meterReader.employee', 'employee');
        if (filters.meterId) {
            queryBuilder.andWhere('reading.meterId = :meterId', { meterId: filters.meterId });
        }
        if (filters.meterReaderId) {
            queryBuilder.andWhere('reading.meterReaderId = :meterReaderId', {
                meterReaderId: filters.meterReaderId,
            });
        }
        if (filters.readingSource) {
            queryBuilder.andWhere('reading.readingSource = :readingSource', {
                readingSource: filters.readingSource,
            });
        }
        if (filters.startDate) {
            queryBuilder.andWhere('reading.readingDate >= :startDate', { startDate: filters.startDate });
        }
        if (filters.endDate) {
            queryBuilder.andWhere('reading.readingDate <= :endDate', { endDate: filters.endDate });
        }
        queryBuilder.orderBy('reading.readingDate', 'DESC');
        const readings = await queryBuilder.getMany();
        this.logger.log(`Exporting ${readings.length} readings to CSV`);
        const headers = [
            'Reading ID',
            'Meter ID',
            'Meter Serial No',
            'Utility Type',
            'Reading Date',
            'Reading Source',
            'Import Reading',
            'Previous Import Reading',
            'Consumption',
            'Export Reading',
            'Previous Export Reading',
            'Exported Energy',
            'Net Consumption',
            'Reader Name',
            'Device ID',
            'Created At',
        ];
        const csvRows = [headers.join(',')];
        for (const reading of readings) {
            const readerName = reading.meterReader?.employee
                ? `${reading.meterReader.employee.firstName} ${reading.meterReader.employee.lastName}`
                : '';
            const row = [
                reading.readingId,
                reading.meterId,
                reading.meter?.meterSerialNo || '',
                reading.meter?.utilityType?.name || '',
                reading.readingDate?.toISOString() || '',
                reading.readingSource,
                reading.importReading || '',
                reading.prevImportReading || '',
                reading.consumption || '',
                reading.exportReading || '',
                reading.prevExportReading || '',
                reading.exportedEnergy || '',
                reading.netConsumption || '',
                `"${readerName}"`,
                reading.deviceId || '',
                reading.createdAt?.toISOString() || '',
            ];
            csvRows.push(row.join(','));
        }
        return csvRows.join('\n');
    }
    async importFromCsv(csvContent, meterReaderId) {
        const lines = csvContent.split('\n').filter((line) => line.trim());
        if (lines.length < 2) {
            throw new common_1.BadRequestException('CSV file must have a header row and at least one data row');
        }
        const headers = this.parseCsvLine(lines[0]).map((h) => h.toLowerCase().trim());
        const meterIdIndex = headers.findIndex((h) => h === 'meter_id' || h === 'meterid' || h === 'meter id');
        const readingDateIndex = headers.findIndex((h) => h === 'reading_date' || h === 'readingdate' || h === 'reading date' || h === 'date');
        const importReadingIndex = headers.findIndex((h) => h === 'import_reading' ||
            h === 'importreading' ||
            h === 'import reading' ||
            h === 'reading');
        const exportReadingIndex = headers.findIndex((h) => h === 'export_reading' || h === 'exportreading' || h === 'export reading');
        const readingSourceIndex = headers.findIndex((h) => h === 'reading_source' || h === 'readingsource' || h === 'reading source' || h === 'source');
        if (meterIdIndex === -1 || readingDateIndex === -1 || importReadingIndex === -1) {
            throw new common_1.BadRequestException('CSV must have columns: meter_id (or meterId), reading_date (or readingDate/date), import_reading (or importReading/reading)');
        }
        const results = {
            totalRows: lines.length - 1,
            successCount: 0,
            failureCount: 0,
            errors: [],
        };
        for (let i = 1; i < lines.length; i++) {
            try {
                const values = this.parseCsvLine(lines[i]);
                const meterId = parseInt(values[meterIdIndex], 10);
                const readingDate = new Date(values[readingDateIndex]);
                const importReading = parseFloat(values[importReadingIndex]);
                const exportReading = exportReadingIndex !== -1 ? parseFloat(values[exportReadingIndex]) : undefined;
                const readingSource = readingSourceIndex !== -1 ? values[readingSourceIndex]?.toUpperCase() : 'MANUAL';
                if (isNaN(meterId)) {
                    throw new Error('Invalid meter_id');
                }
                if (isNaN(readingDate.getTime())) {
                    throw new Error('Invalid reading_date');
                }
                if (isNaN(importReading)) {
                    throw new Error('Invalid import_reading');
                }
                const createDto = {
                    meterId,
                    readingDate,
                    importReading,
                    exportReading: exportReading && !isNaN(exportReading) ? exportReading : undefined,
                    readingSource: (['MANUAL', 'SMART_METER', 'ESTIMATED'].includes(readingSource)
                        ? readingSource
                        : 'MANUAL'),
                };
                await this.create(createDto, meterReaderId);
                results.successCount++;
            }
            catch (error) {
                results.failureCount++;
                results.errors.push({
                    row: i + 1,
                    error: error.message || 'Unknown error',
                });
            }
        }
        this.logger.log(`CSV import completed: ${results.successCount} success, ${results.failureCount} failures`);
        return {
            success: results.failureCount === 0,
            ...results,
        };
    }
    parseCsvLine(line) {
        const result = [];
        let current = '';
        let inQuotes = false;
        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            if (char === '"') {
                inQuotes = !inQuotes;
            }
            else if (char === ',' && !inQuotes) {
                result.push(current.trim());
                current = '';
            }
            else {
                current += char;
            }
        }
        result.push(current.trim());
        return result;
    }
    async detectAnomalies(startDate, endDate, thresholdMultiplier) {
        const threshold = thresholdMultiplier || this.HIGH_CONSUMPTION_MULTIPLIER;
        const queryBuilder = this.readingRepository
            .createQueryBuilder('reading')
            .leftJoinAndSelect('reading.meter', 'meter')
            .leftJoinAndSelect('meter.utilityType', 'utilityType')
            .leftJoinAndSelect('reading.meterReader', 'meterReader')
            .leftJoinAndSelect('meterReader.employee', 'employee');
        if (startDate) {
            queryBuilder.andWhere('reading.readingDate >= :startDate', { startDate });
        }
        if (endDate) {
            queryBuilder.andWhere('reading.readingDate <= :endDate', { endDate });
        }
        queryBuilder.orderBy('reading.meterId', 'ASC').addOrderBy('reading.readingDate', 'ASC');
        const readings = await queryBuilder.getMany();
        this.logger.log(`Analyzing ${readings.length} readings for anomalies`);
        const anomalies = [];
        const byType = {};
        const bySeverity = { HIGH: 0, MEDIUM: 0, LOW: 0 };
        const readingsByMeter = new Map();
        for (const reading of readings) {
            if (!readingsByMeter.has(reading.meterId)) {
                readingsByMeter.set(reading.meterId, []);
            }
            readingsByMeter.get(reading.meterId).push(reading);
        }
        for (const meterReadings of readingsByMeter.values()) {
            let totalConsumption = 0;
            let consumptionCount = 0;
            for (const reading of meterReadings) {
                const consumption = reading.consumption || 0;
                if (consumption > 0) {
                    totalConsumption += consumption;
                    consumptionCount++;
                }
            }
            const avgConsumption = consumptionCount > 0 ? totalConsumption / consumptionCount : 0;
            for (let i = 0; i < meterReadings.length; i++) {
                const reading = meterReadings[i];
                const consumption = reading.consumption || 0;
                const responseDto = dto_1.MeterReadingResponseDto.fromEntity(reading);
                if (consumption < 0) {
                    const anomaly = {
                        reading: responseDto,
                        anomalyType: 'NEGATIVE_CONSUMPTION',
                        severity: 'HIGH',
                        description: `Negative consumption detected: ${consumption}. This may indicate meter rollback or data error.`,
                    };
                    anomalies.push(anomaly);
                    byType['NEGATIVE_CONSUMPTION'] = (byType['NEGATIVE_CONSUMPTION'] || 0) + 1;
                    bySeverity['HIGH']++;
                }
                if (consumption === 0 && reading.prevImportReading !== null) {
                    const anomaly = {
                        reading: responseDto,
                        anomalyType: 'ZERO_CONSUMPTION',
                        severity: 'LOW',
                        description: `Zero consumption detected. Verify if property is vacant or meter is malfunctioning.`,
                    };
                    anomalies.push(anomaly);
                    byType['ZERO_CONSUMPTION'] = (byType['ZERO_CONSUMPTION'] || 0) + 1;
                    bySeverity['LOW']++;
                }
                if (avgConsumption > 0 && consumption > avgConsumption * threshold) {
                    const anomaly = {
                        reading: responseDto,
                        anomalyType: 'HIGH_CONSUMPTION',
                        severity: 'MEDIUM',
                        description: `Consumption (${consumption.toFixed(2)}) is ${(consumption / avgConsumption).toFixed(1)}x higher than average (${avgConsumption.toFixed(2)}).`,
                    };
                    anomalies.push(anomaly);
                    byType['HIGH_CONSUMPTION'] = (byType['HIGH_CONSUMPTION'] || 0) + 1;
                    bySeverity['MEDIUM']++;
                }
                if (reading.prevImportReading !== null &&
                    Number(reading.importReading) < Number(reading.prevImportReading) &&
                    reading.readingSource !== meter_reading_entity_1.ReadingSource.CORRECTED) {
                    const anomaly = {
                        reading: responseDto,
                        anomalyType: 'READING_DECREASED',
                        severity: 'HIGH',
                        description: `Current reading (${reading.importReading}) is less than previous (${reading.prevImportReading}). Possible meter replacement or data entry error.`,
                    };
                    anomalies.push(anomaly);
                    byType['READING_DECREASED'] = (byType['READING_DECREASED'] || 0) + 1;
                    bySeverity['HIGH']++;
                }
                if (reading.readingDate > new Date()) {
                    const anomaly = {
                        reading: responseDto,
                        anomalyType: 'FUTURE_DATE',
                        severity: 'HIGH',
                        description: `Reading date is in the future: ${reading.readingDate.toISOString()}.`,
                    };
                    anomalies.push(anomaly);
                    byType['FUTURE_DATE'] = (byType['FUTURE_DATE'] || 0) + 1;
                    bySeverity['HIGH']++;
                }
                const duplicates = meterReadings.filter((r) => r.readingId !== reading.readingId &&
                    r.readingDate.toDateString() === reading.readingDate.toDateString());
                if (duplicates.length > 0) {
                    const anomaly = {
                        reading: responseDto,
                        anomalyType: 'DUPLICATE_DATE',
                        severity: 'MEDIUM',
                        description: `Multiple readings for same meter on same date (${reading.readingDate.toDateString()}).`,
                    };
                    anomalies.push(anomaly);
                    byType['DUPLICATE_DATE'] = (byType['DUPLICATE_DATE'] || 0) + 1;
                    bySeverity['MEDIUM']++;
                }
            }
        }
        this.logger.log(`Found ${anomalies.length} anomalies in ${readings.length} readings`);
        return {
            anomalies,
            summary: {
                totalAnalyzed: readings.length,
                anomalyCount: anomalies.length,
                byType,
                bySeverity,
            },
        };
    }
};
exports.ReadingsService = ReadingsService;
exports.ReadingsService = ReadingsService = ReadingsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(meter_reading_entity_1.MeterReading)),
    __param(1, (0, typeorm_1.InjectRepository)(meter_entity_1.Meter)),
    __param(2, (0, typeorm_1.InjectRepository)(meter_reader_entity_1.MeterReader)),
    __param(4, (0, common_1.Inject)((0, common_1.forwardRef)(() => billing_service_1.BillingService))),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.DataSource,
        billing_service_1.BillingService,
        event_emitter_1.EventEmitter2])
], ReadingsService);
//# sourceMappingURL=readings.service.js.map