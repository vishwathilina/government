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
exports.MetersController = void 0;
const common_1 = require("@nestjs/common");
const meters_service_1 = require("./meters.service");
const create_meter_dto_1 = require("./dto/create-meter.dto");
const update_meter_dto_1 = require("./dto/update-meter.dto");
let MetersController = class MetersController {
    constructor(metersService) {
        this.metersService = metersService;
    }
    async create(createMeterDto) {
        const meter = await this.metersService.create(createMeterDto);
        return this.toDto(meter);
    }
    async findAll() {
        const meters = await this.metersService.findAll();
        return meters.map(this.toDto);
    }
    async findOne(id) {
        const meter = await this.metersService.findOne(Number(id));
        return this.toDto(meter);
    }
    async update(id, updateMeterDto) {
        const meter = await this.metersService.update(Number(id), updateMeterDto);
        return this.toDto(meter);
    }
    async remove(id) {
        await this.metersService.remove(Number(id));
        return { success: true };
    }
    toDto(meter) {
        return {
            id: meter.meterId ?? meter.id,
            meterNumber: meter.meterSerialNo ?? meter.meterNumber,
            status: meter.status,
            utilityTypeId: meter.utilityTypeId,
            utilityTypeName: meter.utilityType?.name ?? '',
            installationDate: meter.installationDate ? (typeof meter.installationDate === 'string' ? meter.installationDate : meter.installationDate.toISOString().slice(0, 10)) : '',
            isSmartMeter: meter.isSmartMeter,
        };
    }
};
exports.MetersController = MetersController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_meter_dto_1.CreateMeterDto]),
    __metadata("design:returntype", Promise)
], MetersController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MetersController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MetersController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_meter_dto_1.UpdateMeterDto]),
    __metadata("design:returntype", Promise)
], MetersController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MetersController.prototype, "remove", null);
exports.MetersController = MetersController = __decorate([
    (0, common_1.Controller)('meters'),
    __metadata("design:paramtypes", [meters_service_1.MetersService])
], MetersController);
//# sourceMappingURL=meters.controller.js.map