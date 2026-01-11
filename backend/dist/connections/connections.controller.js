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
exports.ConnectionsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const connections_service_1 = require("./connections.service");
const create_connection_dto_1 = require("./dto/create-connection.dto");
const update_connection_dto_1 = require("./dto/update-connection.dto");
const connection_response_dto_1 = require("./dto/connection-response.dto");
const connection_filter_dto_1 = require("./dto/connection-filter.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
const employee_entity_1 = require("../database/entities/employee.entity");
const service_connection_entity_1 = require("../database/entities/service-connection.entity");
let ConnectionsController = class ConnectionsController {
    constructor(connectionsService) {
        this.connectionsService = connectionsService;
    }
    async findAll(filters) {
        return this.connectionsService.findAll(filters);
    }
    async findOne(id) {
        return this.connectionsService.findOne(id);
    }
    async findByCustomer(customerId) {
        return this.connectionsService.findByCustomer(customerId);
    }
    async getCustomerStats(customerId) {
        return this.connectionsService.getCustomerConnectionStats(customerId);
    }
    async create(createDto, user) {
        return this.connectionsService.create(createDto, user.employeeId);
    }
    async update(id, updateDto) {
        return this.connectionsService.update(id, updateDto);
    }
    async updateStatus(id, status, user) {
        return this.connectionsService.updateStatus(id, status, user.employeeId);
    }
    async assignMeter(id, meterId) {
        return this.connectionsService.assignMeter(id, meterId);
    }
    async remove(id) {
        await this.connectionsService.remove(id);
    }
};
exports.ConnectionsController = ConnectionsController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Get all service connections',
        description: 'Retrieve a paginated list of service connections with optional filtering',
    }),
    (0, swagger_1.ApiQuery)({ name: 'customerId', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'utilityTypeId', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'connectionStatus', required: false, enum: service_connection_entity_1.ConnectionStatus }),
    (0, swagger_1.ApiQuery)({ name: 'city', required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number, example: 1 }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number, example: 10 }),
    (0, swagger_1.ApiQuery)({ name: 'sortBy', required: false, type: String, example: 'connectionId' }),
    (0, swagger_1.ApiQuery)({ name: 'order', required: false, enum: ['ASC', 'DESC'], example: 'DESC' }),
    (0, swagger_1.ApiOkResponse)({
        description: 'List of service connections retrieved successfully',
        type: connection_response_dto_1.ConnectionResponseDto,
        isArray: true,
    }),
    __param(0, (0, common_1.Query)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [connection_filter_dto_1.ConnectionFilterDto]),
    __metadata("design:returntype", Promise)
], ConnectionsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get service connection by ID',
        description: 'Retrieve detailed information about a specific service connection',
    }),
    (0, swagger_1.ApiParam)({ name: 'id', type: Number, description: 'Connection ID' }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Service connection found',
        type: connection_response_dto_1.ConnectionResponseDto,
    }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'Service connection not found' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ConnectionsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)('customer/:customerId'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get connections by customer',
        description: 'Retrieve all service connections for a specific customer',
    }),
    (0, swagger_1.ApiParam)({ name: 'customerId', type: Number, description: 'Customer ID' }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Customer connections retrieved successfully',
        type: connection_response_dto_1.ConnectionResponseDto,
        isArray: true,
    }),
    __param(0, (0, common_1.Param)('customerId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ConnectionsController.prototype, "findByCustomer", null);
__decorate([
    (0, common_1.Get)('customer/:customerId/stats'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get customer connection statistics',
        description: 'Retrieve connection statistics grouped by status and utility type',
    }),
    (0, swagger_1.ApiParam)({ name: 'customerId', type: Number, description: 'Customer ID' }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Connection statistics retrieved successfully',
        schema: {
            example: {
                total: 3,
                active: 2,
                pending: 1,
                suspended: 0,
                disconnected: 0,
                byUtilityType: [
                    { utilityTypeId: 1, utilityTypeName: 'Electricity', count: 1 },
                    { utilityTypeId: 2, utilityTypeName: 'Water', count: 2 },
                ],
            },
        },
    }),
    __param(0, (0, common_1.Param)('customerId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ConnectionsController.prototype, "getCustomerStats", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({
        summary: 'Create new service connection',
        description: 'Create a new service connection for a customer',
    }),
    (0, swagger_1.ApiBody)({ type: create_connection_dto_1.CreateConnectionDto }),
    (0, swagger_1.ApiCreatedResponse)({
        description: 'Service connection created successfully',
        type: connection_response_dto_1.ConnectionResponseDto,
    }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Invalid input data' }),
    (0, swagger_1.ApiConflictResponse)({ description: 'Meter already assigned to another connection' }),
    __param(0, (0, common_1.Body)(common_1.ValidationPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_connection_dto_1.CreateConnectionDto,
        employee_entity_1.Employee]),
    __metadata("design:returntype", Promise)
], ConnectionsController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiOperation)({
        summary: 'Update service connection',
        description: 'Update an existing service connection',
    }),
    (0, swagger_1.ApiParam)({ name: 'id', type: Number, description: 'Connection ID' }),
    (0, swagger_1.ApiBody)({ type: update_connection_dto_1.UpdateConnectionDto }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Service connection updated successfully',
        type: connection_response_dto_1.ConnectionResponseDto,
    }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'Service connection not found' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Invalid input data' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_connection_dto_1.UpdateConnectionDto]),
    __metadata("design:returntype", Promise)
], ConnectionsController.prototype, "update", null);
__decorate([
    (0, common_1.Patch)(':id/status'),
    (0, swagger_1.ApiOperation)({
        summary: 'Update connection status',
        description: 'Change the status of a service connection',
    }),
    (0, swagger_1.ApiParam)({ name: 'id', type: Number, description: 'Connection ID' }),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                status: {
                    type: 'string',
                    enum: Object.values(service_connection_entity_1.ConnectionStatus),
                    example: service_connection_entity_1.ConnectionStatus.ACTIVE,
                },
            },
            required: ['status'],
        },
    }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Connection status updated successfully',
        type: connection_response_dto_1.ConnectionResponseDto,
    }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'Service connection not found' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Invalid status or status transition' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)('status')),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, employee_entity_1.Employee]),
    __metadata("design:returntype", Promise)
], ConnectionsController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.Patch)(':id/assign-meter'),
    (0, swagger_1.ApiOperation)({
        summary: 'Assign meter to connection',
        description: 'Link a meter to a service connection',
    }),
    (0, swagger_1.ApiParam)({ name: 'id', type: Number, description: 'Connection ID' }),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                meterId: {
                    type: 'number',
                    example: 1,
                },
            },
            required: ['meterId'],
        },
    }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Meter assigned successfully',
        type: connection_response_dto_1.ConnectionResponseDto,
    }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'Connection or meter not found' }),
    (0, swagger_1.ApiConflictResponse)({ description: 'Meter already assigned to another connection' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Meter is faulty or invalid' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)('meterId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], ConnectionsController.prototype, "assignMeter", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({
        summary: 'Deactivate service connection',
        description: 'Soft delete a service connection by marking it as disconnected',
    }),
    (0, swagger_1.ApiParam)({ name: 'id', type: Number, description: 'Connection ID' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NO_CONTENT,
        description: 'Service connection deactivated successfully',
    }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'Service connection not found' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ConnectionsController.prototype, "remove", null);
exports.ConnectionsController = ConnectionsController = __decorate([
    (0, swagger_1.ApiTags)('Service Connections'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('connections'),
    __metadata("design:paramtypes", [connections_service_1.ConnectionsService])
], ConnectionsController);
//# sourceMappingURL=connections.controller.js.map