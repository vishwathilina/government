import { CreateCustomerDto } from './create-customer.dto';
declare const UpdateCustomerDto_base: import("@nestjs/common").Type<Partial<Omit<CreateCustomerDto, "identityRef" | "password">>>;
export declare class UpdateCustomerDto extends UpdateCustomerDto_base {
    password?: string;
}
export {};
