import { ServiceConnection, ConnectionStatus } from '../../database/entities/service-connection.entity';
export declare class ConnectionAddressResponseDto {
    connectionAddressId: number;
    line1: string;
    city: string;
    postalCode: string;
    geoAreaId: number;
    geoAreaName?: string;
}
export declare class UtilityTypeResponseDto {
    utilityTypeId: number;
    code: string;
    name: string;
}
export declare class TariffCategoryResponseDto {
    tariffCategoryId: number;
    code: string;
    name: string;
    isSubsidized: boolean;
}
export declare class MeterResponseDto {
    meterId: number;
    meterSerialNo: string;
    isSmartMeter: boolean;
    status: string;
}
export declare class CustomerInfoResponseDto {
    customerId: number;
    fullName: string;
    customerType: string;
    email?: string;
}
export declare class ConnectionResponseDto {
    connectionId: number;
    customerId: number;
    utilityTypeId: number;
    tariffCategoryId: number;
    connectionStatus: ConnectionStatus;
    meterId: number | null;
    connectionAddressId: number;
    nodeId: number | null;
    customer: CustomerInfoResponseDto;
    utilityType: UtilityTypeResponseDto;
    tariffCategory: TariffCategoryResponseDto;
    meter: MeterResponseDto | null;
    connectionAddress: ConnectionAddressResponseDto;
    static fromEntity(connection: ServiceConnection): ConnectionResponseDto;
    static fromEntities(connections: ServiceConnection[]): ConnectionResponseDto[];
}
