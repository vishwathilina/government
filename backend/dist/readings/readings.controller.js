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
exports.ReadingsController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const swagger_1 = require("@nestjs/swagger");
const readings_service_1 = require("./readings.service");
const dto_1 = require("./dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
class ValidateReadingDto {
}
class EstimateReadingDto {
}
let ReadingsController = class ReadingsController {
    constructor(readingsService) {
        this.readingsService = readingsService;
    }
    async findAll(filters) {
        return this.readingsService.findAll(filters);
    }
    async findOne(id) {
        return this.readingsService.findOne(id);
    }
    async findByMeter(meterId, limit, startDate, endDate) {
        return this.readingsService.findByMeter(meterId, {
            limit: limit ? Number(limit) : undefined,
            startDate: startDate ? new Date(startDate) : undefined,
            endDate: endDate ? new Date(endDate) : undefined,
        });
    }
    async getLatestReading(meterId) {
        const reading = await this.readingsService.getLatestReading(meterId);
        return reading;
    }
    async getConsumptionSummary(meterId, startDate, endDate) {
        return this.readingsService.getConsumptionSummary(meterId, new Date(startDate), new Date(endDate));
    }
    async getReadingsByReader(meterReaderId, date) {
        return this.readingsService.getReadingsByReader(meterReaderId, new Date(date));
    }
    async create(createDto, user) {
        let meterReaderId;
        if (user?.role === 'METER_READER' && user?.meterReaderId) {
            meterReaderId = user.meterReaderId;
        }
        return this.readingsService.create(createDto, meterReaderId, {
            autoGenerateBill: createDto.autoGenerateBill ?? true,
            minDaysBetweenBills: createDto.minDaysBetweenBills ?? 25,
            dueDaysFromBillDate: createDto.dueDaysFromBillDate ?? 15,
        });
    }
    async createBulk(bulkDto) {
        return this.readingsService.createBulk(bulkDto);
    }
    async validateReading(body) {
        return this.readingsService.validateReading(body.meterId, body.reading, new Date(body.readingDate));
    }
    async estimateReading(meterId, body) {
        return this.readingsService.estimateReading(meterId, new Date(body.readingDate));
    }
    async update(id, updateDto) {
        return this.readingsService.update(id, updateDto);
    }
    async exportToCsv(filters, res) {
        const csvContent = await this.readingsService.exportToCsv(filters);
        const filename = `meter-readings-export-${new Date().toISOString().split('T')[0]}.csv`;
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        res.send(csvContent);
    }
    async importFromCsv(file, user) {
        if (!file) {
            throw new common_1.BadRequestException('No file uploaded');
        }
        if (!file.mimetype.includes('csv') && !file.originalname.endsWith('.csv')) {
            throw new common_1.BadRequestException('File must be a CSV file');
        }
        const csvContent = file.buffer.toString('utf-8');
        let meterReaderId;
        if (user?.role === 'METER_READER' && user?.meterReaderId) {
            meterReaderId = user.meterReaderId;
        }
        return this.readingsService.importFromCsv(csvContent, meterReaderId);
    }
    async detectAnomalies(startDate, endDate, threshold) {
        return this.readingsService.detectAnomalies(startDate ? new Date(startDate) : undefined, endDate ? new Date(endDate) : undefined, threshold ? Number(threshold) : undefined);
    }
};
exports.ReadingsController = ReadingsController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Get all meter readings',
        description: 'Retrieve a paginated list of meter readings with optional filtering by meter, reader, date range, and source',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'meterId',
        required: false,
        type: Number,
        description: 'Filter by meter ID',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'meterReaderId',
        required: false,
        type: Number,
        description: 'Filter by meter reader ID',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'readingSource',
        required: false,
        enum: dto_1.ReadingSourceDto,
        description: 'Filter by reading source',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'startDate',
        required: false,
        type: String,
        description: 'Filter readings from this date (YYYY-MM-DD)',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'endDate',
        required: false,
        type: String,
        description: 'Filter readings up to this date (YYYY-MM-DD)',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'page',
        required: false,
        type: Number,
        example: 1,
        description: 'Page number',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'limit',
        required: false,
        type: Number,
        example: 10,
        description: 'Items per page',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'sortBy',
        required: false,
        type: String,
        example: 'readingDate',
        description: 'Field to sort by',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'order',
        required: false,
        enum: dto_1.SortOrder,
        example: 'DESC',
        description: 'Sort order',
    }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Paginated list of meter readings',
        schema: {
            properties: {
                items: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/MeterReadingResponseDto' },
                },
                meta: {
                    type: 'object',
                    properties: {
                        total: { type: 'number' },
                        page: { type: 'number' },
                        limit: { type: 'number' },
                        totalPages: { type: 'number' },
                        hasNextPage: { type: 'boolean' },
                        hasPreviousPage: { type: 'boolean' },
                    },
                },
            },
        },
    }),
    __param(0, (0, common_1.Query)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.ReadingFilterDto]),
    __metadata("design:returntype", Promise)
], ReadingsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get meter reading by ID',
        description: 'Retrieve detailed information about a specific meter reading',
    }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        type: Number,
        description: 'Reading ID',
    }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Meter reading found',
        type: dto_1.MeterReadingResponseDto,
    }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'Meter reading not found' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ReadingsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)('meter/:meterId'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get readings by meter',
        description: 'Retrieve all meter readings for a specific meter',
    }),
    (0, swagger_1.ApiParam)({
        name: 'meterId',
        type: Number,
        description: 'Meter ID',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'limit',
        required: false,
        type: Number,
        example: 100,
        description: 'Maximum number of readings to return',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'startDate',
        required: false,
        type: String,
        description: 'Filter readings from this date',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'endDate',
        required: false,
        type: String,
        description: 'Filter readings up to this date',
    }),
    (0, swagger_1.ApiOkResponse)({
        description: 'List of readings for the meter',
        type: dto_1.MeterReadingResponseDto,
        isArray: true,
    }),
    __param(0, (0, common_1.Param)('meterId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('startDate')),
    __param(3, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String, String]),
    __metadata("design:returntype", Promise)
], ReadingsController.prototype, "findByMeter", null);
__decorate([
    (0, common_1.Get)('meter/:meterId/latest'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get latest reading for meter',
        description: 'Retrieve the most recent meter reading for a specific meter',
    }),
    (0, swagger_1.ApiParam)({
        name: 'meterId',
        type: Number,
        description: 'Meter ID',
    }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Latest reading for the meter',
        type: dto_1.MeterReadingResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 204,
        description: 'No readings found for this meter',
    }),
    __param(0, (0, common_1.Param)('meterId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ReadingsController.prototype, "getLatestReading", null);
__decorate([
    (0, common_1.Get)('meter/:meterId/consumption-summary'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get consumption summary',
        description: 'Retrieve consumption statistics for a meter over a specified period',
    }),
    (0, swagger_1.ApiParam)({
        name: 'meterId',
        type: Number,
        description: 'Meter ID',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'startDate',
        required: true,
        type: String,
        description: 'Start date for the summary period (YYYY-MM-DD)',
        example: '2025-01-01',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'endDate',
        required: true,
        type: String,
        description: 'End date for the summary period (YYYY-MM-DD)',
        example: '2025-12-31',
    }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Consumption summary for the period',
        type: dto_1.ConsumptionSummaryDto,
    }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Invalid date parameters' }),
    __param(0, (0, common_1.Param)('meterId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)('startDate')),
    __param(2, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, String]),
    __metadata("design:returntype", Promise)
], ReadingsController.prototype, "getConsumptionSummary", null);
__decorate([
    (0, common_1.Get)('reader/:meterReaderId/daily/:date'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get daily readings by reader',
        description: 'Retrieve all readings recorded by a specific meter reader on a given date. Used for performance tracking.',
    }),
    (0, swagger_1.ApiParam)({
        name: 'meterReaderId',
        type: Number,
        description: 'Meter Reader ID',
    }),
    (0, swagger_1.ApiParam)({
        name: 'date',
        type: String,
        description: 'Date to query (YYYY-MM-DD)',
        example: '2025-12-31',
    }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Readings by the reader on the specified date',
        schema: {
            properties: {
                readings: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/MeterReadingResponseDto' },
                },
                totalMetersRead: { type: 'number' },
            },
        },
    }),
    __param(0, (0, common_1.Param)('meterReaderId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Param)('date')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", Promise)
], ReadingsController.prototype, "getReadingsByReader", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({
        summary: 'Create meter reading',
        description: 'Record a new meter reading. If the user is a METER_READER, their ID is automatically associated. ' +
            'By default, a bill is automatically generated if conditions are met (enough readings, sufficient days since last bill).',
    }),
    (0, swagger_1.ApiBody)({
        type: dto_1.CreateMeterReadingDto,
        description: 'Meter reading data',
    }),
    (0, swagger_1.ApiCreatedResponse)({
        description: 'Meter reading created successfully. May include generatedBill if a bill was auto-generated.',
        schema: {
            allOf: [
                { $ref: '#/components/schemas/MeterReadingResponseDto' },
                {
                    properties: {
                        generatedBill: {
                            type: 'object',
                            nullable: true,
                            properties: {
                                billId: { type: 'number', description: 'ID of the auto-generated bill' },
                                totalAmount: { type: 'number', description: 'Total amount of the bill' },
                            },
                        },
                    },
                },
            ],
        },
    }),
    (0, swagger_1.ApiBadRequestResponse)({
        description: 'Validation failed or reading is invalid',
    }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'Meter not found' }),
    __param(0, (0, common_1.Body)(common_1.ValidationPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.CreateMeterReadingDto, Object]),
    __metadata("design:returntype", Promise)
], ReadingsController.prototype, "create", null);
__decorate([
    (0, common_1.Post)('bulk'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('Admin', 'Manager', 'MeterReader'),
    (0, swagger_1.ApiOperation)({
        summary: 'Bulk create meter readings',
        description: 'Create multiple meter readings at once. Used for batch imports. Requires ADMIN or METER_READER role.',
    }),
    (0, swagger_1.ApiBody)({
        type: dto_1.BulkCreateReadingsDto,
        description: 'Array of meter readings to create',
    }),
    (0, swagger_1.ApiCreatedResponse)({
        description: 'Bulk creation result',
        schema: {
            properties: {
                success: { type: 'boolean' },
                results: {
                    type: 'array',
                    items: {
                        properties: {
                            index: { type: 'number' },
                            reading: { $ref: '#/components/schemas/MeterReadingResponseDto' },
                            error: { type: 'string' },
                        },
                    },
                },
            },
        },
    }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Validation failed for one or more readings' }),
    __param(0, (0, common_1.Body)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.BulkCreateReadingsDto]),
    __metadata("design:returntype", Promise)
], ReadingsController.prototype, "createBulk", null);
__decorate([
    (0, common_1.Post)('validate'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Validate meter reading',
        description: 'Validate a reading value before saving. Returns validation errors and warnings.',
    }),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            required: ['meterId', 'reading', 'readingDate'],
            properties: {
                meterId: { type: 'number', example: 1 },
                reading: { type: 'number', example: 12500.5 },
                readingDate: { type: 'string', example: '2025-12-31T10:30:00Z' },
            },
        },
        description: 'Reading data to validate',
    }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Validation result',
        type: dto_1.ReadingValidationResultDto,
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ValidateReadingDto]),
    __metadata("design:returntype", Promise)
], ReadingsController.prototype, "validateReading", null);
__decorate([
    (0, common_1.Post)('meter/:meterId/estimate'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('Admin', 'Manager', 'MeterReader'),
    (0, swagger_1.ApiOperation)({
        summary: 'Generate estimated reading',
        description: 'Generate an estimated reading based on historical consumption data. Requires ADMIN or METER_READER role.',
    }),
    (0, swagger_1.ApiParam)({
        name: 'meterId',
        type: Number,
        description: 'Meter ID',
    }),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            required: ['readingDate'],
            properties: {
                readingDate: {
                    type: 'string',
                    example: '2025-12-31',
                    description: 'Date for the estimated reading',
                },
            },
        },
        description: 'Estimation parameters',
    }),
    (0, swagger_1.ApiCreatedResponse)({
        description: 'Estimated reading generated',
        schema: {
            properties: {
                estimatedReading: { type: 'number', example: 12750.5 },
                confidence: { type: 'string', enum: ['HIGH', 'MEDIUM', 'LOW'] },
                basedOnReadings: { type: 'number', example: 12 },
            },
        },
    }),
    (0, swagger_1.ApiBadRequestResponse)({
        description: 'Insufficient historical data for estimation',
    }),
    __param(0, (0, common_1.Param)('meterId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, EstimateReadingDto]),
    __metadata("design:returntype", Promise)
], ReadingsController.prototype, "estimateReading", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('Admin', 'Manager'),
    (0, swagger_1.ApiOperation)({
        summary: 'Update meter reading',
        description: 'Update or correct an existing meter reading. Automatically marks as CORRECTED if values change. Requires ADMIN or MANAGER role.',
    }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        type: Number,
        description: 'Reading ID',
    }),
    (0, swagger_1.ApiBody)({
        type: dto_1.UpdateMeterReadingDto,
        description: 'Updated reading data',
    }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Meter reading updated successfully',
        type: dto_1.MeterReadingResponseDto,
    }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'Meter reading not found' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Validation failed' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, dto_1.UpdateMeterReadingDto]),
    __metadata("design:returntype", Promise)
], ReadingsController.prototype, "update", null);
__decorate([
    (0, common_1.Get)('export'),
    (0, swagger_1.ApiOperation)({
        summary: 'Export readings to CSV',
        description: 'Export meter readings to a CSV file based on the provided filters. Returns a downloadable CSV file.',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'meterId',
        required: false,
        type: Number,
        description: 'Filter by meter ID',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'meterReaderId',
        required: false,
        type: Number,
        description: 'Filter by meter reader ID',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'readingSource',
        required: false,
        enum: dto_1.ReadingSourceDto,
        description: 'Filter by reading source',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'startDate',
        required: false,
        type: String,
        description: 'Filter readings from this date (YYYY-MM-DD)',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'endDate',
        required: false,
        type: String,
        description: 'Filter readings up to this date (YYYY-MM-DD)',
    }),
    (0, swagger_1.ApiProduces)('text/csv'),
    (0, swagger_1.ApiOkResponse)({
        description: 'CSV file download',
        content: {
            'text/csv': {
                schema: {
                    type: 'string',
                    format: 'binary',
                },
            },
        },
    }),
    __param(0, (0, common_1.Query)(common_1.ValidationPipe)),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.ReadingFilterDto, Object]),
    __metadata("design:returntype", Promise)
], ReadingsController.prototype, "exportToCsv", null);
__decorate([
    (0, common_1.Post)('import'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('Admin', 'Manager'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    (0, swagger_1.ApiOperation)({
        summary: 'Import readings from CSV',
        description: 'Import meter readings from a CSV file. CSV must have columns: meter_id, reading_date, import_reading. Optional: export_reading, reading_source. Requires ADMIN or MANAGER role.',
    }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                    description: 'CSV file to import',
                },
            },
        },
    }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Import results',
        schema: {
            properties: {
                success: { type: 'boolean' },
                totalRows: { type: 'number' },
                successCount: { type: 'number' },
                failureCount: { type: 'number' },
                errors: {
                    type: 'array',
                    items: {
                        properties: {
                            row: { type: 'number' },
                            error: { type: 'string' },
                        },
                    },
                },
            },
        },
    }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Invalid CSV format' }),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ReadingsController.prototype, "importFromCsv", null);
