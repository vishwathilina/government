import { Repository, DataSource } from 'typeorm';
import { ServiceConnection } from '../database/entities/service-connection.entity';
import { ConnectionAddress } from '../database/entities/connection-address.entity';
import { Meter } from '../database/entities/meter.entity';
import { CreateConnectionDto } from './dto/create-connection.dto';
import { UpdateConnectionDto } from './dto/update-connection.dto';
import { ConnectionResponseDto } from './dto/connection-response.dto';
import { ConnectionFilterDto } from './dto/connection-filter.dto';
import { PaginatedResponseDto } from '../common/dto/pagination.dto';
import { ConnectionStatus } from '../database/entities/service-connection.entity';
export declare class ConnectionsService {
    private connectionRepository;
    private addressRepository;
    private meterRepository;
    private dataSource;
    private readonly logger;
    constructor(connectionRepository: Repository<ServiceConnection>, addressRepository: Repository<ConnectionAddress>, meterRepository: Repository<Meter>, dataSource: DataSource);
    findAll(filters: ConnectionFilterDto): Promise<PaginatedResponseDto<ConnectionResponseDto>>;
    findOne(id: number): Promise<ConnectionResponseDto>;
    findByCustomer(customerId: number): Promise<ConnectionResponseDto[]>;
    create(createDto: CreateConnectionDto, employeeId?: number): Promise<ConnectionResponseDto>;
    update(id: number, updateDto: UpdateConnectionDto): Promise<ConnectionResponseDto>;
    updateStatus(id: number, status: ConnectionStatus, employeeId?: number): Promise<ConnectionResponseDto>;
    assignMeter(connectionId: number, meterId: number): Promise<ConnectionResponseDto>;
    remove(id: number): Promise<void>;
    getCustomerConnectionStats(customerId: number): Promise<{
        total: number;
        active: number;
        pending: number;
        suspended: number;
        disconnected: number;
        byUtilityType: {
            utilityTypeId: number;
            utilityTypeName: string;
            count: number;
        }[];
    }>;
    private validateMeterAvailability;
    private validateStatusTransition;
}
