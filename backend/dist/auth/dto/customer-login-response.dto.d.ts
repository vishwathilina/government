export declare class CustomerInfoDto {
    customerId: number;
    firstName: string;
    middleName: string | null;
    lastName: string;
    fullName: string;
    email: string | null;
    customerType: string;
}
export declare class CustomerLoginResponseDto {
    accessToken: string;
    tokenType: string;
    customer: CustomerInfoDto;
}
