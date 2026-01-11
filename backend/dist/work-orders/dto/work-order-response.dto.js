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
exports.WorkOrderResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const work_order_entity_1 = require("../../database/entities/work-order.entity");
class WorkOrderResponseDto {
}
exports.WorkOrderResponseDto = WorkOrderResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], WorkOrderResponseDto.prototype, "workOrderId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], WorkOrderResponseDto.prototype, "openedTs", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Date)
], WorkOrderResponseDto.prototype, "scheduledStartTs", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Date)
], WorkOrderResponseDto.prototype, "scheduledEndTs", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Date)
], WorkOrderResponseDto.prototype, "closedTs", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: work_order_entity_1.WorkOrderStatus }),
    __metadata("design:type", String)
], WorkOrderResponseDto.prototype, "workOrderStatus", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], WorkOrderResponseDto.prototype, "resolutionNotes", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Number)
], WorkOrderResponseDto.prototype, "assetId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Number)
], WorkOrderResponseDto.prototype, "requestId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], WorkOrderResponseDto.prototype, "geoAreaId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Object)
], WorkOrderResponseDto.prototype, "asset", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Object)
], WorkOrderResponseDto.prototype, "request", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Object)
], WorkOrderResponseDto.prototype, "geoArea", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Number)
], WorkOrderResponseDto.prototype, "totalLaborCost", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Number)
], WorkOrderResponseDto.prototype, "totalItemCost", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Number)
], WorkOrderResponseDto.prototype, "totalCost", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Number)
], WorkOrderResponseDto.prototype, "durationHours", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Array)
], WorkOrderResponseDto.prototype, "laborEntries", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Array)
], WorkOrderResponseDto.prototype, "itemUsages", void 0);
//# sourceMappingURL=work-order-response.dto.js.map