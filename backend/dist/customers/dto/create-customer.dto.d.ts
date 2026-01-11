export declare enum CustomerType {
    RESIDENTIAL = "RESIDENTIAL",
    COMMERCIAL = "COMMERCIAL",
    INDUSTRIAL = "INDUSTRIAL",
    GOVERNMENT = "GOVERNMENT"
}
export declare enum IdentityType {
    NIC = "NIC",
    PASSPORT = "PASSPORT",
    DRIVING_LICENSE = "DRIVING_LICENSE",
    BUSINESS_REG = "BUSINESS_REG"
}
export declare class CreateCustomerAddressDto {
    postalCode: string;
    line1: string;
}
export declare class CreateCustomerDto {
    firstName: string;
    middleName?: string;
    lastName: string;
    email?: string;
    password: string;
    customerType: CustomerType;
    identityType: IdentityType;
    identityRef: string;
    address: CreateCustomerAddressDto;
    phoneNumbers?: string[];
    tariffCategoryId?: number;
}
