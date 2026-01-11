import { GeoArea } from './geo-area.entity';
export declare class ConnectionAddress {
    connectionAddressId: number;
    line1: string;
    city: string;
    postalCode: string;
    geoAreaId: number;
    geoArea: GeoArea;
    get fullAddress(): string;
}
