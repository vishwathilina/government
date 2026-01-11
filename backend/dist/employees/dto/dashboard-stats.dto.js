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
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardStatsDto = exports.BillingOverviewDto = exports.UtilityStatsDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class UtilityStatsDto {
}
exports.UtilityStatsDto = UtilityStatsDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Water' }),
    __metadata("design:type", String)
], UtilityStatsDto.prototype, "utilityType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 18543 }),
    __metadata("design:type", Number)
], UtilityStatsDto.prototype, "activeConnections", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 2341 }),
    __metadata("design:type", Number)
], UtilityStatsDto.prototype, "pendingBills", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 2400000 }),
    __metadata("design:type", Number)
], UtilityStatsDto.prototype, "revenue", void 0);
class BillingOverviewDto {
}
exports.BillingOverviewDto = BillingOverviewDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 2400000 }),
    __metadata("design:type", Number)
], BillingOverviewDto.prototype, "totalRevenue", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 3 }),
    __metadata("design:type", Number)
], BillingOverviewDto.prototype, "revenueChangePercent", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 120000 }),
    __metadata("design:type", Number)
], BillingOverviewDto.prototype, "outstandingAmount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 120 }),
    __metadata("design:type", Number)
], BillingOverviewDto.prototype, "outstandingCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 45000 }),
    __metadata("design:type", Number)
], BillingOverviewDto.prototype, "overdueAmount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 30 }),
    __metadata("design:type", Number)
], BillingOverviewDto.prototype, "overdueCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 86 }),
    __metadata("design:type", Number)
], BillingOverviewDto.prototype, "collectionRate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 95 }),
    __metadata("design:type", Number)
], BillingOverviewDto.prototype, "targetCollectionRate", void 0);
class DashboardStatsDto {
}
exports.DashboardStatsDto = DashboardStatsDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 24521 }),
    __metadata("design:type", Number)
], DashboardStatsDto.prototype, "totalCustomers", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 12 }),
    __metadata("design:type", Number)
], DashboardStatsDto.prototype, "customerGrowthPercent", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 45890 }),
    __metadata("design:type", Number)
], DashboardStatsDto.prototype, "activeConnections", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 8 }),
    __metadata("design:type", Number)
], DashboardStatsDto.prototype, "connectionsChangePercent", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 12450 }),
    __metadata("design:type", Number)
], DashboardStatsDto.prototype, "billsGenerated", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 5 }),
    __metadata("design:type", Number)
], DashboardStatsDto.prototype, "billsChangePercent", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 2400000 }),
    __metadata("design:type", Number)
], DashboardStatsDto.prototype, "revenueMTD", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 3 }),
    __metadata("design:type", Number)
], DashboardStatsDto.prototype, "revenueChangePercent", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [UtilityStatsDto] }),
    __metadata("design:type", Array)
], DashboardStatsDto.prototype, "utilityStats", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: BillingOverviewDto }),
    __metadata("design:type", BillingOverviewDto)
], DashboardStatsDto.prototype, "billingOverview", void 0);
//# sourceMappingURL=dashboard-stats.dto.js.map