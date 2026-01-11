import { Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { Customer } from '../../database/entities/customer.entity';
export interface CustomerJwtPayload {
    sub: number;
    email: string;
    type: 'customer';
}
declare const CustomerJwtStrategy_base: new (...args: any[]) => Strategy;
export declare class CustomerJwtStrategy extends CustomerJwtStrategy_base {
    private readonly configService;
    private readonly customerRepository;
    constructor(configService: ConfigService, customerRepository: Repository<Customer>);
    validate(payload: CustomerJwtPayload): Promise<{
        sub: number;
        customerId: number;
        email: string | null;
        firstName: string;
        lastName: string;
        fullName: string;
        customerType: string;
        type: string;
    }>;
}
export {};
