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
var ConnectionsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConnectionsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const service_connection_entity_1 = require("../database/entities/service-connection.entity");
const connection_address_entity_1 = require("../database/entities/connection-address.entity");
const meter_entity_1 = require("../database/entities/meter.entity");
const connection_response_dto_1 = require("./dto/connection-response.dto");
const service_connection_entity_2 = require("../database/entities/service-connection.entity");
const meter_entity_2 = require("../database/entities/meter.entity");
let ConnectionsService = ConnectionsService_1 = class ConnectionsService {
    constructor(connectionRepository, addressRepository, meterRepository, dataSource) {
        this.connectionRepository = connectionRepository;
        this.addressRepository = addressRepository;
        this.meterRepository = meterRepository;
        this.dataSource = dataSource;
        this.logger = new common_1.Logger(ConnectionsService_1.name);
    }
    async findAll(filters) {
        const { page = 1, limit = 10, sortBy = 'connectionId', order = 'DESC', customerId, utilityTypeId, connectionStatus, city, } = filters;
        const skip = (page - 1) * limit;
        const queryBuilder = this.connectionRepository
            .createQueryBuilder('connection')
            .leftJoinAndSelect('connection.customer', 'customer')
            .leftJoinAndSelect('connection.utilityType', 'utilityType')
            .leftJoinAndSelect('connection.tariffCategory', 'tariffCategory')
            .leftJoinAndSelect('connection.meter', 'meter')
            .leftJoinAndSelect('connection.connectionAddress', 'connectionAddress')
            .leftJoinAndSelect('connectionAddress.geoArea', 'geoArea')
            .leftJoinAndSelect('connection.networkNode', 'networkNode');
        if (customerId) {
            queryBuilder.andWhere('connection.customerId = :customerId', { customerId });
        }
        if (utilityTypeId) {
            queryBuilder.andWhere('connection.utilityTypeId = :utilityTypeId', {
                utilityTypeId,
            });
        }
        if (connectionStatus) {
            queryBuilder.andWhere('connection.connectionStatus = :connectionStatus', {
                connectionStatus,
            });
        }
        if (city) {
            queryBuilder.andWhere('connectionAddress.city LIKE :city', { city: `%${city}%` });
        }
        const validSortFields = [
            'connectionId',
            'connectionStatus',
            'customer.firstName',
            'customer.lastName',
        ];
        const sortField = validSortFields.includes(sortBy)
            ? `connection.${sortBy}`
            : 'connection.connectionId';
        queryBuilder.orderBy(sortField, order === 'DESC' ? 'DESC' : 'ASC');
        queryBuilder.skip(skip).take(limit);
        const [connections, total] = await queryBuilder.getManyAndCount();
        this.logger.log(`Found ${connections.length} connections out of ${total} total (page ${page})`);
        const items = connections.map((connection) => connection_response_dto_1.ConnectionResponseDto.fromEntity(connection));
        return {
            items,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
                hasNextPage: page * limit < total,
                hasPreviousPage: page > 1,
            },
        };
    }
    async findOne(id) {
        const connection = await this.connectionRepository.findOne({
            where: { connectionId: id },
            relations: [
                'customer',
                'customer.address',
                'customer.phoneNumbers',
                'utilityType',
                'tariffCategory',
                'meter',
                'connectionAddress',
                'connectionAddress.geoArea',
                'networkNode',
            ],
        });
        if (!connection) {
            this.logger.warn(`Connection with ID ${id} not found`);
            throw new common_1.NotFoundException(`Service connection with ID ${id} not found`);
        }
        this.logger.log(`Retrieved connection ${id} for customer ${connection.customerId}`);
        return connection_response_dto_1.ConnectionResponseDto.fromEntity(connection);
    }
    async findByCustomer(customerId) {
        const connections = await this.connectionRepository.find({
            where: { customerId },
            relations: [
                'utilityType',
                'tariffCategory',
                'meter',
                'connectionAddress',
                'connectionAddress.geoArea',
                'networkNode',
            ],
            order: { connectionId: 'DESC' },
        });
        this.logger.log(`Found ${connections.length} connections for customer ${customerId}`);
        return connections.map((connection) => connection_response_dto_1.ConnectionResponseDto.fromEntity(connection));
    }
    async create(createDto, employeeId) {
        if (createDto.meterId) {
            await this.validateMeterAvailability(createDto.meterId);
        }
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const address = this.addressRepository.create({
                line1: createDto.connectionAddress.line1,
                city: createDto.connectionAddress.city,
                postalCode: createDto.connectionAddress.postalCode,
                geoAreaId: createDto.connectionAddress.geoAreaId,
            });
            const savedAddress = await queryRunner.manager.save(address);
            const connection = this.connectionRepository.create({
                customerId: createDto.customerId,
                utilityTypeId: createDto.utilityTypeId,
                tariffCategoryId: createDto.tariffCategoryId,
                connectionStatus: service_connection_entity_2.ConnectionStatus.PENDING,
                meterId: createDto.meterId || null,
                connectionAddressId: savedAddress.connectionAddressId,
                nodeId: createDto.nodeId || null,
            });
            const savedConnection = await queryRunner.manager.save(connection);
            if (createDto.meterId) {
                await queryRunner.manager.update(meter_entity_1.Meter, { meterId: createDto.meterId }, { status: meter_entity_2.MeterStatus.ACTIVE });
            }
            await queryRunner.commitTransaction();
            this.logger.log(`Created connection ${savedConnection.connectionId} for customer ${createDto.customerId}`);
            return await this.findOne(savedConnection.connectionId);
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            this.logger.error(`Failed to create connection: ${error.message}`, error.stack);
            throw error;
        }
        finally {
            await queryRunner.release();
        }
    }
    async update(id, updateDto) {
        const existingConnection = await this.connectionRepository.findOne({
            where: { connectionId: id },
            relations: ['meter'],
        });
        if (!existingConnection) {
            throw new common_1.NotFoundException(`Service connection with ID ${id} not found`);
        }
        if (updateDto.meterId && updateDto.meterId !== existingConnection.meterId) {
            await this.validateMeterAvailability(updateDto.meterId, id);
        }
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            if (updateDto.connectionAddress) {
                await queryRunner.manager.update(connection_address_entity_1.ConnectionAddress, { connectionAddressId: existingConnection.connectionAddressId }, {
                    line1: updateDto.connectionAddress.line1,
                    city: updateDto.connectionAddress.city,
                    postalCode: updateDto.connectionAddress.postalCode,
                    geoAreaId: updateDto.connectionAddress.geoAreaId,
                });
            }
            const updateData = {};
            if (updateDto.utilityTypeId !== undefined) {
                updateData.utilityTypeId = updateDto.utilityTypeId;
            }
            if (updateDto.tariffCategoryId !== undefined) {
                updateData.tariffCategoryId = updateDto.tariffCategoryId;
            }
            if (updateDto.connectionStatus !== undefined) {
                updateData.connectionStatus = updateDto.connectionStatus;
            }
            if (updateDto.nodeId !== undefined) {
                updateData.nodeId = updateDto.nodeId;
            }
            if (updateDto.meterId !== undefined && updateDto.meterId !== existingConnection.meterId) {
                if (existingConnection.meterId) {
                    await queryRunner.manager.update(meter_entity_1.Meter, { meterId: existingConnection.meterId }, { status: meter_entity_2.MeterStatus.INACTIVE });
                }
                if (updateDto.meterId) {
                    await queryRunner.manager.update(meter_entity_1.Meter, { meterId: updateDto.meterId }, { status: meter_entity_2.MeterStatus.ACTIVE });
                }
                updateData.meterId = updateDto.meterId;
            }
            if (Object.keys(updateData).length > 0) {
                await queryRunner.manager.update(service_connection_entity_1.ServiceConnection, { connectionId: id }, updateData);
            }
            await queryRunner.commitTransaction();
            this.logger.log(`Updated connection ${id}`);
            return await this.findOne(id);
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            this.logger.error(`Failed to update connection ${id}: ${error.message}`, error.stack);
            throw error;
        }
        finally {
            await queryRunner.release();
        }
    }
    async updateStatus(id, status, employeeId) {
        const connection = await this.connectionRepository.findOne({
            where: { connectionId: id },
        });
        if (!connection) {
            throw new common_1.NotFoundException(`Service connection with ID ${id} not found`);
        }
        this.validateStatusTransition(connection.connectionStatus, status);
        await this.connectionRepository.update({ connectionId: id }, { connectionStatus: status });
        this.logger.log(`Updated connection ${id} status from ${connection.connectionStatus} to ${status}${employeeId ? ` by employee ${employeeId}` : ''}`);
        return await this.findOne(id);
    }
    async assignMeter(connectionId, meterId) {
        await this.validateMeterAvailability(meterId);
        const connection = await this.connectionRepository.findOne({
            where: { connectionId },
            relations: ['meter'],
        });
        if (!connection) {
            throw new common_1.NotFoundException(`Service connection with ID ${connectionId} not found`);
        }
        if (connection.meterId) {
            throw new common_1.ConflictException(`Connection ${connectionId} already has meter ${connection.meterId} assigned`);
        }
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            await queryRunner.manager.update(service_connection_entity_1.ServiceConnection, { connectionId }, { meterId });
            await queryRunner.manager.update(meter_entity_1.Meter, { meterId }, { status: meter_entity_2.MeterStatus.ACTIVE });
            await queryRunner.commitTransaction();
            this.logger.log(`Assigned meter ${meterId} to connection ${connectionId}`);
            return await this.findOne(connectionId);
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            this.logger.error(`Failed to assign meter ${meterId} to connection ${connectionId}: ${error.message}`, error.stack);
            throw error;
        }
        finally {
            await queryRunner.release();
        }
    }
    async remove(id) {
        const connection = await this.connectionRepository.findOne({
            where: { connectionId: id },
        });
        if (!connection) {
            throw new common_1.NotFoundException(`Service connection with ID ${id} not found`);
        }
        await this.connectionRepository.update({ connectionId: id }, { connectionStatus: service_connection_entity_2.ConnectionStatus.DISCONNECTED });
        this.logger.log(`Soft deleted connection ${id} (marked as DISCONNECTED)`);
    }
    async getCustomerConnectionStats(customerId) {
        const connections = await this.connectionRepository.find({
            where: { customerId },
            relations: ['utilityType'],
        });
        const stats = {
            total: connections.length,
            active: connections.filter((c) => c.connectionStatus === service_connection_entity_2.ConnectionStatus.ACTIVE).length,
            pending: connections.filter((c) => c.connectionStatus === service_connection_entity_2.ConnectionStatus.PENDING).length,
            suspended: connections.filter((c) => c.connectionStatus === service_connection_entity_2.ConnectionStatus.SUSPENDED)
                .length,
            disconnected: connections.filter((c) => c.connectionStatus === service_connection_entity_2.ConnectionStatus.DISCONNECTED)
                .length,
            byUtilityType: [],
        };
        const utilityTypeMap = new Map();
        connections.forEach((connection) => {
            const existing = utilityTypeMap.get(connection.utilityTypeId);
            if (existing) {
                existing.count++;
            }
            else {
                utilityTypeMap.set(connection.utilityTypeId, {
                    name: connection.utilityType?.name || 'Unknown',
                    count: 1,
                });
            }
        });
        stats.byUtilityType = Array.from(utilityTypeMap.entries()).map(([id, data]) => ({
            utilityTypeId: id,
            utilityTypeName: data.name,
            count: data.count,
        }));
        return stats;
    }
    async validateMeterAvailability(meterId, excludeConnectionId) {
        const meter = await this.meterRepository.findOne({
            where: { meterId },
        });
        if (!meter) {
            throw new common_1.NotFoundException(`Meter with ID ${meterId} not found`);
        }
        const whereCondition = {
            meterId,
            connectionStatus: (0, typeorm_2.Not)(service_connection_entity_2.ConnectionStatus.DISCONNECTED),
        };
        if (excludeConnectionId) {
            whereCondition.connectionId = (0, typeorm_2.Not)(excludeConnectionId);
        }
        const existingConnection = await this.connectionRepository.findOne({
            where: whereCondition,
        });
        if (existingConnection) {
            throw new common_1.ConflictException(`Meter ${meterId} is already assigned to connection ${existingConnection.connectionId}`);
        }
        if (meter.status === meter_entity_2.MeterStatus.FAULTY) {
            throw new common_1.BadRequestException(`Meter ${meterId} is faulty and cannot be assigned`);
        }
    }
    validateStatusTransition(currentStatus, newStatus) {
        const validTransitions = {
            [service_connection_entity_2.ConnectionStatus.PENDING]: [service_connection_entity_2.ConnectionStatus.ACTIVE, service_connection_entity_2.ConnectionStatus.DISCONNECTED],
            [service_connection_entity_2.ConnectionStatus.ACTIVE]: [service_connection_entity_2.ConnectionStatus.SUSPENDED, service_connection_entity_2.ConnectionStatus.DISCONNECTED],
            [service_connection_entity_2.ConnectionStatus.SUSPENDED]: [service_connection_entity_2.ConnectionStatus.ACTIVE, service_connection_entity_2.ConnectionStatus.DISCONNECTED],
            [service_connection_entity_2.ConnectionStatus.DISCONNECTED]: [service_connection_entity_2.ConnectionStatus.ACTIVE],
            [service_connection_entity_2.ConnectionStatus.INACTIVE]: [service_connection_entity_2.ConnectionStatus.ACTIVE],
        };
        const allowedTransitions = validTransitions[currentStatus] || [];
        if (!allowedTransitions.includes(newStatus)) {
            throw new common_1.BadRequestException(`Invalid status transition from ${currentStatus} to ${newStatus}`);
        }
    }
};
exports.ConnectionsService = ConnectionsService;
exports.ConnectionsService = ConnectionsService = ConnectionsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(service_connection_entity_1.ServiceConnection)),
    __param(1, (0, typeorm_1.InjectRepository)(connection_address_entity_1.ConnectionAddress)),
    __param(2, (0, typeorm_1.InjectRepository)(meter_entity_1.Meter)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.DataSource])
], ConnectionsService);
//# sourceMappingURL=connections.service.js.map