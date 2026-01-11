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
exports.WorkOrdersController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const work_orders_service_1 = require("./work-orders.service");
const dto_1 = require("./dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let WorkOrdersController = class WorkOrdersController {
    constructor(workOrdersService) {
        this.workOrdersService = workOrdersService;
    }
    async create(createDto) {
        const workOrder = await this.workOrdersService.create(createDto);
        return {
            success: true,
            data: workOrder,
            message: 'Work order created successfully',
        };
    }
    async findAll(filters) {
        const result = await this.workOrdersService.findAll(filters);
        return {
            success: true,
            data: result.data,
            total: result.total,
            page: result.page,
            limit: result.limit,
            message: 'Work orders retrieved successfully',
        };
    }
    async getStatistics(filters) {
        const stats = await this.workOrdersService.getStatistics(filters);
        return {
            success: true,
            data: stats,
            message: 'Statistics retrieved successfully',
        };
    }
    async findOne(id) {
        const workOrder = await this.workOrdersService.findOne(id);
        return {
            success: true,
            data: this.workOrdersService['toResponseDto'](workOrder),
            message: 'Work order retrieved successfully',
        };
    }
    async update(id, updateDto) {
        const workOrder = await this.workOrdersService.update(id, updateDto);
        return {
            success: true,
            data: workOrder,
            message: 'Work order updated successfully',
        };
    }
    async updateStatus(id, body) {
        const workOrder = await this.workOrdersService.updateStatus(id, body.status, body.notes);
        return {
            success: true,
            data: workOrder,
            message: 'Work order status updated successfully',
        };
    }
    async complete(id, body) {
        const workOrder = await this.workOrdersService.complete(id, body.resolutionNotes);
        return {
            success: true,
            data: workOrder,
            message: 'Work order completed successfully',
        };
    }
    async cancel(id, body) {
        const workOrder = await this.workOrdersService.cancel(id, body.reason);
        return {
            success: true,
            data: workOrder,
            message: 'Work order cancelled successfully',
        };
    }
};
exports.WorkOrdersController = WorkOrdersController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new work order' }),
    (0, swagger_1.ApiResponse)({ status: 201, type: dto_1.WorkOrderResponseDto }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.CreateWorkOrderDto]),
    __metadata("design:returntype", Promise)
], WorkOrdersController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all work orders with filtering' }),
    (0, swagger_1.ApiResponse)({ status: 200 }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.WorkOrderFilterDto]),
    __metadata("design:returntype", Promise)
], WorkOrdersController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('statistics'),
    (0, swagger_1.ApiOperation)({ summary: 'Get work order statistics' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], WorkOrdersController.prototype, "getStatistics", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get work order by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: dto_1.WorkOrderResponseDto }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], WorkOrdersController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update a work order' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, dto_1.UpdateWorkOrderDto]),
    __metadata("design:returntype", Promise)
], WorkOrdersController.prototype, "update", null);
__decorate([
    (0, common_1.Patch)(':id/status'),
    (0, swagger_1.ApiOperation)({ summary: 'Update work order status' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], WorkOrdersController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.Post)(':id/complete'),
    (0, swagger_1.ApiOperation)({ summary: 'Complete a work order' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], WorkOrdersController.prototype, "complete", null);
__decorate([
    (0, common_1.Post)(':id/cancel'),
    (0, swagger_1.ApiOperation)({ summary: 'Cancel a work order' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], WorkOrdersController.prototype, "cancel", null);
exports.WorkOrdersController = WorkOrdersController = __decorate([
    (0, swagger_1.ApiTags)('Work Orders'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('api/v1/work-orders'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [work_orders_service_1.WorkOrdersService])
], WorkOrdersController);
//# sourceMappingURL=work-orders.controller.js.map