import { Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { EmployeesService } from '../../employees/employees.service';
declare const JwtStrategy_base: new (...args: any[]) => Strategy;
export declare class JwtStrategy extends JwtStrategy_base {
    private readonly configService;
    private readonly employeesService;
    constructor(configService: ConfigService, employeesService: EmployeesService);
    validate(payload: JwtPayload): Promise<{
        employeeId: number;
        username: string;
        email: string;
        role: string;
        firstName: string;
        lastName: string;
        fullName: string;
    }>;
}
export {};
