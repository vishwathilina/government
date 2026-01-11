import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Param,
  ParseIntPipe,
  HttpStatus,
  HttpCode,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';
import { CustomerJwtAuthGuard } from '../../auth/guards/customer-jwt-auth.guard';
import { CustomerPortalService } from './customer-portal.service';

/**
 * Controller for customer portal operations
 * Provides self-service endpoints for customers to view their bills, payments, and account info
 */
@ApiTags('Customer Portal')
@ApiBearerAuth()
@UseGuards(CustomerJwtAuthGuard)
@Controller('customer-portal')
export class CustomerPortalController {
  constructor(private readonly customerPortalService: CustomerPortalService) {}

  // ═══════════════════════════════════════════════════════════════════════════
  // Dashboard Endpoints
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Get customer dashboard summary
   */
  @Get('dashboard')
  @ApiOperation({
    summary: 'Get customer dashboard data',
    description: 'Retrieve dashboard summary including unpaid bills, recent payments, and account info',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Dashboard data retrieved successfully',
  })
  async getDashboard(@Request() req: any) {
    const customerId = req.user.sub; // Customer ID from JWT
    return this.customerPortalService.getDashboardData(customerId);
  }

  /**
   * Get customer profile
   */
  @Get('profile')
  @ApiOperation({
    summary: 'Get customer profile',
    description: 'Retrieve the current customer profile information',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Profile retrieved successfully',
  })
  async getProfile(@Request() req: any) {
    const customerId = req.user.sub;
    return this.customerPortalService.getCustomerProfile(customerId);
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // Bills Endpoints
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Get customer's unpaid bills
   */
  @Get('bills/unpaid')
  @ApiOperation({
    summary: 'Get unpaid bills',
    description: 'Retrieve all unpaid bills for the logged-in customer',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Unpaid bills retrieved successfully',
  })
  async getUnpaidBills(@Request() req: any) {
    const customerId = req.user.sub;
    return this.customerPortalService.getUnpaidBills(customerId);
  }

  /**
   * Get customer's bill history
   */
  @Get('bills')
  @ApiOperation({
    summary: 'Get bill history',
    description: 'Retrieve bill history with pagination',
  })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiQuery({ name: 'status', required: false, enum: ['PAID', 'UNPAID', 'OVERDUE', 'PARTIAL'] })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Bills retrieved successfully',
  })
  async getBillHistory(
    @Request() req: any,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('status') status?: string,
  ) {
    const customerId = req.user.sub;
    return this.customerPortalService.getBillHistory(customerId, {
      page: page || 1,
      limit: limit || 10,
      status,
    });
  }

  /**
   * Get specific bill details
   */
  @Get('bills/:billId')
  @ApiOperation({
    summary: 'Get bill details',
    description: 'Retrieve detailed information about a specific bill',
  })
  @ApiParam({ name: 'billId', type: Number })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Bill details retrieved successfully',
  })
  async getBillDetails(
    @Request() req: any,
    @Param('billId', ParseIntPipe) billId: number,
  ) {
    const customerId = req.user.sub;
    return this.customerPortalService.getBillDetails(customerId, billId);
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // Payments Endpoints
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Get customer's payment history
   */
  @Get('payments')
  @ApiOperation({
    summary: 'Get payment history',
    description: 'Retrieve payment history with pagination',
  })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Payments retrieved successfully',
  })
  async getPaymentHistory(
    @Request() req: any,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    const customerId = req.user.sub;
    return this.customerPortalService.getPaymentHistory(customerId, {
      page: page || 1,
      limit: limit || 10,
    });
  }

  /**
   * Get payment receipt
   */
  @Get('payments/:paymentId/receipt')
  @ApiOperation({
    summary: 'Get payment receipt',
    description: 'Retrieve receipt details for a specific payment',
  })
  @ApiParam({ name: 'paymentId', type: Number })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Receipt retrieved successfully',
  })
  async getPaymentReceipt(
    @Request() req: any,
    @Param('paymentId', ParseIntPipe) paymentId: number,
  ) {
    const customerId = req.user.sub;
    return this.customerPortalService.getPaymentReceipt(customerId, paymentId);
  }

  /**
   * Create a payment (customer self-service)
   */
  @Post('payments')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create a payment',
    description: 'Record a payment for a bill (customer self-service)',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Payment recorded successfully',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid payment data',
  })
  async createPayment(
    @Request() req: any,
    @Body() createPaymentDto: {
      billId: number;
      paymentAmount: number;
      paymentMethod: string;
      paymentDate: string;
    },
  ) {
    const customerId = req.user.sub;
    return this.customerPortalService.createPayment(customerId, createPaymentDto);
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // Connections & Meters
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Get customer's service connections
   */
  @Get('connections')
  @ApiOperation({
    summary: 'Get service connections',
    description: 'Retrieve all service connections for the customer',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Connections retrieved successfully',
  })
  async getConnections(@Request() req: any) {
    const customerId = req.user.sub;
    return this.customerPortalService.getConnections(customerId);
  }

  /**
   * Get consumption history for a connection
   */
  @Get('connections/:connectionId/consumption')
  @ApiOperation({
    summary: 'Get consumption history',
    description: 'Retrieve consumption history for a specific connection',
  })
  @ApiParam({ name: 'connectionId', type: Number })
  @ApiQuery({ name: 'months', required: false, type: Number, example: 12 })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Consumption history retrieved successfully',
  })
  async getConsumptionHistory(
    @Request() req: any,
    @Param('connectionId', ParseIntPipe) connectionId: number,
    @Query('months') months?: number,
  ) {
    const customerId = req.user.sub;
    return this.customerPortalService.getConsumptionHistory(customerId, connectionId, months || 12);
  }
}
