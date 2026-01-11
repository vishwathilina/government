import { Repository } from 'typeorm';
import { UtilityType } from '../database/entities/utility-type.entity';
import { TariffCategory } from '../database/entities/tariff-category.entity';
import { Meter } from '../database/entities/meter.entity';
import { GeoArea } from '../database/entities/geo-area.entity';
import { NetworkNode } from '../database/entities/network-node.entity';
import { Customer } from '../database/entities/customer.entity';
import { ServiceConnection } from '../database/entities/service-connection.entity';
export declare class LookupService {
    private utilityTypeRepository;
    private tariffCategoryRepository;
    private meterRepository;
    private geoAreaRepository;
    private networkNodeRepository;
    private customerRepository;
    private connectionRepository;
    private readonly logger;
    constructor(utilityTypeRepository: Repository<UtilityType>, tariffCategoryRepository: Repository<TariffCategory>, meterRepository: Repository<Meter>, geoAreaRepository: Repository<GeoArea>, networkNodeRepository: Repository<NetworkNode>, customerRepository: Repository<Customer>, connectionRepository: Repository<ServiceConnection>);
    getUtilityTypes(): Promise<UtilityType[]>;
    getTariffCategories(utilityTypeId?: number): Promise<TariffCategory[]>;
    getMeters(utilityTypeId?: number): Promise<Meter[]>;
    getAvailableMeters(utilityTypeId?: number): Promise<Meter[]>;
    getGeoAreas(): Promise<GeoArea[]>;
    getNetworkNodes(utilityTypeId?: number): Promise<NetworkNode[]>;
    getCustomers(search?: string, limit?: number): Promise<{
        customerId: number;
        fullName: string;
        email: string | null;
        customerType: string;
        identityRef: string;
    }[]>;
}
