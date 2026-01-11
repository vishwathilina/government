"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const auth_service_1 = require("./auth.service");
const login_dto_1 = require("./dto/login.dto");
const login_response_dto_1 = require("./dto/login-response.dto");
const customer_login_dto_1 = require("./dto/customer-login.dto");
const customer_login_response_dto_1 = require("./dto/customer-login-response.dto");
const customer_register_dto_1 = require("./dto/customer-register.dto");
const jwt_auth_guard_1 = require("./guards/jwt-auth.guard");
const employee_response_dto_1 = require("../employees/dto/employee-response.dto");
let AuthController = class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    async login(loginDto) {
        return await this.authService.login(loginDto);
    }
    async customerLogin(loginDto) {
        return await this.authService.customerLogin(loginDto);
    }
    async customerRegister(registerDto) {
        return await this.authService.customerRegister(registerDto);
    }
    async getProfile(req) {
        const employee = await this.authService.getProfile(req.user.employeeId);
        return employee_response_dto_1.EmployeeResponseDto.fromEntity(employee);
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('login'),
    (0, swagger_1.ApiOperation)({ summary: 'Employee login' }),
    (0, swagger_1.ApiBody)({ type: login_dto_1.LoginDto }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Login successful',
        type: login_response_dto_1.LoginResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Invalid credentials',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_dto_1.LoginDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Post)('customer/login'),
    (0, swagger_1.ApiOperation)({ summary: 'Customer login' }),
    (0, swagger_1.ApiBody)({ type: customer_login_dto_1.CustomerLoginDto }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Customer login successful',
        type: customer_login_response_dto_1.CustomerLoginResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Invalid credentials',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [customer_login_dto_1.CustomerLoginDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "customerLogin", null);
__decorate([
    (0, common_1.Post)('customer/register'),
    (0, swagger_1.ApiOperation)({ summary: 'Customer self-registration' }),
    (0, swagger_1.ApiBody)({ type: customer_register_dto_1.CustomerRegisterDto }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Customer registered successfully',
        type: customer_register_dto_1.CustomerRegisterResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Bad request - validation failed',
    }),
    (0, swagger_1.ApiResponse)({
        status: 409,
        description: 'Conflict - email or identity reference already exists',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [customer_register_dto_1.CustomerRegisterDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "customerRegister", null);
__decorate([
    (0, common_1.Get)('profile'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Get current user profile' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Profile retrieved successfully',
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized',
    }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getProfile", null);
exports.AuthController = AuthController = __decorate([
    (0, swagger_1.ApiTags)('Authentication'),
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map