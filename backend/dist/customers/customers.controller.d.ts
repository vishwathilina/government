import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { CustomerResponseDto } from './dto/customer-response.dto';
import { Employee } from '../database/entities/employee.entity';
import { ApiResponseDto } from '../common/dto/api-response.dto';
import { PaginatedResponseDto } from '../common/dto/pagination.dto';
export declare class CustomersController {
    private readonly customersService;
    constructor(customersService: CustomersService);
    create(createCustomerDto: CreateCustomerDto, user: Employee): Promise<ApiResponseDto<CustomerResponseDto>>;
    findAll(page?: number, limit?: number, sortBy?: string, order?: 'ASC' | 'DESC', customerType?: string, search?: string): Promise<ApiResponseDto<PaginatedResponseDto<CustomerResponseDto>>>;
    getCountByType(): Promise<ApiResponseDto<{
        type: string;
        count: number;
    }[]>>;
    findById(id: number): Promise<ApiResponseDto<CustomerResponseDto>>;
    findByIdentityRef(identityRef: string): Promise<ApiResponseDto<CustomerResponseDto>>;
    update(id: number, updateCustomerDto: UpdateCustomerDto): Promise<ApiResponseDto<CustomerResponseDto>>;
    delete(id: number): Promise<ApiResponseDto<null>>;
}
