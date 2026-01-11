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
var LookupService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.LookupService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const utility_type_entity_1 = require("../database/entities/utility-type.entity");
const tariff_category_entity_1 = require("../database/entities/tariff-category.entity");
const meter_entity_1 = require("../database/entities/meter.entity");
const geo_area_entity_1 = require("../database/entities/geo-area.entity");
const network_node_entity_1 = require("../database/entities/network-node.entity");
const customer_entity_1 = require("../database/entities/customer.entity");
const service_connection_entity_1 = require("../database/entities/service-connection.entity");
let LookupService = LookupService_1 = class LookupService {
    constructor(utilityTypeRepository, tariffCategoryRepository, meterRepository, geoAreaRepository, networkNodeRepository, customerRepository, connectionRepository) {
        this.utilityTypeRepository = utilityTypeRepository;
        this.tariffCategoryRepository = tariffCategoryRepository;
        this.meterRepository = meterRepository;
        this.geoAreaRepository = geoAreaRepository;
        this.networkNodeRepository = networkNodeRepository;
        this.customerRepository = customerRepository;
        this.connectionRepository = connectionRepository;
        this.logger = new common_1.Logger(LookupService_1.name);
    }
    async getUtilityTypes() {
        return this.utilityTypeRepository.find({
            order: { name: 'ASC' },
        });
    }
    async getTariffCategories(utilityTypeId) {
        const where = utilityTypeId ? { utilityTypeId } : {};
        return this.tariffCategoryRepository.find({
            where,
            order: { code: 'ASC' },
        });
    }
    async getMeters(utilityTypeId) {
        const where = utilityTypeId ? { utilityTypeId } : {};
        return this.meterRepository.find({
            where,
            order: { meterSerialNo: 'ASC' },
        });
    }
    async getAvailableMeters(utilityTypeId) {
        const assignedMeterIds = await this.connectionRepository
            .createQueryBuilder('connection')
            .select('connection.meterId')
            .where('connection.meterId IS NOT NULL')
            .andWhere('connection.connectionStatus NOT IN (:...statuses)', {
            statuses: [service_connection_entity_1.ConnectionStatus.DISCONNECTED],
        })
            .getRawMany();
        const assignedIds = assignedMeterIds.map((r) => r.connection_meter_id).filter((id) => id);
        const queryBuilder = this.meterRepository.createQueryBuilder('meter');
        if (assignedIds.length > 0) {
            queryBuilder.where('meter.meterId NOT IN (:...assignedIds)', { assignedIds });
        }
        if (utilityTypeId) {
            queryBuilder.andWhere('meter.utilityTypeId = :utilityTypeId', { utilityTypeId });
        }
        queryBuilder.andWhere('meter.status IN (:...statuses)', {
            statuses: [meter_entity_1.MeterStatus.ACTIVE, meter_entity_1.MeterStatus.INACTIVE],
        });
        queryBuilder.orderBy('meter.meterSerialNo', 'ASC');
        return queryBuilder.getMany();
    }
    async getGeoAreas() {
        return this.geoAreaRepository.find({
            order: { name: 'ASC' },
        });
    }
    async getNetworkNodes(utilityTypeId) {
        const where = { status: 'ACTIVE' };
        if (utilityTypeId) {
            where.utilityTypeId = utilityTypeId;
        }
        return this.networkNodeRepository.find({
            where,
            order: { name: 'ASC' },
        });
    }
    async getCustomers(search, limit = 50) {
        const queryBuilder = this.customerRepository
            .createQueryBuilder('customer')
            .select([
            'customer.customerId',
            'customer.firstName',
            'customer.middleName',
            'customer.lastName',
            'customer.email',
            'customer.customerType',
            'customer.identityRef',
        ]);
        if (search) {
            queryBuilder.where('(customer.firstName LIKE :search OR customer.lastName LIKE :search OR customer.email LIKE :search OR customer.identityRef LIKE :search OR CAST(customer.customerId AS VARCHAR) LIKE :search)', { search: `%${search}%` });
        }
        queryBuilder.orderBy('customer.lastName', 'ASC').addOrderBy('customer.firstName', 'ASC');
        queryBuilder.take(limit);
        const customers = await queryBuilder.getMany();
        return customers.map((c) => ({
            customerId: c.customerId,
            fullName: [c.firstName, c.middleName, c.lastName].filter(Boolean).join(' '),
            email: c.email,
            customerType: c.customerType,
            identityRef: c.identityRef,
        }));
    }
};
exports.LookupService = LookupService;
exports.LookupService = LookupService = LookupService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(utility_type_entity_1.UtilityType)),
    __param(1, (0, typeorm_1.InjectRepository)(tariff_category_entity_1.TariffCategory)),
    __param(2, (0, typeorm_1.InjectRepository)(meter_entity_1.Meter)),
    __param(3, (0, typeorm_1.InjectRepository)(geo_area_entity_1.GeoArea)),
    __param(4, (0, typeorm_1.InjectRepository)(network_node_entity_1.NetworkNode)),
    __param(5, (0, typeorm_1.InjectRepository)(customer_entity_1.Customer)),
    __param(6, (0, typeorm_1.InjectRepository)(service_connection_entity_1.ServiceConnection)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], LookupService);
//# sourceMappingURL=lookup.service.js.map