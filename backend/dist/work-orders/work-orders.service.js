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
exports.WorkOrdersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const work_order_entity_1 = require("../database/entities/work-order.entity");
let WorkOrdersService = class WorkOrdersService {
    constructor(workOrderRepository) {
        this.workOrderRepository = workOrderRepository;
    }
    async create(createDto) {
        const workOrder = this.workOrderRepository.create({
            openedTs: new Date(createDto.openedTs),
            scheduledStartTs: createDto.scheduledStartTs ? new Date(createDto.scheduledStartTs) : null,
            scheduledEndTs: createDto.scheduledEndTs ? new Date(createDto.scheduledEndTs) : null,
            workOrderStatus: createDto.workOrderStatus,
            resolutionNotes: createDto.resolutionNotes || null,
            assetId: createDto.assetId || null,
            requestId: createDto.requestId || null,
            geoAreaId: createDto.geoAreaId,
        });
        const saved = await this.workOrderRepository.save(workOrder);
        return this.toResponseDto(await this.findOne(saved.workOrderId));
    }
    async findAll(filters) {
        const { status, assetId, requestId, geoAreaId, startDate, endDate, page = 1, limit = 10, sortBy = 'workOrderId', order = 'DESC' } = filters;
        const queryBuilder = this.workOrderRepository
            .createQueryBuilder('workOrder')
            .leftJoinAndSelect('workOrder.asset', 'asset')
            .leftJoinAndSelect('workOrder.request', 'request')
            .leftJoinAndSelect('workOrder.geoArea', 'geoArea')
            .leftJoinAndSelect('workOrder.laborEntries', 'laborEntries')
            .leftJoinAndSelect('workOrder.itemUsages', 'itemUsages');
        if (status) {
            queryBuilder.andWhere('workOrder.workOrderStatus = :status', { status });
        }
        if (assetId) {
            queryBuilder.andWhere('workOrder.assetId = :assetId', { assetId });
        }
        if (requestId) {
            queryBuilder.andWhere('workOrder.requestId = :requestId', { requestId });
        }
        if (geoAreaId) {
            queryBuilder.andWhere('workOrder.geoAreaId = :geoAreaId', { geoAreaId });
        }
        if (startDate) {
            queryBuilder.andWhere('workOrder.openedTs >= :startDate', { startDate: new Date(startDate) });
        }
        if (endDate) {
            queryBuilder.andWhere('workOrder.openedTs <= :endDate', { endDate: new Date(endDate) });
        }
        const total = await queryBuilder.getCount();
        const workOrders = await queryBuilder
            .orderBy(`workOrder.${sortBy}`, order)
            .skip((page - 1) * limit)
            .take(limit)
            .getMany();
        return {
            data: workOrders.map(wo => this.toResponseDto(wo)),
            total,
            page,
            limit,
        };
    }
    async findOne(id) {
        const workOrder = await this.workOrderRepository.findOne({
            where: { workOrderId: id },
            relations: ['asset', 'request', 'geoArea', 'laborEntries', 'itemUsages'],
        });
        if (!workOrder) {
            throw new common_1.NotFoundException(`Work order with ID ${id} not found`);
        }
        return workOrder;
    }
    async update(id, updateDto) {
        await this.findOne(id);
        const updateData = {};
        if (updateDto.openedTs)
            updateData.openedTs = new Date(updateDto.openedTs);
        if (updateDto.scheduledStartTs)
            updateData.scheduledStartTs = new Date(updateDto.scheduledStartTs);
        if (updateDto.scheduledEndTs)
            updateData.scheduledEndTs = new Date(updateDto.scheduledEndTs);
        if (updateDto.workOrderStatus)
            updateData.workOrderStatus = updateDto.workOrderStatus;
        if (updateDto.resolutionNotes !== undefined)
            updateData.resolutionNotes = updateDto.resolutionNotes;
        if (updateDto.assetId !== undefined)
            updateData.assetId = updateDto.assetId;
        if (updateDto.requestId !== undefined)
            updateData.requestId = updateDto.requestId;
        if (updateDto.geoAreaId)
            updateData.geoAreaId = updateDto.geoAreaId;
        await this.workOrderRepository.update(id, updateData);
        return this.toResponseDto(await this.findOne(id));
    }
    async updateStatus(id, status, notes) {
        const workOrder = await this.findOne(id);
        workOrder.workOrderStatus = status;
        if (notes) {
            workOrder.resolutionNotes = notes;
        }
        if (status === work_order_entity_1.WorkOrderStatus.COMPLETED || status === work_order_entity_1.WorkOrderStatus.CANCELLED) {
            workOrder.closedTs = new Date();
        }
        await this.workOrderRepository.save(workOrder);
        return this.toResponseDto(await this.findOne(id));
    }
    async complete(id, resolutionNotes) {
        return this.updateStatus(id, work_order_entity_1.WorkOrderStatus.COMPLETED, resolutionNotes);
    }
    async cancel(id, reason) {
        return this.updateStatus(id, work_order_entity_1.WorkOrderStatus.CANCELLED, reason);
    }
    async getStatistics(filters) {
        const queryBuilder = this.workOrderRepository.createQueryBuilder('workOrder');
        if (filters?.startDate) {
            queryBuilder.andWhere('workOrder.openedTs >= :startDate', { startDate: new Date(filters.startDate) });
        }
        if (filters?.endDate) {
            queryBuilder.andWhere('workOrder.openedTs <= :endDate', { endDate: new Date(filters.endDate) });
        }
        const total = await queryBuilder.getCount();
        const open = await queryBuilder.andWhere('workOrder.workOrderStatus = :status', { status: work_order_entity_1.WorkOrderStatus.OPEN }).getCount();
        const inProgress = await this.workOrderRepository.count({ where: { workOrderStatus: work_order_entity_1.WorkOrderStatus.IN_PROGRESS } });
        const completed = await this.workOrderRepository.count({ where: { workOrderStatus: work_order_entity_1.WorkOrderStatus.COMPLETED } });
        return {
            total,
            open,
            inProgress,
            completed,
            cancelled: total - open - inProgress - completed,
        };
    }
    toResponseDto(workOrder) {
        return {
            workOrderId: workOrder.workOrderId,
            openedTs: workOrder.openedTs,
            scheduledStartTs: workOrder.scheduledStartTs ?? undefined,
            scheduledEndTs: workOrder.scheduledEndTs ?? undefined,
            closedTs: workOrder.closedTs ?? undefined,
            workOrderStatus: workOrder.workOrderStatus,
            resolutionNotes: workOrder.resolutionNotes ?? undefined,
            assetId: workOrder.assetId ?? undefined,
            requestId: workOrder.requestId ?? undefined,
            geoAreaId: workOrder.geoAreaId,
            asset: workOrder.asset,
            request: workOrder.request,
            geoArea: workOrder.geoArea,
            totalLaborCost: workOrder.totalLaborCost,
            totalItemCost: workOrder.totalItemCost,
            totalCost: workOrder.totalCost,
            durationHours: workOrder.durationHours ?? undefined,
            laborEntries: workOrder.laborEntries,
            itemUsages: workOrder.itemUsages,
        };
    }
};
exports.WorkOrdersService = WorkOrdersService;
exports.WorkOrdersService = WorkOrdersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(work_order_entity_1.WorkOrder)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], WorkOrdersService);
//# sourceMappingURL=work-orders.service.js.map