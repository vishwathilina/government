import { JwtService } from '@nestjs/jwt';
import { Repository, DataSource } from 'typeorm';
import { EmployeesService } from '../employees/employees.service';
import { LoginDto } from './dto/login.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { CustomerLoginDto } from './dto/customer-login.dto';
import { CustomerLoginResponseDto } from './dto/customer-login-response.dto';
import { CustomerRegisterDto, CustomerRegisterResponseDto } from './dto/customer-register.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { Employee } from '../database/entities/employee.entity';
import { Customer } from '../database/entities/customer.entity';
import { CustomerAddress } from '../database/entities/customer-address.entity';
import { CustomerPhone } from '../database/entities/customer-phone.entity';
export declare class AuthService {
    private readonly employeesService;
    private readonly jwtService;
    private readonly customerRepository;
    private readonly customerAddressRepository;
    private readonly customerPhoneRepository;
    private readonly dataSource;
    constructor(employeesService: EmployeesService, jwtService: JwtService, customerRepository: Repository<Customer>, customerAddressRepository: Repository<CustomerAddress>, customerPhoneRepository: Repository<CustomerPhone>, dataSource: DataSource);
    login(loginDto: LoginDto): Promise<LoginResponseDto>;
    customerLogin(loginDto: CustomerLoginDto): Promise<CustomerLoginResponseDto>;
    validateJwtPayload(payload: JwtPayload): Promise<Employee>;
    getProfile(employeeId: number): Promise<Employee>;
    getCustomerProfile(customerId: number): Promise<Customer>;
    customerRegister(registerDto: CustomerRegisterDto): Promise<CustomerRegisterResponseDto>;
}
