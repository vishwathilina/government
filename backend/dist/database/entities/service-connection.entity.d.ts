import { Customer } from './customer.entity';
import { UtilityType } from './utility-type.entity';
import { TariffCategory } from './tariff-category.entity';
import { Meter } from './meter.entity';
import { ConnectionAddress } from './connection-address.entity';
import { NetworkNode } from './network-node.entity';
export declare enum ConnectionStatus {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
    SUSPENDED = "SUSPENDED",
    DISCONNECTED = "DISCONNECTED",
    PENDING = "PENDING"
}
export declare class ServiceConnection {
    connectionDate: Date | null;
    connectionId: number;
    customerId: number;
    utilityTypeId: number;
    tariffCategoryId: number;
    connectionStatus: ConnectionStatus;
    meterId: number | null;
    connectionAddressId: number;
    nodeId: number | null;
    customer: Customer;
    utilityType: UtilityType;
    tariffCategory: TariffCategory;
    meter: Meter | null;
    connectionAddress: ConnectionAddress;
    networkNode: NetworkNode | null;
}
