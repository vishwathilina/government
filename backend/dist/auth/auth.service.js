"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const bcrypt = require("bcrypt");
const employees_service_1 = require("../employees/employees.service");
const customer_entity_1 = require("../database/entities/customer.entity");
const customer_address_entity_1 = require("../database/entities/customer-address.entity");
const customer_phone_entity_1 = require("../database/entities/customer-phone.entity");
let AuthService = class AuthService {
    constructor(employeesService, jwtService, customerRepository, customerAddressRepository, customerPhoneRepository, dataSource) {
        this.employeesService = employeesService;
        this.jwtService = jwtService;
        this.customerRepository = customerRepository;
        this.customerAddressRepository = customerAddressRepository;
        this.customerPhoneRepository = customerPhoneRepository;
        this.dataSource = dataSource;
    }
    async login(loginDto) {
        const { usernameOrEmail, password } = loginDto;
        let employee = null;
        if (usernameOrEmail.includes('@')) {
            employee = await this.employeesService.findByEmail(usernameOrEmail);
        }
        else {
            employee = await this.employeesService.findByUsername(usernameOrEmail);
        }
        if (!employee) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const isPasswordValid = await bcrypt.compare(password, employee.passwordHash);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        await this.employeesService.updateLastLogin(employee.employeeId);
        const payload = {
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
    async customerLogin(loginDto) {
        const { identifier, password } = loginDto;
        let customer = null;
        if (identifier.includes('@')) {
            customer = await this.customerRepository.findOne({
                where: { email: identifier },
            });
        }
        else if (/^\d+$/.test(identifier)) {
            customer = await this.customerRepository.findOne({
                where: { customerId: parseInt(identifier, 10) },
            });
        }
        if (!customer) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const isPasswordValid = await bcrypt.compare(password, customer.passwordHash);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
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
    async validateJwtPayload(payload) {
        const employee = await this.employeesService.findById(payload.sub);
        if (!employee) {
            throw new common_1.UnauthorizedException('Invalid token');
        }
        return employee;
    }
    async getProfile(employeeId) {
        return this.employeesService.findByIdOrFail(employeeId);
    }
    async getCustomerProfile(customerId) {
        const customer = await this.customerRepository.findOne({
            where: { customerId },
        });
        if (!customer) {
            throw new common_1.UnauthorizedException('Customer not found');
        }
        return customer;
    }
    async customerRegister(registerDto) {
        const existingEmail = await this.customerRepository.findOne({
            where: { email: registerDto.email },
        });
        if (existingEmail) {
            throw new common_1.ConflictException('An account with this email already exists');
        }
        const existingIdentity = await this.customerRepository.findOne({
            where: { identityRef: registerDto.identityRef },
        });
        if (existingIdentity) {
            throw new common_1.ConflictException('An account with this identity number already exists');
        }
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const address = this.customerAddressRepository.create({
                postalCode: registerDto.address.postalCode,
                line1: registerDto.address.line1,
            });
            const savedAddress = await queryRunner.manager.save(address);
            const saltRounds = 10;
            const passwordHash = await bcrypt.hash(registerDto.password, saltRounds);
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
            if (registerDto.phoneNumbers && registerDto.phoneNumbers.length > 0) {
                const phoneEntities = registerDto.phoneNumbers.map((phone) => this.customerPhoneRepository.create({
                    customerId: savedCustomer.customerId,
                    phone,
                }));
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
                    email: savedCustomer.email,
                    customerType: savedCustomer.customerType,
                },
            };
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        }
        finally {
            await queryRunner.release();
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(2, (0, typeorm_1.InjectRepository)(customer_entity_1.Customer)),
    __param(3, (0, typeorm_1.InjectRepository)(customer_address_entity_1.CustomerAddress)),
    __param(4, (0, typeorm_1.InjectRepository)(customer_phone_entity_1.CustomerPhone)),
    __metadata("design:paramtypes", [employees_service_1.EmployeesService,
        jwt_1.JwtService,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.DataSource])
], AuthService);
//# sourceMappingURL=auth.service.js.map