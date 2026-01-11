import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Employee } from '../database/entities/employee.entity';
import { Customer } from '../database/entities/customer.entity';
import { ServiceConnection, ConnectionStatus } from '../database/entities/service-connection.entity';
import { Bill } from '../database/entities/bill.entity';
import { Payment } from '../database/entities/payment.entity';
import { UtilityType } from '../database/entities/utility-type.entity';
import { DashboardStatsDto, UtilityStatsDto, BillingOverviewDto } from './dto/dashboard-stats.dto';
import { CreateEmployeeDto, UpdateEmployeeDto } from './dto/create-employee.dto';

@Injectable()
export class EmployeesService {
  constructor(
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
    @InjectRepository(ServiceConnection)
    private readonly connectionRepository: Repository<ServiceConnection>,
    @InjectRepository(Bill)
    private readonly billRepository: Repository<Bill>,
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
    @InjectRepository(UtilityType)
    private readonly utilityTypeRepository: Repository<UtilityType>,
  ) { }

  /**
   * Find employee by username
   * @param username - Employee username
   * @returns Employee or null
   */
  async findByUsername(username: string): Promise<Employee | null> {
    return this.employeeRepository.findOne({
      where: { username },
    });
  }

  /**
   * Find employee by email
   * @param email - Employee email
   * @returns Employee or null
   */
  async findByEmail(email: string): Promise<Employee | null> {
    return this.employeeRepository.findOne({
      where: { email },
    });
  }

  /**
   * Find employee by ID
   * @param employeeId - Employee ID
   * @returns Employee or null
   */
  async findById(employeeId: number): Promise<Employee | null> {
    return this.employeeRepository.findOne({
      where: { employeeId },
    });
  }

  /**
   * Find employee by ID or throw NotFoundException
   * @param employeeId - Employee ID
   * @returns Employee
   * @throws NotFoundException if employee not found
   */
  async findByIdOrFail(employeeId: number): Promise<Employee> {
    const employee = await this.findById(employeeId);
    if (!employee) {
      throw new NotFoundException(`Employee with ID ${employeeId} not found`);
    }
    return employee;
  }

  /**
   * Update employee's last login timestamp
   * @param employeeId - Employee ID
   */
  async updateLastLogin(employeeId: number): Promise<void> {
    await this.employeeRepository.update(employeeId, {
      lastLoginAt: new Date(),
    });
  }

  /**
   * Get all employees (paginated)
   * @param page - Page number (1-based)
   * @param limit - Number of items per page
   * @returns Paginated employees list
   */
  async findAll(
    page: number = 1,
    limit: number = 10,
  ): Promise<{ data: Employee[]; total: number; page: number; limit: number }> {
    const skip = (page - 1) * limit;

    const [data, total] = await this.employeeRepository.findAndCount({
      skip,
      take: limit,
      order: { employeeId: 'ASC' },
    });

    return { data, total, page, limit };
  }

