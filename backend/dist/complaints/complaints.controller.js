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
exports.ComplaintsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const complaints_service_1 = require("./complaints.service");
const dto_1 = require("./dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let ComplaintsController = class ComplaintsController {
    constructor(complaintsService) {
        this.complaintsService = complaintsService;
    }
    async create(createDto) {
        const complaint = await this.complaintsService.create(createDto);
        return {
            success: true,
            data: complaint,
            message: 'Complaint created successfully',
        };
    }
    async findAll(filters) {
        const result = await this.complaintsService.findAll(filters);
        return {
            success: true,
            data: result.data,
            total: result.total,
            page: result.page,
            limit: result.limit,
            message: 'Complaints retrieved successfully',
        };
    }
    async findOne(id) {
        const complaint = await this.complaintsService.findOne(id);
        return {
            success: true,
            data: this.complaintsService['toResponseDto'](complaint),
            message: 'Complaint retrieved successfully',
        };
    }
    async update(id, updateDto) {
        const complaint = await this.complaintsService.update(id, updateDto);
        return {
            success: true,
            data: complaint,
            message: 'Complaint updated successfully',
        };
    }
    async assign(id, body) {
        const complaint = await this.complaintsService.assign(id, body.employeeId);
        return {
            success: true,
            data: complaint,
            message: 'Complaint assigned successfully',
        };
    }
    async resolve(id) {
        const complaint = await this.complaintsService.resolve(id);
        return {
            success: true,
            data: complaint,
            message: 'Complaint resolved successfully',
        };
    }
    async close(id) {
        const complaint = await this.complaintsService.close(id);
        return {
            success: true,
            data: complaint,
            message: 'Complaint closed successfully',
        };
    }
};
exports.ComplaintsController = ComplaintsController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new complaint' }),
    (0, swagger_1.ApiResponse)({ status: 201, type: dto_1.ComplaintResponseDto }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.CreateComplaintDto]),
    __metadata("design:returntype", Promise)
], ComplaintsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all complaints with filtering' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.ComplaintFilterDto]),
    __metadata("design:returntype", Promise)
], ComplaintsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get complaint by ID' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ComplaintsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update a complaint' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, dto_1.UpdateComplaintDto]),
    __metadata("design:returntype", Promise)
], ComplaintsController.prototype, "update", null);
__decorate([
    (0, common_1.Patch)(':id/assign'),
    (0, swagger_1.ApiOperation)({ summary: 'Assign complaint to employee' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], ComplaintsController.prototype, "assign", null);
__decorate([
    (0, common_1.Patch)(':id/resolve'),
    (0, swagger_1.ApiOperation)({ summary: 'Resolve a complaint' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ComplaintsController.prototype, "resolve", null);
__decorate([
    (0, common_1.Patch)(':id/close'),
    (0, swagger_1.ApiOperation)({ summary: 'Close a complaint' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ComplaintsController.prototype, "close", null);
exports.ComplaintsController = ComplaintsController = __decorate([
    (0, swagger_1.ApiTags)('Complaints'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('api/v1/complaints'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [complaints_service_1.ComplaintsService])
], ComplaintsController);
//# sourceMappingURL=complaints.controller.js.map