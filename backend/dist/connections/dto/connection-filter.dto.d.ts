import { ConnectionStatus } from '../../database/entities/service-connection.entity';
export declare class ConnectionFilterDto {
    customerId?: number;
    utilityTypeId?: number;
    tariffCategoryId?: number;
    connectionStatus?: ConnectionStatus;
    city?: string;
    meterSerial?: string;
    customerName?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    order?: 'ASC' | 'DESC';
}
