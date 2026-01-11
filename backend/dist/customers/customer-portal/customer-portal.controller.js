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
exports.CustomerPortalController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const customer_jwt_auth_guard_1 = require("../../auth/guards/customer-jwt-auth.guard");
const customer_portal_service_1 = require("./customer-portal.service");
let CustomerPortalController = class CustomerPortalController {
    constructor(customerPortalService) {
        this.customerPortalService = customerPortalService;
    }
    async getDashboard(req) {
        const customerId = req.user.sub;
        return this.customerPortalService.getDashboardData(customerId);
    }
    async getProfile(req) {
        const customerId = req.user.sub;
        return this.customerPortalService.getCustomerProfile(customerId);
    }
    async getUnpaidBills(req) {
        const customerId = req.user.sub;
        return this.customerPortalService.getUnpaidBills(customerId);
    }
    async getBillHistory(req, page, limit, status) {
        const customerId = req.user.sub;
        return this.customerPortalService.getBillHistory(customerId, {
            page: page || 1,
            limit: limit || 10,
            status,
        });
    }
    async getBillDetails(req, billId) {
        const customerId = req.user.sub;
        return this.customerPortalService.getBillDetails(customerId, billId);
    }
    async getPaymentHistory(req, page, limit) {
        const customerId = req.user.sub;
        return this.customerPortalService.getPaymentHistory(customerId, {
            page: page || 1,
            limit: limit || 10,
        });
    }
    async getPaymentReceipt(req, paymentId) {
        const customerId = req.user.sub;
        return this.customerPortalService.getPaymentReceipt(customerId, paymentId);
    }
    async getConnections(req) {
        const customerId = req.user.sub;
        return this.customerPortalService.getConnections(customerId);
    }
    async getConsumptionHistory(req, connectionId, months) {
        const customerId = req.user.sub;
        return this.customerPortalService.getConsumptionHistory(customerId, connectionId, months || 12);
    }
};
exports.CustomerPortalController = CustomerPortalController;
__decorate([
    (0, common_1.Get)('dashboard'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get customer dashboard data',
        description: 'Retrieve dashboard summary including unpaid bills, recent payments, and account info',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Dashboard data retrieved successfully',
    }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CustomerPortalController.prototype, "getDashboard", null);
__decorate([
    (0, common_1.Get)('profile'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get customer profile',
        description: 'Retrieve the current customer profile information',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Profile retrieved successfully',
    }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CustomerPortalController.prototype, "getProfile", null);
__decorate([
    (0, common_1.Get)('bills/unpaid'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get unpaid bills',
        description: 'Retrieve all unpaid bills for the logged-in customer',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Unpaid bills retrieved successfully',
    }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CustomerPortalController.prototype, "getUnpaidBills", null);
__decorate([
    (0, common_1.Get)('bills'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get bill history',
        description: 'Retrieve bill history with pagination',
    }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number, example: 1 }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number, example: 10 }),
    (0, swagger_1.ApiQuery)({ name: 'status', required: false, enum: ['PAID', 'UNPAID', 'OVERDUE', 'PARTIAL'] }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Bills retrieved successfully',
    }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __param(3, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, Number, String]),
    __metadata("design:returntype", Promise)
], CustomerPortalController.prototype, "getBillHistory", null);
__decorate([
    (0, common_1.Get)('bills/:billId'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get bill details',
        description: 'Retrieve detailed information about a specific bill',
    }),
    (0, swagger_1.ApiParam)({ name: 'billId', type: Number }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Bill details retrieved successfully',
    }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('billId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], CustomerPortalController.prototype, "getBillDetails", null);
__decorate([
    (0, common_1.Get)('payments'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get payment history',
        description: 'Retrieve payment history with pagination',
    }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number, example: 1 }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number, example: 10 }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Payments retrieved successfully',
    }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, Number]),
    __metadata("design:returntype", Promise)
], CustomerPortalController.prototype, "getPaymentHistory", null);
__decorate([
    (0, common_1.Get)('payments/:paymentId/receipt'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get payment receipt',
        description: 'Retrieve receipt details for a specific payment',
    }),
    (0, swagger_1.ApiParam)({ name: 'paymentId', type: Number }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Receipt retrieved successfully',
    }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('paymentId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], CustomerPortalController.prototype, "getPaymentReceipt", null);
__decorate([
    (0, common_1.Get)('connections'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get service connections',
        description: 'Retrieve all service connections for the customer',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Connections retrieved successfully',
    }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CustomerPortalController.prototype, "getConnections", null);
__decorate([
    (0, common_1.Get)('connections/:connectionId/consumption'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get consumption history',
        description: 'Retrieve consumption history for a specific connection',
    }),
    (0, swagger_1.ApiParam)({ name: 'connectionId', type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'months', required: false, type: Number, example: 12 }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Consumption history retrieved successfully',
    }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('connectionId', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Query)('months')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, Number]),
    __metadata("design:returntype", Promise)
], CustomerPortalController.prototype, "getConsumptionHistory", null);
exports.CustomerPortalController = CustomerPortalController = __decorate([
    (0, swagger_1.ApiTags)('Customer Portal'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(customer_jwt_auth_guard_1.CustomerJwtAuthGuard),
    (0, common_1.Controller)('customer-portal'),
    __metadata("design:paramtypes", [customer_portal_service_1.CustomerPortalService])
], CustomerPortalController);
//# sourceMappingURL=customer-portal.controller.js.map