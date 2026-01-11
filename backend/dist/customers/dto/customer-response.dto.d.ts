import { Customer } from '../../database/entities/customer.entity';
export declare class CustomerAddressResponseDto {
    customerAddressId: number;
    postalCode: string;
    line1: string;
}
export declare class CustomerResponseDto {
    customerId: number;
    firstName: string;
    middleName: string | null;
    lastName: string;
    fullName: string;
    email: string | null;
    customerType: string;
    registrationDate: Date;
    identityType: string;
    identityRef: string;
    tariffCategoryId: number | null;
    employeeId: number | null;
    address: CustomerAddressResponseDto;
    phoneNumbers: string[];
    static fromEntity(customer: Customer): CustomerResponseDto;
}