__decorate([
    (0, common_1.Get)('anomalies'),
    (0, swagger_1.ApiOperation)({
        summary: 'Detect reading anomalies',
        description: 'Analyze meter readings to detect anomalies such as negative consumption, unusually high consumption, zero consumption, future dates, and duplicate readings.',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'startDate',
        required: false,
        type: String,
        description: 'Analyze readings from this date (YYYY-MM-DD)',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'endDate',
        required: false,
        type: String,
        description: 'Analyze readings up to this date (YYYY-MM-DD)',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'threshold',
        required: false,
        type: Number,
        description: 'Multiplier for high consumption detection (e.g., 3 means 3x average is flagged)',
        example: 3,
    }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Anomaly detection results',
        schema: {
            properties: {
                anomalies: {
                    type: 'array',
                    items: {
                        properties: {
                            reading: { $ref: '#/components/schemas/MeterReadingResponseDto' },
                            anomalyType: {
                                type: 'string',
                                enum: [
                                    'NEGATIVE_CONSUMPTION',
                                    'ZERO_CONSUMPTION',
                                    'HIGH_CONSUMPTION',
                                    'READING_DECREASED',
                                    'FUTURE_DATE',
                                    'DUPLICATE_DATE',
                                ],
                            },
                            severity: { type: 'string', enum: ['HIGH', 'MEDIUM', 'LOW'] },
                            description: { type: 'string' },
                        },
                    },
                },
                summary: {
                    properties: {
                        totalAnalyzed: { type: 'number' },
                        anomalyCount: { type: 'number' },
                        byType: { type: 'object' },
                        bySeverity: { type: 'object' },
                    },
                },
            },
        },
    }),
    __param(0, (0, common_1.Query)('startDate')),
    __param(1, (0, common_1.Query)('endDate')),
    __param(2, (0, common_1.Query)('threshold')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Number]),
    __metadata("design:returntype", Promise)
], ReadingsController.prototype, "detectAnomalies", null);
exports.ReadingsController = ReadingsController = __decorate([
    (0, swagger_1.ApiTags)('Meter Readings'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('readings'),
    __metadata("design:paramtypes", [readings_service_1.ReadingsService])
], ReadingsController);
//# sourceMappingURL=readings.controller.js.map