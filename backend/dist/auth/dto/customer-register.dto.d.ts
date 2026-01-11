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
export declare class CustomerRegisterAddressDto {
    postalCode: string;
    line1: string;
}
export declare class CustomerRegisterDto {
    firstName: string;
    middleName?: string;
    lastName: string;
    email: string;
    password: string;
    customerType: CustomerType;
    identityType: IdentityType;
    identityRef: string;
    address: CustomerRegisterAddressDto;
    phoneNumbers?: string[];
}
export declare class CustomerRegisterResponseDto {
    success: boolean;
    message: string;
    data: {
        customerId: number;
        firstName: string;
        lastName: string;
        email: string;
        customerType: string;
    };
}
