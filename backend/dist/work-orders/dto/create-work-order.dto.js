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
exports.CreateWorkOrderDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const work_order_entity_1 = require("../../database/entities/work-order.entity");
class CreateWorkOrderDto {
}
exports.CreateWorkOrderDto = CreateWorkOrderDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Opened timestamp', example: '2024-01-15T10:00:00Z' }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateWorkOrderDto.prototype, "openedTs", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Scheduled start timestamp' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateWorkOrderDto.prototype, "scheduledStartTs", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Scheduled end timestamp' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateWorkOrderDto.prototype, "scheduledEndTs", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Work order status',
        enum: work_order_entity_1.WorkOrderStatus,
        example: work_order_entity_1.WorkOrderStatus.OPEN
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsEnum)(work_order_entity_1.WorkOrderStatus),
    __metadata("design:type", String)
], CreateWorkOrderDto.prototype, "workOrderStatus", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Resolution notes', maxLength: 5000 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(5000),
    __metadata("design:type", String)
], CreateWorkOrderDto.prototype, "resolutionNotes", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Asset ID' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateWorkOrderDto.prototype, "assetId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Maintenance request ID' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateWorkOrderDto.prototype, "requestId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Geographic area ID' }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateWorkOrderDto.prototype, "geoAreaId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Employee IDs to assign', type: [Number] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsNumber)({}, { each: true }),
    __metadata("design:type", Array)
], CreateWorkOrderDto.prototype, "assignedEmployeeIds", void 0);
//# sourceMappingURL=create-work-order.dto.js.map