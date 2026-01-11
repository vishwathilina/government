import { Employee } from '../../database/entities/employee.entity';
export declare class EmployeeResponseDto {
    employeeId: number;
    firstName: string;
    middleName: string | null;
    lastName: string;
    fullName: string;
    employeeNo: string;
    designation: string;
    role: string;
    departmentId: number;
    email: string;
    username: string;
    lastLoginAt: Date | null;
    static fromEntity(employee: Employee): EmployeeResponseDto;
}
