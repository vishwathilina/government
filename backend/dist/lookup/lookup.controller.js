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
exports.LookupController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const lookup_service_1 = require("./lookup.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let LookupController = class LookupController {
    constructor(lookupService) {
        this.lookupService = lookupService;
    }
    async getUtilityTypes() {
        return this.lookupService.getUtilityTypes();
    }
    async getTariffCategories(utilityTypeId) {
        const typeId = utilityTypeId ? parseInt(utilityTypeId) : undefined;
        return this.lookupService.getTariffCategories(typeId);
    }
    async getMeters(utilityTypeId) {
        const typeId = utilityTypeId ? parseInt(utilityTypeId) : undefined;
        return this.lookupService.getMeters(typeId);
    }
    async getAvailableMeters(utilityTypeId) {
        const typeId = utilityTypeId ? parseInt(utilityTypeId) : undefined;
        return this.lookupService.getAvailableMeters(typeId);
    }
    async getGeoAreas() {
        return this.lookupService.getGeoAreas();
    }
    async getNetworkNodes(utilityTypeId) {
        const typeId = utilityTypeId ? parseInt(utilityTypeId) : undefined;
        return this.lookupService.getNetworkNodes(typeId);
    }
    async getCustomers(search, limit) {
        const maxResults = limit ? parseInt(limit) : 50;
        return this.lookupService.getCustomers(search, maxResults);
    }
};
exports.LookupController = LookupController;
__decorate([
    (0, common_1.Get)('utility-types'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get all utility types',
        description: 'Retrieve list of all utility types (Electricity, Water, Gas)',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'List of utility types',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], LookupController.prototype, "getUtilityTypes", null);
__decorate([
    (0, common_1.Get)('tariff-categories'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get tariff categories',
        description: 'Retrieve list of tariff categories, optionally filtered by utility type',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'utilityTypeId',
        required: false,
        type: Number,
        description: 'Filter by utility type ID',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'List of tariff categories',
    }),
    __param(0, (0, common_1.Query)('utilityTypeId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LookupController.prototype, "getTariffCategories", null);
__decorate([
    (0, common_1.Get)('meters'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get all meters',
        description: 'Retrieve list of all meters, optionally filtered by utility type',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'utilityTypeId',
        required: false,
        type: Number,
        description: 'Filter by utility type ID',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'List of meters',
    }),
    __param(0, (0, common_1.Query)('utilityTypeId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LookupController.prototype, "getMeters", null);
__decorate([
    (0, common_1.Get)('meters/available'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get available meters',
        description: 'Retrieve list of unassigned meters, optionally filtered by utility type',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'utilityTypeId',
        required: false,
        type: Number,
        description: 'Filter by utility type ID',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'List of available meters',
    }),
    __param(0, (0, common_1.Query)('utilityTypeId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LookupController.prototype, "getAvailableMeters", null);
__decorate([
    (0, common_1.Get)('geo-areas'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get geographic areas',
        description: 'Retrieve list of all geographic areas',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'List of geographic areas',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], LookupController.prototype, "getGeoAreas", null);
__decorate([
    (0, common_1.Get)('network-nodes'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get network nodes',
        description: 'Retrieve list of network nodes, optionally filtered by utility type',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'utilityTypeId',
        required: false,
        type: Number,
        description: 'Filter by utility type ID',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'List of network nodes',
    }),
    __param(0, (0, common_1.Query)('utilityTypeId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LookupController.prototype, "getNetworkNodes", null);
__decorate([
    (0, common_1.Get)('customers'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get customers for selection',
        description: 'Retrieve list of customers for dropdown selection',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'search',
        required: false,
        type: String,
        description: 'Search term for filtering customers',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'limit',
        required: false,
        type: Number,
        description: 'Maximum number of results',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'List of customers',
    }),
    __param(0, (0, common_1.Query)('search')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], LookupController.prototype, "getCustomers", null);
exports.LookupController = LookupController = __decorate([
    (0, swagger_1.ApiTags)('Lookup'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('lookup'),
    __metadata("design:paramtypes", [lookup_service_1.LookupService])
], LookupController);
//# sourceMappingURL=lookup.controller.js.map