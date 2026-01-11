export declare class Employee {
    employeeId: number;
    firstName: string;
    middleName: string | null;
    lastName: string;
    employeeNo: string;
    designation: string;
    role: string;
    departmentId: number;
    email: string;
    username: string;
    passwordHash: string;
    lastLoginAt: Date | null;
    get fullName(): string;
}
