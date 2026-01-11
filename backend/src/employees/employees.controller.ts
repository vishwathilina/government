import { Controller, Get, Post, Put, Delete, Param, Query, Body, UseGuards, ParseIntPipe } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { EmployeesService } from './employees.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { EmployeeResponseDto } from './dto/employee-response.dto';
import { CreateEmployeeDto, UpdateEmployeeDto } from './dto/create-employee.dto';
import { ApiResponseDto } from '../common/dto/api-response.dto';
import { DashboardStatsDto } from './dto/dashboard-stats.dto';

@ApiTags('Employees')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('employees')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @Get('dashboard/stats')
  @ApiOperation({ summary: 'Get dashboard statistics for admin dashboard' })
  @ApiResponse({ status: 200, description: 'Dashboard stats retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getDashboardStats(): Promise<DashboardStatsDto> {
    return this.employeesService.getDashboardStats();
  }

  @Get()
  @ApiOperation({ summary: 'Get all employees (paginated)' })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number (default: 1)',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Items per page (default: 10)',
  })
  @ApiResponse({
    status: 200,
    description: 'List of employees retrieved successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<
    ApiResponseDto<{ data: EmployeeResponseDto[]; total: number; page: number; limit: number }>
  > {
    const result = await this.employeesService.findAll(page, limit);
    return {
      success: true,
      data: {
        data: result.data.map((emp) => EmployeeResponseDto.fromEntity(emp)),
        total: result.total,
        page: result.page,
        limit: result.limit,
      },
      message: 'Employees retrieved successfully',
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get employee by ID' })
  @ApiParam({ name: 'id', type: Number, description: 'Employee ID' })
  @ApiResponse({ status: 200, description: 'Employee found' })
  @ApiResponse({ status: 404, description: 'Employee not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ApiResponseDto<EmployeeResponseDto>> {
    const employee = await this.employeesService.findByIdOrFail(id);
    return {
      success: true,
      data: EmployeeResponseDto.fromEntity(employee),
      message: 'Employee retrieved successfully',
    };
  }

  @Post()
  @ApiOperation({ summary: 'Create a new employee' })
  @ApiBody({ type: CreateEmployeeDto })
  @ApiResponse({ status: 201, description: 'Employee created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 409, description: 'Conflict - username/email/employee number already exists' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async create(
    @Body() createEmployeeDto: CreateEmployeeDto,
  ): Promise<ApiResponseDto<EmployeeResponseDto>> {
    const employee = await this.employeesService.create(createEmployeeDto);
    return {
      success: true,
      data: EmployeeResponseDto.fromEntity(employee),
      message: 'Employee created successfully',
    };
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an employee' })
  @ApiParam({ name: 'id', type: Number, description: 'Employee ID' })
  @ApiBody({ type: UpdateEmployeeDto })
  @ApiResponse({ status: 200, description: 'Employee updated successfully' })
  @ApiResponse({ status: 404, description: 'Employee not found' })
  @ApiResponse({ status: 409, description: 'Conflict - username/email/employee number already exists' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateEmployeeDto: UpdateEmployeeDto,
  ): Promise<ApiResponseDto<EmployeeResponseDto>> {
    const employee = await this.employeesService.update(id, updateEmployeeDto);
    return {
      success: true,
      data: EmployeeResponseDto.fromEntity(employee),
      message: 'Employee updated successfully',
    };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an employee' })
  @ApiParam({ name: 'id', type: Number, description: 'Employee ID' })
  @ApiResponse({ status: 200, description: 'Employee deleted successfully' })
  @ApiResponse({ status: 404, description: 'Employee not found' })
  @ApiResponse({ status: 400, description: 'Cannot delete the last admin user' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async delete(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ApiResponseDto<null>> {
    await this.employeesService.delete(id);
    return {
      success: true,
      data: null,
      message: 'Employee deleted successfully',
    };
  }
}
