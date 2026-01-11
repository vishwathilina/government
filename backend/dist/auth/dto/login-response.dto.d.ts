export declare class LoginEmployeeDto {
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
}
export declare class LoginResponseDto {
    accessToken: string;
    tokenType: string;
    employee: LoginEmployeeDto;
}
