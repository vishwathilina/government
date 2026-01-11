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
exports.ComplaintsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const complaint_entity_1 = require("../database/entities/complaint.entity");
let ComplaintsService = class ComplaintsService {
    constructor(complaintRepository) {
        this.complaintRepository = complaintRepository;
    }
    async create(createDto) {
        const complaint = this.complaintRepository.create({
            customerId: createDto.customerId,
            complaintType: createDto.complaintType,
            description: createDto.description,
            createdDate: new Date(),
            status: complaint_entity_1.ComplaintStatus.OPEN,
        });
        const saved = await this.complaintRepository.save(complaint);
        return this.toResponseDto(await this.findOne(saved.complaintId));
    }
    async findAll(filters) {
        const { status, customerId, assignedEmployeeId, complaintType, page = 1, limit = 10, sortBy = 'complaintId', order = 'DESC' } = filters;
        const queryBuilder = this.complaintRepository
            .createQueryBuilder('complaint')
            .leftJoinAndSelect('complaint.customer', 'customer')
            .leftJoinAndSelect('complaint.assignedEmployee', 'assignedEmployee');
        if (status) {
            queryBuilder.andWhere('complaint.status = :status', { status });
        }
        if (customerId) {
            queryBuilder.andWhere('complaint.customerId = :customerId', { customerId });
        }
        if (assignedEmployeeId) {
            queryBuilder.andWhere('complaint.assignedEmployeeId = :assignedEmployeeId', { assignedEmployeeId });
        }
        if (complaintType) {
            queryBuilder.andWhere('complaint.complaintType = :complaintType', { complaintType });
        }
        const total = await queryBuilder.getCount();
        const complaints = await queryBuilder
            .orderBy(`complaint.${sortBy}`, order)
            .skip((page - 1) * limit)
            .take(limit)
            .getMany();
        return {
            data: complaints.map(c => this.toResponseDto(c)),
            total,
            page,
            limit,
        };
    }
    async findOne(id) {
        const complaint = await this.complaintRepository.findOne({
            where: { complaintId: id },
            relations: ['customer', 'assignedEmployee'],
        });
        if (!complaint) {
            throw new common_1.NotFoundException(`Complaint with ID ${id} not found`);
        }
        return complaint;
    }
    async update(id, updateDto) {
        await this.findOne(id);
        await this.complaintRepository.update(id, updateDto);
        return this.toResponseDto(await this.findOne(id));
    }
    async assign(id, employeeId) {
        const complaint = await this.findOne(id);
        complaint.assignedEmployeeId = employeeId;
        complaint.status = complaint_entity_1.ComplaintStatus.ASSIGNED;
        await this.complaintRepository.save(complaint);
        return this.toResponseDto(await this.findOne(id));
    }
    async resolve(id) {
        const complaint = await this.findOne(id);
        complaint.status = complaint_entity_1.ComplaintStatus.RESOLVED;
        complaint.resolvedDate = new Date();
        await this.complaintRepository.save(complaint);
        return this.toResponseDto(await this.findOne(id));
    }
    async close(id) {
        const complaint = await this.findOne(id);
        complaint.status = complaint_entity_1.ComplaintStatus.CLOSED;
        if (!complaint.resolvedDate) {
            complaint.resolvedDate = new Date();
        }
        await this.complaintRepository.save(complaint);
        return this.toResponseDto(await this.findOne(id));
    }
    toResponseDto(complaint) {
        return {
            complaintId: complaint.complaintId,
            customerId: complaint.customerId,
            assignedEmployeeId: complaint.assignedEmployeeId ?? undefined,
            complaintType: complaint.complaintType,
            createdDate: complaint.createdDate,
            resolvedDate: complaint.resolvedDate ?? undefined,
            status: complaint.status,
            description: complaint.description,
            customer: complaint.customer,
            assignedEmployee: complaint.assignedEmployee,
            resolutionTimeHours: complaint.resolutionTimeHours ?? undefined,
        };
    }
};
exports.ComplaintsService = ComplaintsService;
exports.ComplaintsService = ComplaintsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(complaint_entity_1.Complaint)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ComplaintsService);
//# sourceMappingURL=complaints.service.js.map