import { CreateConnectionAddressDto } from './create-connection-address.dto';
export declare class CreateConnectionDto {
    customerId: number;
    utilityTypeId: number;
    tariffCategoryId: number;
    connectionAddress: CreateConnectionAddressDto;
    meterId?: number;
    nodeId?: number;
}
