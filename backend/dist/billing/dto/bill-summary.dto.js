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
exports.BillSummaryDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
class BillSummaryDto {
}
exports.BillSummaryDto = BillSummaryDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Total number of bills',
        example: 150,
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Number)
], BillSummaryDto.prototype, "totalBills", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Total amount of all bills',
        example: 450000.0,
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Number)
], BillSummaryDto.prototype, "totalAmount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Total amount paid',
        example: 380000.0,
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Number)
], BillSummaryDto.prototype, "totalPaid", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Total outstanding amount',
        example: 70000.0,
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Number)
], BillSummaryDto.prototype, "totalOutstanding", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Number of overdue bills',
        example: 25,
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Number)
], BillSummaryDto.prototype, "overdueBills", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Total amount of overdue bills',
        example: 45000.0,
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Number)
], BillSummaryDto.prototype, "overdueAmount", void 0);
//# sourceMappingURL=bill-summary.dto.js.map