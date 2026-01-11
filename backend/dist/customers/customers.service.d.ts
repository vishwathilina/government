import { Repository, DataSource } from 'typeorm';
import { Customer } from '../database/entities/customer.entity';
import { CustomerAddress } from '../database/entities/customer-address.entity';
import { CustomerPhone } from '../database/entities/customer-phone.entity';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { CustomerResponseDto } from './dto/customer-response.dto';
import { PaginationQueryDto, PaginatedResponseDto } from '../common/dto/pagination.dto';
export declare class CustomersService {
    private customerRepository;
    private addressRepository;
    private phoneRepository;
    private dataSource;
    constructor(customerRepository: Repository<Customer>, addressRepository: Repository<CustomerAddress>, phoneRepository: Repository<CustomerPhone>, dataSource: DataSource);
    create(createCustomerDto: CreateCustomerDto, employeeId?: number): Promise<CustomerResponseDto>;
    findAll(query: PaginationQueryDto & {
        customerType?: string;
        search?: string;
    }): Promise<PaginatedResponseDto<CustomerResponseDto>>;
    findById(id: number): Promise<CustomerResponseDto>;
    findByIdentityRef(identityRef: string): Promise<CustomerResponseDto>;
    update(id: number, updateCustomerDto: UpdateCustomerDto): Promise<CustomerResponseDto>;
    delete(id: number): Promise<void>;
    getCountByType(): Promise<{
        type: string;
        count: number;
    }[]>;
}
