import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { CustomerLoginDto } from './dto/customer-login.dto';
import { CustomerLoginResponseDto } from './dto/customer-login-response.dto';
import { CustomerRegisterDto, CustomerRegisterResponseDto } from './dto/customer-register.dto';
import { EmployeeResponseDto } from '../employees/dto/employee-response.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(loginDto: LoginDto): Promise<LoginResponseDto>;
    customerLogin(loginDto: CustomerLoginDto): Promise<CustomerLoginResponseDto>;
    customerRegister(registerDto: CustomerRegisterDto): Promise<CustomerRegisterResponseDto>;
    getProfile(req: any): Promise<EmployeeResponseDto>;
}
