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
exports.EmployeesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const bcrypt = require("bcrypt");
const employee_entity_1 = require("../database/entities/employee.entity");
const customer_entity_1 = require("../database/entities/customer.entity");
const service_connection_entity_1 = require("../database/entities/service-connection.entity");
const bill_entity_1 = require("../database/entities/bill.entity");
const payment_entity_1 = require("../database/entities/payment.entity");
const utility_type_entity_1 = require("../database/entities/utility-type.entity");
let EmployeesService = class EmployeesService {
    constructor(employeeRepository, customerRepository, connectionRepository, billRepository, paymentRepository, utilityTypeRepository) {
        this.employeeRepository = employeeRepository;
        this.customerRepository = customerRepository;
        this.connectionRepository = connectionRepository;
        this.billRepository = billRepository;
        this.paymentRepository = paymentRepository;
        this.utilityTypeRepository = utilityTypeRepository;
    }
    async findByUsername(username) {
        return this.employeeRepository.findOne({
            where: { username },
        });
    }
    async findByEmail(email) {
        return this.employeeRepository.findOne({
            where: { email },
        });
    }
    async findById(employeeId) {
        return this.employeeRepository.findOne({
            where: { employeeId },
        });
    }
    async findByIdOrFail(employeeId) {
        const employee = await this.findById(employeeId);
        if (!employee) {
            throw new common_1.NotFoundException(`Employee with ID ${employeeId} not found`);
        }
        return employee;
    }
    async updateLastLogin(employeeId) {
        await this.employeeRepository.update(employeeId, {
            lastLoginAt: new Date(),
        });
    }
    async findAll(page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        const [data, total] = await this.employeeRepository.findAndCount({
            skip,
            take: limit,
            order: { employeeId: 'ASC' },
        });
        return { data, total, page, limit };
    }
    async create(createEmployeeDto) {
        const existingUsername = await this.findByUsername(createEmployeeDto.username);
        if (existingUsername) {
            throw new common_1.ConflictException('Username already exists');
        }
        const existingEmail = await this.findByEmail(createEmployeeDto.email);
        if (existingEmail) {
            throw new common_1.ConflictException('Email already exists');
        }
        const existingEmployeeNo = await this.employeeRepository.findOne({
            where: { employeeNo: createEmployeeDto.employeeNo },
        });
        if (existingEmployeeNo) {
            throw new common_1.ConflictException('Employee number already exists');
        }
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(createEmployeeDto.password, saltRounds);
        const employee = this.employeeRepository.create({
            firstName: createEmployeeDto.firstName,
            middleName: createEmployeeDto.middleName || null,
            lastName: createEmployeeDto.lastName,
            employeeNo: createEmployeeDto.employeeNo,
            designation: createEmployeeDto.designation,
            role: createEmployeeDto.role,
            departmentId: createEmployeeDto.departmentId,
            email: createEmployeeDto.email,
            username: createEmployeeDto.username,
            passwordHash,
        });
        return this.employeeRepository.save(employee);
    }
    async update(employeeId, updateEmployeeDto) {
        const employee = await this.findByIdOrFail(employeeId);
        if (updateEmployeeDto.username && updateEmployeeDto.username !== employee.username) {
            const existingUsername = await this.findByUsername(updateEmployeeDto.username);
            if (existingUsername) {
                throw new common_1.ConflictException('Username already exists');
            }
        }
        if (updateEmployeeDto.email && updateEmployeeDto.email !== employee.email) {
            const existingEmail = await this.findByEmail(updateEmployeeDto.email);
            if (existingEmail) {
                throw new common_1.ConflictException('Email already exists');
            }
        }
        if (updateEmployeeDto.employeeNo && updateEmployeeDto.employeeNo !== employee.employeeNo) {
            const existingEmployeeNo = await this.employeeRepository.findOne({
                where: { employeeNo: updateEmployeeDto.employeeNo },
            });
            if (existingEmployeeNo) {
                throw new common_1.ConflictException('Employee number already exists');
            }
        }
        if (updateEmployeeDto.firstName)
            employee.firstName = updateEmployeeDto.firstName;
        if (updateEmployeeDto.middleName !== undefined)
            employee.middleName = updateEmployeeDto.middleName || null;
        if (updateEmployeeDto.lastName)
            employee.lastName = updateEmployeeDto.lastName;
        if (updateEmployeeDto.employeeNo)
            employee.employeeNo = updateEmployeeDto.employeeNo;
        if (updateEmployeeDto.designation)
            employee.designation = updateEmployeeDto.designation;
        if (updateEmployeeDto.role)
            employee.role = updateEmployeeDto.role;
        if (updateEmployeeDto.departmentId)
            employee.departmentId = updateEmployeeDto.departmentId;
        if (updateEmployeeDto.email)
            employee.email = updateEmployeeDto.email;
        if (updateEmployeeDto.username)
            employee.username = updateEmployeeDto.username;
        if (updateEmployeeDto.password) {
            const saltRounds = 10;
            employee.passwordHash = await bcrypt.hash(updateEmployeeDto.password, saltRounds);
        }
        return this.employeeRepository.save(employee);
    }
    async delete(employeeId) {
        const employee = await this.findByIdOrFail(employeeId);
        if (employee.role === 'Admin') {
            const adminCount = await this.employeeRepository.count({
                where: { role: 'Admin' },
            });
            if (adminCount <= 1) {
                throw new common_1.BadRequestException('Cannot delete the last admin user');
            }
        }
        await this.employeeRepository.remove(employee);
    }
    async getDashboardStats() {
        let totalCustomers = 0;
        let customerGrowthPercent = 0;
        let activeConnections = 0;
        let connectionsChangePercent = 0;
        let billsGenerated = 0;
        let billsChangePercent = 0;
        let revenueMTD = 0;
        let revenueChangePercent = 0;
        const utilityStats = [];
        let billingOverview = {
            totalRevenue: 0,
            revenueChangePercent: 0,
            outstandingAmount: 0,
            outstandingCount: 0,
            overdueAmount: 0,
            overdueCount: 0,
            collectionRate: 0,
            targetCollectionRate: 95,
        };
        try {
            totalCustomers = await this.customerRepository.count();
        }
        catch (e) {
            console.error('Error counting customers:', e);
        }
        try {
            activeConnections = await this.connectionRepository.count({
                where: { connectionStatus: service_connection_entity_1.ConnectionStatus.ACTIVE },
            });
        }
        catch (e) {
            console.error('Error counting connections:', e);
        }
        try {
            billsGenerated = await this.billRepository.count();
        }
        catch (e) {
            console.error('Error counting bills:', e);
        }
        try {
            const utilityTypes = await this.utilityTypeRepository.find();
            for (const ut of utilityTypes) {
                const conns = await this.connectionRepository.count({
                    where: {
                        utilityTypeId: ut.utilityTypeId,
                        connectionStatus: service_connection_entity_1.ConnectionStatus.ACTIVE,
                    },
                });
                utilityStats.push({
                    utilityType: ut.name,
                    activeConnections: conns,
                    pendingBills: 0,
                    revenue: 0,
                });
            }
        }
        catch (e) {
            console.error('Error getting utility stats:', e);
        }
        try {
            const allBills = await this.billRepository.find({
                relations: ['payments', 'billTaxes'],
            });
            if (allBills.length > 0) {
                let totalPaid = 0;
                let totalAmount = 0;
                let outstanding = 0;
                let outstandingCount = 0;
                let overdueCount = 0;
                let overdueAmt = 0;
                for (const bill of allBills) {
                    const paid = bill.getTotalPaid();
                    const amount = bill.getTotalAmount();
                    totalPaid += paid;
                    totalAmount += amount;
                    if (!bill.isPaid()) {
                        outstandingCount++;
                        outstanding += bill.getOutstandingBalance();
                        if (bill.isOverdue()) {
                            overdueCount++;
                            overdueAmt += bill.getOutstandingBalance();
                        }
                    }
                }
                revenueMTD = totalPaid;
                billingOverview = {
                    totalRevenue: totalPaid,
                    revenueChangePercent: 0,
                    outstandingAmount: outstanding,
                    outstandingCount,
                    overdueAmount: overdueAmt,
                    overdueCount,
                    collectionRate: totalAmount > 0 ? Math.round((totalPaid / totalAmount) * 100) : 0,
                    targetCollectionRate: 95,
                };
            }
        }
        catch (e) {
            console.error('Error getting billing data:', e);
        }
        return {
            totalCustomers,
            customerGrowthPercent,
            activeConnections,
            connectionsChangePercent,
            billsGenerated,
            billsChangePercent,
            revenueMTD,
            revenueChangePercent,
            utilityStats,
            billingOverview,
        };
    }
};
exports.EmployeesService = EmployeesService;
exports.EmployeesService = EmployeesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(employee_entity_1.Employee)),
    __param(1, (0, typeorm_1.InjectRepository)(customer_entity_1.Customer)),
    __param(2, (0, typeorm_1.InjectRepository)(service_connection_entity_1.ServiceConnection)),
    __param(3, (0, typeorm_1.InjectRepository)(bill_entity_1.Bill)),
    __param(4, (0, typeorm_1.InjectRepository)(payment_entity_1.Payment)),
    __param(5, (0, typeorm_1.InjectRepository)(utility_type_entity_1.UtilityType)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], EmployeesService);
//# sourceMappingURL=employees.service.js.map