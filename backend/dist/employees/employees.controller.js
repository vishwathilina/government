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
exports.EmployeesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const employees_service_1 = require("./employees.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const employee_response_dto_1 = require("./dto/employee-response.dto");
const create_employee_dto_1 = require("./dto/create-employee.dto");
let EmployeesController = class EmployeesController {
    constructor(employeesService) {
        this.employeesService = employeesService;
    }
    async getDashboardStats() {
        return this.employeesService.getDashboardStats();
    }
    async findAll(page = 1, limit = 10) {
        const result = await this.employeesService.findAll(page, limit);
        return {
            success: true,
            data: {
                data: result.data.map((emp) => employee_response_dto_1.EmployeeResponseDto.fromEntity(emp)),
                total: result.total,
                page: result.page,
                limit: result.limit,
            },
            message: 'Employees retrieved successfully',
        };
    }
    async findOne(id) {
        const employee = await this.employeesService.findByIdOrFail(id);
        return {
            success: true,
            data: employee_response_dto_1.EmployeeResponseDto.fromEntity(employee),
            message: 'Employee retrieved successfully',
        };
    }
    async create(createEmployeeDto) {
        const employee = await this.employeesService.create(createEmployeeDto);
        return {
            success: true,
            data: employee_response_dto_1.EmployeeResponseDto.fromEntity(employee),
            message: 'Employee created successfully',
        };
    }
    async update(id, updateEmployeeDto) {
        const employee = await this.employeesService.update(id, updateEmployeeDto);
        return {
            success: true,
            data: employee_response_dto_1.EmployeeResponseDto.fromEntity(employee),
            message: 'Employee updated successfully',
        };
    }
    async delete(id) {
        await this.employeesService.delete(id);
        return {
            success: true,
            data: null,
            message: 'Employee deleted successfully',
        };
    }
};
exports.EmployeesController = EmployeesController;
__decorate([
    (0, common_1.Get)('dashboard/stats'),
    (0, swagger_1.ApiOperation)({ summary: 'Get dashboard statistics for admin dashboard' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Dashboard stats retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], EmployeesController.prototype, "getDashboardStats", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all employees (paginated)' }),
    (0, swagger_1.ApiQuery)({
        name: 'page',
        required: false,
        type: Number,
        description: 'Page number (default: 1)',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'limit',
        required: false,
        type: Number,
        description: 'Items per page (default: 10)',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'List of employees retrieved successfully',
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], EmployeesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get employee by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: Number, description: 'Employee ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Employee found' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Employee not found' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], EmployeesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new employee' }),
    (0, swagger_1.ApiBody)({ type: create_employee_dto_1.CreateEmployeeDto }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Employee created successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'Conflict - username/email/employee number already exists' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_employee_dto_1.CreateEmployeeDto]),
    __metadata("design:returntype", Promise)
], EmployeesController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update an employee' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: Number, description: 'Employee ID' }),
    (0, swagger_1.ApiBody)({ type: create_employee_dto_1.UpdateEmployeeDto }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Employee updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Employee not found' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'Conflict - username/email/employee number already exists' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, create_employee_dto_1.UpdateEmployeeDto]),
    __metadata("design:returntype", Promise)
], EmployeesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete an employee' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: Number, description: 'Employee ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Employee deleted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Employee not found' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Cannot delete the last admin user' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], EmployeesController.prototype, "delete", null);
exports.EmployeesController = EmployeesController = __decorate([
    (0, swagger_1.ApiTags)('Employees'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('employees'),
    __metadata("design:paramtypes", [employees_service_1.EmployeesService])
], EmployeesController);
//# sourceMappingURL=employees.controller.js.map