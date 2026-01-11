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
exports.CustomersController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const customers_service_1 = require("./customers.service");
const create_customer_dto_1 = require("./dto/create-customer.dto");
const update_customer_dto_1 = require("./dto/update-customer.dto");
const customer_response_dto_1 = require("./dto/customer-response.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
const employee_entity_1 = require("../database/entities/employee.entity");
let CustomersController = class CustomersController {
    constructor(customersService) {
        this.customersService = customersService;
    }
    async create(createCustomerDto, user) {
        const customer = await this.customersService.create(createCustomerDto, user.employeeId);
        return {
            success: true,
            data: customer,
            message: 'Customer created successfully',
        };
    }
    async findAll(page, limit, sortBy, order, customerType, search) {
        const result = await this.customersService.findAll({
            page: page || 1,
            limit: limit || 10,
            sortBy,
            order,
            customerType,
            search,
        });
        return {
            success: true,
            data: result,
        };
    }
    async getCountByType() {
        const result = await this.customersService.getCountByType();
        return {
            success: true,
            data: result,
        };
    }
    async findById(id) {
        const customer = await this.customersService.findById(id);
        return {
            success: true,
            data: customer,
        };
    }
    async findByIdentityRef(identityRef) {
        const customer = await this.customersService.findByIdentityRef(identityRef);
        return {
            success: true,
            data: customer,
        };
    }
    async update(id, updateCustomerDto) {
        const customer = await this.customersService.update(id, updateCustomerDto);
        return {
            success: true,
            data: customer,
            message: 'Customer updated successfully',
        };
    }
    async delete(id) {
        await this.customersService.delete(id);
        return {
            success: true,
            data: null,
            message: 'Customer deleted successfully',
        };
    }
};
exports.CustomersController = CustomersController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)('Admin', 'Manager', 'FieldOfficer'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new customer' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Customer created successfully',
        type: customer_response_dto_1.CustomerResponseDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request - validation failed' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'Conflict - duplicate identity ref or email' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_customer_dto_1.CreateCustomerDto,
        employee_entity_1.Employee]),
    __metadata("design:returntype", Promise)
], CustomersController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)('Admin', 'Manager', 'FieldOfficer', 'Cashier'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all customers with pagination' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number, description: 'Page number' }),
    (0, swagger_1.ApiQuery)({
        name: 'limit',
        required: false,
        type: Number,
        description: 'Items per page',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'sortBy',
        required: false,
        type: String,
        description: 'Sort field',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'order',
        required: false,
        enum: ['ASC', 'DESC'],
        description: 'Sort order',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'customerType',
        required: false,
        enum: create_customer_dto_1.CustomerType,
        description: 'Filter by customer type',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'search',
        required: false,
        type: String,
        description: 'Search by name, email, or identity ref',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'List of customers retrieved successfully',
    }),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('sortBy')),
    __param(3, (0, common_1.Query)('order')),
    __param(4, (0, common_1.Query)('customerType')),
    __param(5, (0, common_1.Query)('search')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String, String, String, String]),
    __metadata("design:returntype", Promise)
], CustomersController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('stats/count-by-type'),
    (0, roles_decorator_1.Roles)('Admin', 'Manager'),
    (0, swagger_1.ApiOperation)({ summary: 'Get customer count by type' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Customer count by type retrieved successfully',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CustomersController.prototype, "getCountByType", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, roles_decorator_1.Roles)('Admin', 'Manager', 'FieldOfficer', 'Cashier'),
    (0, swagger_1.ApiOperation)({ summary: 'Get customer by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: Number, description: 'Customer ID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Customer retrieved successfully',
        type: customer_response_dto_1.CustomerResponseDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Customer not found' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], CustomersController.prototype, "findById", null);
__decorate([
    (0, common_1.Get)('identity/:identityRef'),
    (0, roles_decorator_1.Roles)('Admin', 'Manager', 'FieldOfficer', 'Cashier'),
    (0, swagger_1.ApiOperation)({ summary: 'Get customer by identity reference' }),
    (0, swagger_1.ApiParam)({
        name: 'identityRef',
        type: String,
        description: 'Identity reference number',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Customer retrieved successfully',
        type: customer_response_dto_1.CustomerResponseDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Customer not found' }),
    __param(0, (0, common_1.Param)('identityRef')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CustomersController.prototype, "findByIdentityRef", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, roles_decorator_1.Roles)('Admin', 'Manager', 'FieldOfficer'),
    (0, swagger_1.ApiOperation)({ summary: 'Update a customer' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: Number, description: 'Customer ID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Customer updated successfully',
        type: customer_response_dto_1.CustomerResponseDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request - validation failed' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Customer not found' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'Conflict - duplicate email' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_customer_dto_1.UpdateCustomerDto]),
    __metadata("design:returntype", Promise)
], CustomersController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)('Admin', 'Manager'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a customer' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: Number, description: 'Customer ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Customer deleted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Customer not found' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], CustomersController.prototype, "delete", null);
exports.CustomersController = CustomersController = __decorate([
    (0, swagger_1.ApiTags)('Customers'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)('customers'),
    __metadata("design:paramtypes", [customers_service_1.CustomersService])
], CustomersController);
//# sourceMappingURL=customers.controller.js.map