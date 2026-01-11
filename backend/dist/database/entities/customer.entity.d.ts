import { CustomerAddress } from './customer-address.entity';
import { CustomerPhone } from './customer-phone.entity';
import { Employee } from './employee.entity';
import { TariffCategory } from './tariff-category.entity';
import { ServiceConnection } from './service-connection.entity';
export declare class Customer {
    customerId: number;
    firstName: string;
    middleName: string | null;
    lastName: string;
    passwordHash: string;
    email: string | null;
    customerAddressId: number;
    customerType: string;
    registrationDate: Date;
    identityType: string;
    identityRef: string;
    employeeId: number | null;
    tariffCategoryId: number | null;
    address: CustomerAddress;
    registeredBy: Employee;
    tariffCategory: TariffCategory | null;
    phoneNumbers: CustomerPhone[];
    serviceConnections: ServiceConnection[];
    get fullName(): string;
}
