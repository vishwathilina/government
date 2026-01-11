import { Repository } from 'typeorm';
import { Employee } from '../database/entities/employee.entity';
import { Customer } from '../database/entities/customer.entity';
import { ServiceConnection } from '../database/entities/service-connection.entity';
import { Bill } from '../database/entities/bill.entity';
import { Payment } from '../database/entities/payment.entity';
import { UtilityType } from '../database/entities/utility-type.entity';
import { DashboardStatsDto } from './dto/dashboard-stats.dto';
import { CreateEmployeeDto, UpdateEmployeeDto } from './dto/create-employee.dto';
export declare class EmployeesService {
    private readonly employeeRepository;
    private readonly customerRepository;
    private readonly connectionRepository;
    private readonly billRepository;
    private readonly paymentRepository;
    private readonly utilityTypeRepository;
    constructor(employeeRepository: Repository<Employee>, customerRepository: Repository<Customer>, connectionRepository: Repository<ServiceConnection>, billRepository: Repository<Bill>, paymentRepository: Repository<Payment>, utilityTypeRepository: Repository<UtilityType>);
    findByUsername(username: string): Promise<Employee | null>;
    findByEmail(email: string): Promise<Employee | null>;
    findById(employeeId: number): Promise<Employee | null>;
    findByIdOrFail(employeeId: number): Promise<Employee>;
    updateLastLogin(employeeId: number): Promise<void>;
    findAll(page?: number, limit?: number): Promise<{
        data: Employee[];
        total: number;
        page: number;
        limit: number;
    }>;
    create(createEmployeeDto: CreateEmployeeDto): Promise<Employee>;
    update(employeeId: number, updateEmployeeDto: UpdateEmployeeDto): Promise<Employee>;
    delete(employeeId: number): Promise<void>;
    getDashboardStats(): Promise<DashboardStatsDto>;
}