  /**
   * Create a new employee
   * @param createEmployeeDto - Employee data
   * @returns Created employee
   */
  async create(createEmployeeDto: CreateEmployeeDto): Promise<Employee> {
    // Check if username already exists
    const existingUsername = await this.findByUsername(createEmployeeDto.username);
    if (existingUsername) {
      throw new ConflictException('Username already exists');
    }

    // Check if email already exists
    const existingEmail = await this.findByEmail(createEmployeeDto.email);
    if (existingEmail) {
      throw new ConflictException('Email already exists');
    }

    // Check if employee number already exists
    const existingEmployeeNo = await this.employeeRepository.findOne({
      where: { employeeNo: createEmployeeDto.employeeNo },
    });
    if (existingEmployeeNo) {
      throw new ConflictException('Employee number already exists');
    }

    // Hash the password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(createEmployeeDto.password, saltRounds);

    // Create the employee entity
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

  /**
   * Update an employee
   * @param employeeId - Employee ID
   * @param updateEmployeeDto - Updated employee data
   * @returns Updated employee
   */
  async update(employeeId: number, updateEmployeeDto: UpdateEmployeeDto): Promise<Employee> {
    const employee = await this.findByIdOrFail(employeeId);

    // Check if username is being changed and already exists
    if (updateEmployeeDto.username && updateEmployeeDto.username !== employee.username) {
      const existingUsername = await this.findByUsername(updateEmployeeDto.username);
      if (existingUsername) {
        throw new ConflictException('Username already exists');
      }
    }

    // Check if email is being changed and already exists
    if (updateEmployeeDto.email && updateEmployeeDto.email !== employee.email) {
      const existingEmail = await this.findByEmail(updateEmployeeDto.email);
      if (existingEmail) {
        throw new ConflictException('Email already exists');
      }
    }

    // Check if employee number is being changed and already exists
    if (updateEmployeeDto.employeeNo && updateEmployeeDto.employeeNo !== employee.employeeNo) {
      const existingEmployeeNo = await this.employeeRepository.findOne({
        where: { employeeNo: updateEmployeeDto.employeeNo },
      });
      if (existingEmployeeNo) {
        throw new ConflictException('Employee number already exists');
      }
    }

    // Update fields
    if (updateEmployeeDto.firstName) employee.firstName = updateEmployeeDto.firstName;
    if (updateEmployeeDto.middleName !== undefined) employee.middleName = updateEmployeeDto.middleName || null;
    if (updateEmployeeDto.lastName) employee.lastName = updateEmployeeDto.lastName;
    if (updateEmployeeDto.employeeNo) employee.employeeNo = updateEmployeeDto.employeeNo;
    if (updateEmployeeDto.designation) employee.designation = updateEmployeeDto.designation;
    if (updateEmployeeDto.role) employee.role = updateEmployeeDto.role;
    if (updateEmployeeDto.departmentId) employee.departmentId = updateEmployeeDto.departmentId;
    if (updateEmployeeDto.email) employee.email = updateEmployeeDto.email;
    if (updateEmployeeDto.username) employee.username = updateEmployeeDto.username;

    // Update password if provided
    if (updateEmployeeDto.password) {
      const saltRounds = 10;
      employee.passwordHash = await bcrypt.hash(updateEmployeeDto.password, saltRounds);
    }

    return this.employeeRepository.save(employee);
  }

  /**
   * Delete an employee
   * @param employeeId - Employee ID
   */
  async delete(employeeId: number): Promise<void> {
    const employee = await this.findByIdOrFail(employeeId);
    
    // Prevent deleting the last admin
    if (employee.role === 'Admin') {
      const adminCount = await this.employeeRepository.count({
        where: { role: 'Admin' },
      });
      if (adminCount <= 1) {
        throw new BadRequestException('Cannot delete the last admin user');
      }
    }

    await this.employeeRepository.remove(employee);
  }

  /**
   * Get dashboard statistics
   * @returns Dashboard statistics including customer, connection, billing data
   */
  async getDashboardStats(): Promise<DashboardStatsDto> {
    // Default values - will return these even if db queries fail
    let totalCustomers = 0;
    let customerGrowthPercent = 0;
    let activeConnections = 0;
    let connectionsChangePercent = 0;
    let billsGenerated = 0;
    let billsChangePercent = 0;
    let revenueMTD = 0;
    let revenueChangePercent = 0;
    const utilityStats: UtilityStatsDto[] = [];
    let billingOverview: BillingOverviewDto = {
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
      // Get total customers - simple count
      totalCustomers = await this.customerRepository.count();
    } catch (e) {
      console.error('Error counting customers:', e);
    }

    try {
      // Get active connections - simple count
      activeConnections = await this.connectionRepository.count({
        where: { connectionStatus: ConnectionStatus.ACTIVE },
      });
    } catch (e) {
      console.error('Error counting connections:', e);
    }

    try {
      // Get total bills count
      billsGenerated = await this.billRepository.count();
    } catch (e) {
      console.error('Error counting bills:', e);
    }

    try {
      // Get utility types and stats
      const utilityTypes = await this.utilityTypeRepository.find();
      for (const ut of utilityTypes) {
        const conns = await this.connectionRepository.count({
          where: {
            utilityTypeId: ut.utilityTypeId,
            connectionStatus: ConnectionStatus.ACTIVE,
          },
        });
        utilityStats.push({
          utilityType: ut.name,
          activeConnections: conns,
          pendingBills: 0,
          revenue: 0,
        });
      }
    } catch (e) {
      console.error('Error getting utility stats:', e);
    }

    // Try to get billing data with payments
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
    } catch (e) {
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
}
