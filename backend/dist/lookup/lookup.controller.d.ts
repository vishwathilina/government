import { LookupService } from './lookup.service';
export declare class LookupController {
    private readonly lookupService;
    constructor(lookupService: LookupService);
    getUtilityTypes(): Promise<import("../database/entities").UtilityType[]>;
    getTariffCategories(utilityTypeId?: string): Promise<import("../database/entities").TariffCategory[]>;
    getMeters(utilityTypeId?: string): Promise<import("../database/entities").Meter[]>;
    getAvailableMeters(utilityTypeId?: string): Promise<import("../database/entities").Meter[]>;
    getGeoAreas(): Promise<import("../database/entities").GeoArea[]>;
    getNetworkNodes(utilityTypeId?: string): Promise<import("../database/entities").NetworkNode[]>;
    getCustomers(search?: string, limit?: string): Promise<{
        customerId: number;
        fullName: string;
        email: string | null;
        customerType: string;
        identityRef: string;
    }[]>;
}
