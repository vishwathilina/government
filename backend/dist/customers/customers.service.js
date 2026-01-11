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
exports.CustomersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const bcrypt = require("bcrypt");
const customer_entity_1 = require("../database/entities/customer.entity");
const customer_address_entity_1 = require("../database/entities/customer-address.entity");
const customer_phone_entity_1 = require("../database/entities/customer-phone.entity");
const customer_response_dto_1 = require("./dto/customer-response.dto");
let CustomersService = class CustomersService {
    constructor(customerRepository, addressRepository, phoneRepository, dataSource) {
        this.customerRepository = customerRepository;
        this.addressRepository = addressRepository;
        this.phoneRepository = phoneRepository;
        this.dataSource = dataSource;
    }
    async create(createCustomerDto, employeeId) {
        const existingCustomer = await this.customerRepository.findOne({
            where: { identityRef: createCustomerDto.identityRef },
        });
        if (existingCustomer) {
            throw new common_1.ConflictException(`Customer with identity reference ${createCustomerDto.identityRef} already exists`);
        }
        if (createCustomerDto.email) {
            const existingEmail = await this.customerRepository.findOne({
                where: { email: createCustomerDto.email },
            });
            if (existingEmail) {
                throw new common_1.ConflictException(`Customer with email ${createCustomerDto.email} already exists`);
            }
        }
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const address = this.addressRepository.create({
                postalCode: createCustomerDto.address.postalCode,
                line1: createCustomerDto.address.line1,
            });
            const savedAddress = await queryRunner.manager.save(address);
            const saltRounds = 10;
            const passwordHash = await bcrypt.hash(createCustomerDto.password, saltRounds);
            const customer = this.customerRepository.create({
                firstName: createCustomerDto.firstName,
                middleName: createCustomerDto.middleName,
                lastName: createCustomerDto.lastName,
                email: createCustomerDto.email,
                passwordHash,
                customerType: createCustomerDto.customerType,
                identityType: createCustomerDto.identityType,
                identityRef: createCustomerDto.identityRef,
                tariffCategoryId: createCustomerDto.tariffCategoryId,
                customerAddressId: savedAddress.customerAddressId,
                employeeId: employeeId,
                registrationDate: new Date(),
            });
            const savedCustomer = await queryRunner.manager.save(customer);
            if (createCustomerDto.phoneNumbers && createCustomerDto.phoneNumbers.length > 0) {
                const phoneEntities = createCustomerDto.phoneNumbers.map((phone) => this.phoneRepository.create({
                    customerId: savedCustomer.customerId,
                    phone,
                }));
                await queryRunner.manager.save(phoneEntities);
            }
            await queryRunner.commitTransaction();
            const completeCustomer = await this.customerRepository.findOne({
                where: { customerId: savedCustomer.customerId },
                relations: ['address', 'phoneNumbers'],
            });
            return customer_response_dto_1.CustomerResponseDto.fromEntity(completeCustomer);
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        }
        finally {
            await queryRunner.release();
        }
    }
    async findAll(query) {
        const { page = 1, limit = 10, sortBy = 'customerId', order = 'ASC' } = query;
        const skip = (page - 1) * limit;
        const queryBuilder = this.customerRepository
            .createQueryBuilder('customer')
            .leftJoinAndSelect('customer.address', 'address')
            .leftJoinAndSelect('customer.phoneNumbers', 'phoneNumbers');
        if (query.customerType) {
            queryBuilder.andWhere('customer.customerType = :customerType', {
                customerType: query.customerType,
            });
        }
        if (query.search) {
            queryBuilder.andWhere('(customer.firstName LIKE :search OR customer.lastName LIKE :search OR customer.email LIKE :search OR customer.identityRef LIKE :search)', { search: `%${query.search}%` });
        }
        const validSortFields = [
            'customerId',
            'firstName',
            'lastName',
            'email',
            'customerType',
            'registrationDate',
        ];
        const sortField = validSortFields.includes(sortBy) ? sortBy : 'customerId';
        queryBuilder.orderBy(`customer.${sortField}`, order === 'DESC' ? 'DESC' : 'ASC');
        queryBuilder.skip(skip).take(limit);
        const [customers, total] = await queryBuilder.getManyAndCount();
        const items = customers.map((customer) => customer_response_dto_1.CustomerResponseDto.fromEntity(customer));
        return {
            items,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
                hasNextPage: page * limit < total,
                hasPreviousPage: page > 1,
            },
        };
    }
    async findById(id) {
        const customer = await this.customerRepository.findOne({
            where: { customerId: id },
            relations: ['address', 'phoneNumbers', 'registeredBy'],
        });
        if (!customer) {
            throw new common_1.NotFoundException(`Customer with ID ${id} not found`);
        }
        return customer_response_dto_1.CustomerResponseDto.fromEntity(customer);
    }
    async findByIdentityRef(identityRef) {
        const customer = await this.customerRepository.findOne({
            where: { identityRef },
            relations: ['address', 'phoneNumbers'],
        });
        if (!customer) {
            throw new common_1.NotFoundException(`Customer with identity reference ${identityRef} not found`);
        }
        return customer_response_dto_1.CustomerResponseDto.fromEntity(customer);
    }
    async update(id, updateCustomerDto) {
        const customer = await this.customerRepository.findOne({
            where: { customerId: id },
            relations: ['address', 'phoneNumbers'],
        });
        if (!customer) {
            throw new common_1.NotFoundException(`Customer with ID ${id} not found`);
        }
        if (updateCustomerDto.email && updateCustomerDto.email !== customer.email) {
            const existingEmail = await this.customerRepository.findOne({
                where: { email: updateCustomerDto.email },
            });
            if (existingEmail) {
                throw new common_1.ConflictException(`Customer with email ${updateCustomerDto.email} already exists`);
            }
        }
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            if (updateCustomerDto.address && customer.address) {
                await queryRunner.manager.update(customer_address_entity_1.CustomerAddress, { customerAddressId: customer.address.customerAddressId }, {
                    postalCode: updateCustomerDto.address.postalCode,
                    line1: updateCustomerDto.address.line1,
                });
            }
            if (updateCustomerDto.phoneNumbers !== undefined) {
                await queryRunner.manager.delete(customer_phone_entity_1.CustomerPhone, { customerId: id });
                if (updateCustomerDto.phoneNumbers.length > 0) {
                    const phoneEntities = updateCustomerDto.phoneNumbers.map((phone) => this.phoneRepository.create({
                        customerId: id,
                        phone,
                    }));
                    await queryRunner.manager.save(phoneEntities);
                }
            }
            const updateData = {};
            if (updateCustomerDto.firstName !== undefined) {
                updateData.firstName = updateCustomerDto.firstName;
            }
            if (updateCustomerDto.middleName !== undefined) {
                updateData.middleName = updateCustomerDto.middleName;
            }
            if (updateCustomerDto.lastName !== undefined) {
                updateData.lastName = updateCustomerDto.lastName;
            }
            if (updateCustomerDto.email !== undefined) {
                updateData.email = updateCustomerDto.email;
            }
            if (updateCustomerDto.customerType !== undefined) {
                updateData.customerType = updateCustomerDto.customerType;
            }
            if (updateCustomerDto.identityType !== undefined) {
                updateData.identityType = updateCustomerDto.identityType;
            }
            if (updateCustomerDto.tariffCategoryId !== undefined) {
                updateData.tariffCategoryId = updateCustomerDto.tariffCategoryId;
            }
            if (updateCustomerDto.password) {
                const saltRounds = 10;
                updateData.passwordHash = await bcrypt.hash(updateCustomerDto.password, saltRounds);
            }
            if (Object.keys(updateData).length > 0) {
                await queryRunner.manager.update(customer_entity_1.Customer, { customerId: id }, updateData);
            }
            await queryRunner.commitTransaction();
            const updatedCustomer = await this.customerRepository.findOne({
                where: { customerId: id },
                relations: ['address', 'phoneNumbers'],
            });
            return customer_response_dto_1.CustomerResponseDto.fromEntity(updatedCustomer);
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        }
        finally {
            await queryRunner.release();
        }
    }
    async delete(id) {
        const customer = await this.customerRepository.findOne({
            where: { customerId: id },
            relations: ['address', 'phoneNumbers'],
        });
        if (!customer) {
            throw new common_1.NotFoundException(`Customer with ID ${id} not found`);
        }
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            await queryRunner.manager.delete(customer_phone_entity_1.CustomerPhone, { customerId: id });
            await queryRunner.manager.delete(customer_entity_1.Customer, { customerId: id });
            if (customer.address) {
                await queryRunner.manager.delete(customer_address_entity_1.CustomerAddress, {
                    customerAddressId: customer.address.customerAddressId,
                });
            }
            await queryRunner.commitTransaction();
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        }
        finally {
            await queryRunner.release();
        }
    }
    async getCountByType() {
        const result = await this.customerRepository
            .createQueryBuilder('customer')
            .select('customer.customerType', 'type')
            .addSelect('COUNT(*)', 'count')
            .groupBy('customer.customerType')
            .getRawMany();
        return result.map((r) => ({
            type: r.type,
            count: parseInt(r.count, 10),
        }));
    }
};
exports.CustomersService = CustomersService;
exports.CustomersService = CustomersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(customer_entity_1.Customer)),
    __param(1, (0, typeorm_1.InjectRepository)(customer_address_entity_1.CustomerAddress)),
    __param(2, (0, typeorm_1.InjectRepository)(customer_phone_entity_1.CustomerPhone)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.DataSource])
], CustomersService);
//# sourceMappingURL=customers.service.js.map