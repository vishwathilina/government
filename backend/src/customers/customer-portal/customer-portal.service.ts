import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, LessThan } from 'typeorm';
import { Customer } from '../../database/entities/customer.entity';
import { Bill } from '../../database/entities/bill.entity';
import { Payment } from '../../database/entities/payment.entity';
import { ServiceConnection } from '../../database/entities/service-connection.entity';
import { MeterReading } from '../../database/entities/meter-reading.entity';

@Injectable()
export class CustomerPortalService {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
    @InjectRepository(Bill)
    private readonly billRepository: Repository<Bill>,
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
    @InjectRepository(ServiceConnection)
    private readonly connectionRepository: Repository<ServiceConnection>,
    @InjectRepository(MeterReading)
    private readonly readingRepository: Repository<MeterReading>,
  ) {}

  /**
   * Get comprehensive dashboard data for customer
   */
  async getDashboardData(customerId: number) {
    // Get customer profile
    const customer = await this.customerRepository.findOne({
      where: { customerId },
      relations: ['address', 'phoneNumbers'],
    });

    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    // Get unpaid bills
    const unpaidBills = await this.getUnpaidBills(customerId);

    // Get recent payments (last 5)
    const recentPayments = await this.getRecentPayments(customerId, 5);

    // Get service connections count
    const connections = await this.connectionRepository.find({
      where: { customerId },
      relations: ['utilityType', 'meter'],
    });

    // Calculate total outstanding
    const totalOutstanding = unpaidBills.bills.reduce(
      (sum, bill) => sum + bill.outstandingAmount,
      0,
    );

    // Find next due date
    const nextDueBill = unpaidBills.bills
      .filter((b) => !b.isPaid)
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())[0];

    return {
      customer: {
        customerId: customer.customerId,
        firstName: customer.firstName,
        lastName: customer.lastName,
        fullName: customer.fullName,
        email: customer.email,
        customerType: customer.customerType,
        address: customer.address
          ? {
              line1: customer.address.line1,
              postalCode: customer.address.postalCode,
            }
          : null,
        phoneNumbers: customer.phoneNumbers?.map((p) => p.phone) || [],
      },
      accountSummary: {
        totalOutstanding,
        unpaidBillCount: unpaidBills.bills.filter((b) => !b.isPaid).length,
        overdueBillCount: unpaidBills.bills.filter((b) => b.isOverdue).length,
        nextDueDate: nextDueBill?.dueDate || null,
        nextDueAmount: nextDueBill?.outstandingAmount || 0,
      },
      unpaidBills: unpaidBills.bills.slice(0, 5),
      recentPayments,
      connections: connections.map((c) => ({
        connectionId: c.connectionId,
        utilityType: c.utilityType?.name || 'Unknown',
        status: c.connectionStatus,
        meterSerialNo: c.meter?.meterSerialNo || 'Not assigned',
      })),
    };
  }

  /**
   * Get customer profile with full details
   */
  async getCustomerProfile(customerId: number) {
    const customer = await this.customerRepository.findOne({
      where: { customerId },
      relations: ['address', 'phoneNumbers'],
    });

    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    return {
      customerId: customer.customerId,
      firstName: customer.firstName,
      middleName: customer.middleName,
      lastName: customer.lastName,
      fullName: customer.fullName,
      email: customer.email,
      customerType: customer.customerType,
      identityType: customer.identityType,
      identityRef: customer.identityRef,
      registrationDate: customer.registrationDate,
      address: customer.address
        ? {
            line1: customer.address.line1,
            postalCode: customer.address.postalCode,
          }
        : null,
      phoneNumbers: customer.phoneNumbers?.map((p) => p.phone) || [],
    };
  }

  /**
   * Get unpaid bills for customer
   */
  async getUnpaidBills(customerId: number) {
    // Get all connections for this customer
    const connections = await this.connectionRepository.find({
      where: { customerId },
      select: ['connectionId', 'meterId'],
    });

    if (connections.length === 0) {
      return { bills: [], totalOutstanding: 0 };
    }

    const meterIds = connections
      .filter((c) => c.meterId)
      .map((c) => c.meterId);

    if (meterIds.length === 0) {
      return { bills: [], totalOutstanding: 0 };
    }

    // Get all bills for these meters with relations needed for calculations
    const bills = await this.billRepository
      .createQueryBuilder('bill')
      .leftJoinAndSelect('bill.meter', 'meter')
      .leftJoinAndSelect('meter.utilityType', 'utilityType')
      .leftJoinAndSelect('bill.payments', 'payments')
      .leftJoinAndSelect('bill.billTaxes', 'billTaxes')
      .where('bill.meterId IN (:...meterIds)', { meterIds })
      .orderBy('bill.dueDate', 'ASC')
      .getMany();

    // Filter unpaid bills and transform
    const now = new Date();
    const unpaidBills = bills
      .filter((bill) => !bill.isPaid())
      .map((bill) => ({
        billId: bill.billId,
        billNumber: `BILL-${bill.billId.toString().padStart(6, '0')}`,
        meterSerialNo: bill.meter?.meterSerialNo || 'Unknown',
        utilityType: bill.meter?.utilityType?.name || 'Unknown',
        billingPeriodStart: bill.billingPeriodStart,
        billingPeriodEnd: bill.billingPeriodEnd,
        billDate: bill.billDate,
        dueDate: bill.dueDate,
        totalAmount: bill.getTotalAmount(),
        paidAmount: bill.getTotalPaid(),
        outstandingAmount: bill.getOutstandingBalance(),
        isPaid: bill.isPaid(),
        isOverdue: bill.isOverdue(now),
        daysOverdue: bill.getDaysOverdue(now),
      }));

    const totalOutstanding = unpaidBills.reduce(
      (sum, bill) => sum + bill.outstandingAmount,
      0,
    );

    return {
      bills: unpaidBills,
      totalOutstanding,
    };
  }

  /**
   * Get bill history with pagination
   */
  async getBillHistory(
    customerId: number,
    options: { page: number; limit: number; status?: string },
  ) {
    const connections = await this.connectionRepository.find({
      where: { customerId },
      select: ['connectionId', 'meterId'],
    });

    if (connections.length === 0) {
      return { bills: [], total: 0, page: options.page, limit: options.limit, totalPages: 0 };
    }

    const meterIds = connections.filter((c) => c.meterId).map((c) => c.meterId);

    if (meterIds.length === 0) {
      return { bills: [], total: 0, page: options.page, limit: options.limit, totalPages: 0 };
    }

    const skip = (options.page - 1) * options.limit;

    const queryBuilder = this.billRepository
      .createQueryBuilder('bill')
      .leftJoinAndSelect('bill.meter', 'meter')
      .leftJoinAndSelect('meter.utilityType', 'utilityType')
      .leftJoinAndSelect('bill.payments', 'payments')
      .leftJoinAndSelect('bill.billTaxes', 'billTaxes')
      .where('bill.meterId IN (:...meterIds)', { meterIds });

    const [bills, total] = await queryBuilder
      .orderBy('bill.billDate', 'DESC')
      .skip(skip)
      .take(options.limit)
      .getManyAndCount();

    const now = new Date();
    let billsFormatted = bills.map((bill) => {
      const isPaid = bill.isPaid();
      const isOverdue = bill.isOverdue(now);
      let status = 'UNPAID';
      if (isPaid) status = 'PAID';
      else if (isOverdue) status = 'OVERDUE';
      else if (bill.getTotalPaid() > 0) status = 'PARTIAL';

      return {
        billId: bill.billId,
        billNumber: `BILL-${bill.billId.toString().padStart(6, '0')}`,
        meterSerialNo: bill.meter?.meterSerialNo || 'Unknown',
        utilityType: bill.meter?.utilityType?.name || 'Unknown',
        billingPeriodStart: bill.billingPeriodStart,
        billingPeriodEnd: bill.billingPeriodEnd,
        billDate: bill.billDate,
        dueDate: bill.dueDate,
        totalAmount: bill.getTotalAmount(),
        paidAmount: bill.getTotalPaid(),
        outstandingAmount: bill.getOutstandingBalance(),
        status,
        isPaid,
        isOverdue,
      };
    });

    // Filter by status if provided
    if (options.status) {
      billsFormatted = billsFormatted.filter((b) => b.status === options.status);
    }

    return {
      bills: billsFormatted,
      total,
      page: options.page,
      limit: options.limit,
      totalPages: Math.ceil(total / options.limit),
    };
  }

  /**
   * Get specific bill details
   */
  async getBillDetails(customerId: number, billId: number) {
    // First verify the bill belongs to the customer
    const connections = await this.connectionRepository.find({
      where: { customerId },
      select: ['meterId'],
    });

    const meterIds = connections.filter((c) => c.meterId).map((c) => c.meterId);

    const bill = await this.billRepository.findOne({
      where: { billId },
      relations: ['meter', 'meter.utilityType', 'billDetails', 'billTaxes', 'payments'],
    });

    if (!bill) {
      throw new NotFoundException('Bill not found');
    }

    if (!meterIds.includes(bill.meterId)) {
      throw new ForbiddenException('You do not have access to this bill');
    }

    const now = new Date();
    const isPaid = bill.isPaid();
    const isOverdue = bill.isOverdue(now);
    let status = 'UNPAID';
    if (isPaid) status = 'PAID';
    else if (isOverdue) status = 'OVERDUE';
    else if (bill.getTotalPaid() > 0) status = 'PARTIAL';

    return {
      billId: bill.billId,
      billNumber: `BILL-${bill.billId.toString().padStart(6, '0')}`,
      meterSerialNo: bill.meter?.meterSerialNo || 'Unknown',
      utilityType: bill.meter?.utilityType?.name || 'Unknown',
      billingPeriodStart: bill.billingPeriodStart,
      billingPeriodEnd: bill.billingPeriodEnd,
      billDate: bill.billDate,
      dueDate: bill.dueDate,
      totalImportUnit: Number(bill.totalImportUnit),
      totalExportUnit: Number(bill.totalExportUnit),
      energyChargeAmount: Number(bill.energyChargeAmount),
      fixedChargeAmount: Number(bill.fixedChargeAmount),
      subsidyAmount: Number(bill.subsidyAmount),
      solarExportCredit: Number(bill.solarExportCredit),
      taxAmount: bill.getTaxAmount(),
      totalAmount: bill.getTotalAmount(),
      paidAmount: bill.getTotalPaid(),
      outstandingAmount: bill.getOutstandingBalance(),
      status,
      isPaid,
      isOverdue,
      daysOverdue: bill.getDaysOverdue(now),
      details: bill.billDetails?.map((d) => ({
        slabId: d.slabId,
        unitsInSlab: Number(d.unitsInSlab),
        amount: Number(d.amount),
      })) || [],
      taxes: bill.billTaxes?.map((t) => ({
        taxId: t.taxId,
        amount: t.getTaxAmount(),
      })) || [],
      payments: bill.payments?.map((p) => ({
        paymentId: p.paymentId,
        paymentDate: p.paymentDate,
        amount: Number(p.paymentAmount),
        method: p.paymentMethod,
      })) || [],
    };
  }

  /**
   * Get recent payments
   */
  private async getRecentPayments(customerId: number, limit: number) {
    const connections = await this.connectionRepository.find({
      where: { customerId },
      select: ['meterId'],
    });

    const meterIds = connections.filter((c) => c.meterId).map((c) => c.meterId);

    if (meterIds.length === 0) {
      return [];
    }

    // Get bills for these meters
    const bills = await this.billRepository.find({
      where: { meterId: In(meterIds) },
      select: ['billId'],
    });

    const billIds = bills.map((b) => b.billId);

    if (billIds.length === 0) {
      return [];
    }

    const payments = await this.paymentRepository.find({
      where: { billId: In(billIds) },
      order: { paymentDate: 'DESC' },
      take: limit,
      relations: ['bill'],
    });

    return payments.map((p) => ({
      paymentId: p.paymentId,
      paymentDate: p.paymentDate,
      amount: Number(p.paymentAmount),
      method: p.paymentMethod,
      receiptNumber: p.transactionRef || `RCP-${p.paymentId.toString().padStart(6, '0')}`,
      billNumber: `BILL-${p.billId.toString().padStart(6, '0')}`,
    }));
  }

  /**
   * Get payment history with pagination
   */
  async getPaymentHistory(
    customerId: number,
    options: { page: number; limit: number },
  ) {
    const connections = await this.connectionRepository.find({
      where: { customerId },
      select: ['meterId'],
    });

    const meterIds = connections.filter((c) => c.meterId).map((c) => c.meterId);

    if (meterIds.length === 0) {
      return { payments: [], total: 0, page: options.page, limit: options.limit, totalPages: 0 };
    }

    const bills = await this.billRepository.find({
      where: { meterId: In(meterIds) },
      select: ['billId'],
    });

    const billIds = bills.map((b) => b.billId);

    if (billIds.length === 0) {
      return { payments: [], total: 0, page: options.page, limit: options.limit, totalPages: 0 };
    }

    const skip = (options.page - 1) * options.limit;

    const [payments, total] = await this.paymentRepository.findAndCount({
      where: { billId: In(billIds) },
      order: { paymentDate: 'DESC' },
      skip,
      take: options.limit,
      relations: ['bill'],
    });

    return {
      payments: payments.map((p) => ({
        paymentId: p.paymentId,
        paymentDate: p.paymentDate,
        amount: Number(p.paymentAmount),
        method: p.paymentMethod,
        channel: p.paymentChannel,
        status: p.paymentStatus,
        receiptNumber: p.transactionRef || `RCP-${p.paymentId.toString().padStart(6, '0')}`,
        billNumber: `BILL-${p.billId.toString().padStart(6, '0')}`,
      })),
      total,
      page: options.page,
      limit: options.limit,
      totalPages: Math.ceil(total / options.limit),
    };
  }

  /**
   * Get payment receipt details
   */
  async getPaymentReceipt(customerId: number, paymentId: number) {
    // Verify the payment belongs to the customer
    const connections = await this.connectionRepository.find({
      where: { customerId },
      select: ['meterId'],
    });

    const meterIds = connections.filter((c) => c.meterId).map((c) => c.meterId);

    const bills = await this.billRepository.find({
      where: { meterId: In(meterIds) },
      select: ['billId'],
    });

    const billIds = bills.map((b) => b.billId);

    const payment = await this.paymentRepository.findOne({
      where: { paymentId },
      relations: ['bill', 'bill.meter', 'bill.meter.utilityType', 'bill.payments', 'bill.billTaxes'],
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    if (!billIds.includes(payment.billId)) {
      throw new ForbiddenException('You do not have access to this payment');
    }

    // Get customer info
    const customer = await this.customerRepository.findOne({
      where: { customerId },
      relations: ['address'],
    });

    return {
      receiptNumber: payment.transactionRef || `RCP-${payment.paymentId.toString().padStart(6, '0')}`,
      paymentId: payment.paymentId,
      paymentDate: payment.paymentDate,
      amount: Number(payment.paymentAmount),
      method: payment.paymentMethod,
      channel: payment.paymentChannel,
      status: payment.paymentStatus,
      bill: {
        billId: payment.billId,
        billNumber: `BILL-${payment.billId.toString().padStart(6, '0')}`,
        utilityType: payment.bill?.meter?.utilityType?.name || 'Unknown',
        meterSerialNo: payment.bill?.meter?.meterSerialNo || 'Unknown',
        totalAmount: payment.bill?.getTotalAmount() || 0,
      },
      customer: {
        customerId: customer?.customerId,
        name: customer?.fullName,
        email: customer?.email,
        address: customer?.address?.line1,
      },
    };
  }

  /**
   * Get customer's service connections
   */
  async getConnections(customerId: number) {
    const connections = await this.connectionRepository.find({
      where: { customerId },
      relations: ['utilityType', 'meter', 'connectionAddress'],
    });

    return connections.map((c) => ({
      connectionId: c.connectionId,
      utilityType: {
        id: c.utilityType?.utilityTypeId,
        name: c.utilityType?.name,
        code: c.utilityType?.code,
      },
      status: c.connectionStatus,
      meter: c.meter
        ? {
            meterId: c.meter.meterId,
            meterSerialNo: c.meter.meterSerialNo,
            status: c.meter.status,
            installationDate: c.meter.installationDate,
          }
        : null,
      address: c.connectionAddress
        ? {
            line1: c.connectionAddress.line1,
            postalCode: c.connectionAddress.postalCode,
          }
        : null,
    }));
  }

  /**
   * Get consumption history for a connection
   */
  async getConsumptionHistory(customerId: number, connectionId: number, months: number) {
    // Verify connection belongs to customer
    const connection = await this.connectionRepository.findOne({
      where: { connectionId, customerId },
      relations: ['meter'],
    });

    if (!connection) {
      throw new ForbiddenException('You do not have access to this connection');
    }

    if (!connection.meterId) {
      return { history: [], averageConsumption: 0 };
    }

    // Get readings for the last N months
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - months);

    const readings = await this.readingRepository.find({
      where: {
        meterId: connection.meterId,
      },
      order: { readingDate: 'DESC' },
      take: months + 1, // Get one extra for calculating first consumption
    });

    // Calculate consumption between readings
    const history = [];
    for (let i = 0; i < readings.length - 1; i++) {
      const current = readings[i];
      const previous = readings[i + 1];
      const consumption = Number(current.importReading || 0) - Number(previous.importReading || 0);

      history.push({
        readingId: current.readingId,
        readingDate: current.readingDate,
        currentReading: Number(current.importReading || 0),
        previousReading: Number(previous.importReading || 0),
        consumption: consumption > 0 ? consumption : 0,
        readingSource: current.readingSource,
      });
    }

    const totalConsumption = history.reduce((sum, h) => sum + h.consumption, 0);
    const averageConsumption = history.length > 0 ? totalConsumption / history.length : 0;

    return {
      connectionId,
      meterSerialNo: connection.meter?.meterSerialNo,
      history,
      averageConsumption: Math.round(averageConsumption * 100) / 100,
      totalConsumption,
    };
  }
}
