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
exports.MetersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const meter_entity_1 = require("../database/entities/meter.entity");
let MetersService = class MetersService {
    constructor(meterRepository) {
        this.meterRepository = meterRepository;
    }
    async create(createMeterDto) {
        const meter = this.meterRepository.create({
            meterSerialNo: createMeterDto.meterNumber,
            utilityTypeId: createMeterDto.utilityTypeId,
            installationDate: createMeterDto.installationDate,
            isSmartMeter: createMeterDto.isSmartMeter,
            status: createMeterDto.status,
        });
        return this.meterRepository.save(meter);
    }
    async findAll() {
        return this.meterRepository.find();
    }
    async findOne(id) {
        const meter = await this.meterRepository.findOne({ where: { meterId: Number(id) } });
        if (!meter)
            throw new common_1.NotFoundException('Meter not found');
        return meter;
    }
    async update(id, updateMeterDto) {
        const meter = await this.findOne(id);
        if (updateMeterDto.meterNumber !== undefined)
            meter.meterSerialNo = updateMeterDto.meterNumber;
        if (updateMeterDto.utilityTypeId !== undefined)
            meter.utilityTypeId = updateMeterDto.utilityTypeId;
        if (updateMeterDto.installationDate !== undefined)
            meter.installationDate = new Date(updateMeterDto.installationDate);
        if (updateMeterDto.isSmartMeter !== undefined)
            meter.isSmartMeter = updateMeterDto.isSmartMeter;
        if (updateMeterDto.status !== undefined)
            meter.status = updateMeterDto.status;
        return this.meterRepository.save(meter);
    }
    async remove(id) {
        const meter = await this.findOne(id);
        await this.meterRepository.remove(meter);
    }
};
exports.MetersService = MetersService;
exports.MetersService = MetersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(meter_entity_1.Meter)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], MetersService);
//# sourceMappingURL=meters.service.js.map