import { ConnectionsService } from './connections.service';
import { CreateConnectionDto } from './dto/create-connection.dto';
import { UpdateConnectionDto } from './dto/update-connection.dto';
import { ConnectionResponseDto } from './dto/connection-response.dto';
import { ConnectionFilterDto } from './dto/connection-filter.dto';
import { Employee } from '../database/entities/employee.entity';
import { ConnectionStatus } from '../database/entities/service-connection.entity';
export declare class ConnectionsController {
    private readonly connectionsService;
    constructor(connectionsService: ConnectionsService);
    findAll(filters: ConnectionFilterDto): Promise<import("../common/dto").PaginatedResponseDto<ConnectionResponseDto>>;
    findOne(id: number): Promise<ConnectionResponseDto>;
    findByCustomer(customerId: number): Promise<ConnectionResponseDto[]>;
    getCustomerStats(customerId: number): Promise<{
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
    create(createDto: CreateConnectionDto, user: Employee): Promise<ConnectionResponseDto>;
    update(id: number, updateDto: UpdateConnectionDto): Promise<ConnectionResponseDto>;
    updateStatus(id: number, status: ConnectionStatus, user: Employee): Promise<ConnectionResponseDto>;
    assignMeter(id: number, meterId: number): Promise<ConnectionResponseDto>;
    remove(id: number): Promise<void>;
}
