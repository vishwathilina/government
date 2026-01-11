import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
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

@Injectable()
export class AuthService {
  constructor(
    private readonly employeesService: EmployeesService,
    private readonly jwtService: JwtService,
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
    @InjectRepository(CustomerAddress)
    private readonly customerAddressRepository: Repository<CustomerAddress>,
    @InjectRepository(CustomerPhone)
    private readonly customerPhoneRepository: Repository<CustomerPhone>,
    private readonly dataSource: DataSource,
  ) { }

  /**
   * Authenticate employee with username/email and password
   * @param loginDto - Login credentials
   * @returns Login response with JWT token and employee data
   * @throws UnauthorizedException if credentials are invalid
   */
  async login(loginDto: LoginDto): Promise<LoginResponseDto> {
    const { usernameOrEmail, password } = loginDto;

    // Try to find employee by username or email
    let employee: Employee | null = null;

    if (usernameOrEmail.includes('@')) {
      employee = await this.employeesService.findByEmail(usernameOrEmail);
    } else {
      employee = await this.employeesService.findByUsername(usernameOrEmail);
    }

    if (!employee) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, employee.passwordHash);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Update last login timestamp
    await this.employeesService.updateLastLogin(employee.employeeId);

    // Generate JWT token
    const payload: JwtPayload = {
      sub: employee.employeeId,
      username: employee.username,
      email: employee.email,
      role: employee.role,
    };

    const accessToken = this.jwtService.sign(payload);

    return {
      accessToken,
      tokenType: 'Bearer',
      employee: {
        employeeId: employee.employeeId,
        firstName: employee.firstName,
        middleName: employee.middleName,
        lastName: employee.lastName,
        fullName: employee.fullName,
        employeeNo: employee.employeeNo,
        designation: employee.designation,
        role: employee.role,
        departmentId: employee.departmentId,
        email: employee.email,
        username: employee.username,
      },
    };
  }

  /**
   * Authenticate customer with email/customerId and password
   * @param loginDto - Customer login credentials
   * @returns Login response with JWT token and customer data
   * @throws UnauthorizedException if credentials are invalid
   */
  async customerLogin(loginDto: CustomerLoginDto): Promise<CustomerLoginResponseDto> {
    const { identifier, password } = loginDto;

    // Try to find customer by email or customer ID
    let customer: Customer | null = null;

    if (identifier.includes('@')) {
      // It's an email
      customer = await this.customerRepository.findOne({
        where: { email: identifier },
      });
    } else if (/^\d+$/.test(identifier)) {
      // It's a numeric customer ID
      customer = await this.customerRepository.findOne({
        where: { customerId: parseInt(identifier, 10) },
      });
    }

    if (!customer) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, customer.passwordHash);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate JWT token for customer
    const payload = {
      sub: customer.customerId,
      email: customer.email,
      type: 'customer',
    };

    const accessToken = this.jwtService.sign(payload);

    return {
      accessToken,
      tokenType: 'Bearer',
      customer: {
        customerId: customer.customerId,
        firstName: customer.firstName,
        middleName: customer.middleName,
        lastName: customer.lastName,
        fullName: customer.fullName,
        email: customer.email,
        customerType: customer.customerType,
      },
    };
  }

  /**
   * Validate JWT payload and return employee
   * @param payload - JWT payload
   * @returns Employee if valid
   * @throws UnauthorizedException if employee not found
   */
  async validateJwtPayload(payload: JwtPayload): Promise<Employee> {
    const employee = await this.employeesService.findById(payload.sub);

    if (!employee) {
      throw new UnauthorizedException('Invalid token');
    }

    return employee;
  }

  /**
   * Get current authenticated employee profile
   * @param employeeId - Employee ID from JWT
   * @returns Employee profile
   */
  async getProfile(employeeId: number): Promise<Employee> {
    return this.employeesService.findByIdOrFail(employeeId);
  }

  /**
   * Get current authenticated customer profile
   * @param customerId - Customer ID from JWT
   * @returns Customer profile
   */
  async getCustomerProfile(customerId: number): Promise<Customer> {
    const customer = await this.customerRepository.findOne({
      where: { customerId },
    });

    if (!customer) {
      throw new UnauthorizedException('Customer not found');
    }

    return customer;
  }

  /**
   * Register a new customer (public registration)
   * @param registerDto - Customer registration data
   * @returns Registration response with customer data
   * @throws ConflictException if email or identity reference already exists
   */
  async customerRegister(registerDto: CustomerRegisterDto): Promise<CustomerRegisterResponseDto> {
    // Check if email already exists
    const existingEmail = await this.customerRepository.findOne({
      where: { email: registerDto.email },
    });

    if (existingEmail) {
      throw new ConflictException('An account with this email already exists');
    }

    // Check if identity reference already exists
    const existingIdentity = await this.customerRepository.findOne({
      where: { identityRef: registerDto.identityRef },
    });

    if (existingIdentity) {
      throw new ConflictException('An account with this identity number already exists');
    }

    // Use transaction for creating customer with related entities
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Create address first
      const address = this.customerAddressRepository.create({
        postalCode: registerDto.address.postalCode,
        line1: registerDto.address.line1,
      });
      const savedAddress = await queryRunner.manager.save(address);

      // Hash password
      const saltRounds = 10;
      const passwordHash = await bcrypt.hash(registerDto.password, saltRounds);

      // Create customer
      const customer = this.customerRepository.create({
        firstName: registerDto.firstName,
        middleName: registerDto.middleName,
        lastName: registerDto.lastName,
        email: registerDto.email,
        passwordHash,
        customerType: registerDto.customerType,
        identityType: registerDto.identityType,
        identityRef: registerDto.identityRef,
        customerAddressId: savedAddress.customerAddressId,
        registrationDate: new Date(),
      });
      const savedCustomer = await queryRunner.manager.save(customer);

      // Create phone numbers if provided
      if (registerDto.phoneNumbers && registerDto.phoneNumbers.length > 0) {
        const phoneEntities = registerDto.phoneNumbers.map((phone) =>
          this.customerPhoneRepository.create({
            customerId: savedCustomer.customerId,
            phone,
          }),
        );
        await queryRunner.manager.save(phoneEntities);
      }

      await queryRunner.commitTransaction();

      return {
        success: true,
        message: 'Registration successful. You can now login with your email and password.',
        data: {
          customerId: savedCustomer.customerId,
          firstName: savedCustomer.firstName,
          lastName: savedCustomer.lastName,
          email: savedCustomer.email!,
          customerType: savedCustomer.customerType,
        },
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
