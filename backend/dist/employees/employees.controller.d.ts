import { EmployeesService } from './employees.service';
import { EmployeeResponseDto } from './dto/employee-response.dto';
import { CreateEmployeeDto, UpdateEmployeeDto } from './dto/create-employee.dto';
import { ApiResponseDto } from '../common/dto/api-response.dto';
import { DashboardStatsDto } from './dto/dashboard-stats.dto';
export declare class EmployeesController {
    private readonly employeesService;
    constructor(employeesService: EmployeesService);
    getDashboardStats(): Promise<DashboardStatsDto>;
    findAll(page?: number, limit?: number): Promise<ApiResponseDto<{
        data: EmployeeResponseDto[];
        total: number;
        page: number;
        limit: number;
    }>>;
    findOne(id: number): Promise<ApiResponseDto<EmployeeResponseDto>>;
    create(createEmployeeDto: CreateEmployeeDto): Promise<ApiResponseDto<EmployeeResponseDto>>;
    update(id: number, updateEmployeeDto: UpdateEmployeeDto): Promise<ApiResponseDto<EmployeeResponseDto>>;
    delete(id: number): Promise<ApiResponseDto<null>>;
}
