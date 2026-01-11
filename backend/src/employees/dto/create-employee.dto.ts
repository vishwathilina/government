import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsEmail,
  IsNotEmpty,
  MinLength,
  MaxLength,
  IsOptional,
  IsNumber,
  Matches,
} from 'class-validator';

/**
 * DTO for creating a new employee
 */
export class CreateEmployeeDto {
  @ApiProperty({ description: 'First name', example: 'John' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(80)
  firstName: string;

  @ApiPropertyOptional({ description: 'Middle name', example: 'Michael' })
  @IsString()
  @IsOptional()
  @MaxLength(80)
  middleName?: string;

  @ApiProperty({ description: 'Last name', example: 'Doe' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(80)
  lastName: string;

  @ApiProperty({ description: 'Employee number', example: 'EMP006' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  employeeNo: string;

  @ApiProperty({ description: 'Job designation', example: 'Senior Engineer' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(80)
  designation: string;

  @ApiProperty({ description: 'Role in the system', example: 'Manager' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(80)
  role: string;

  @ApiProperty({ description: 'Department ID', example: 1 })
  @IsNumber()
  @IsNotEmpty()
  departmentId: number;

  @ApiProperty({ description: 'Email address', example: 'john.doe@utility.gov' })
  @IsEmail()
  @IsNotEmpty()
  @MaxLength(255)
  email: string;

  @ApiProperty({ description: 'Username for login', example: 'johndoe' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(80)
  @Matches(/^[a-zA-Z0-9_]+$/, {
    message: 'Username can only contain letters, numbers, and underscores',
  })
  username: string;

  @ApiProperty({ description: 'Password', example: 'SecurePass123!' })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(100)
  password: string;
}

/**
 * DTO for updating an employee
 */
export class UpdateEmployeeDto {
  @ApiPropertyOptional({ description: 'First name', example: 'John' })
  @IsString()
  @IsOptional()
  @MaxLength(80)
  firstName?: string;

  @ApiPropertyOptional({ description: 'Middle name', example: 'Michael' })
  @IsString()
  @IsOptional()
  @MaxLength(80)
  middleName?: string;

  @ApiPropertyOptional({ description: 'Last name', example: 'Doe' })
  @IsString()
  @IsOptional()
  @MaxLength(80)
  lastName?: string;

  @ApiPropertyOptional({ description: 'Employee number', example: 'EMP006' })
  @IsString()
  @IsOptional()
  @MaxLength(30)
  employeeNo?: string;

  @ApiPropertyOptional({ description: 'Job designation', example: 'Senior Engineer' })
  @IsString()
  @IsOptional()
  @MaxLength(80)
  designation?: string;

  @ApiPropertyOptional({ description: 'Role in the system', example: 'Manager' })
  @IsString()
  @IsOptional()
  @MaxLength(80)
  role?: string;

  @ApiPropertyOptional({ description: 'Department ID', example: 1 })
  @IsNumber()
  @IsOptional()
  departmentId?: number;

  @ApiPropertyOptional({ description: 'Email address', example: 'john.doe@utility.gov' })
  @IsEmail()
  @IsOptional()
  @MaxLength(255)
  email?: string;

  @ApiPropertyOptional({ description: 'Username for login', example: 'johndoe' })
  @IsString()
  @IsOptional()
  @MaxLength(80)
  @Matches(/^[a-zA-Z0-9_]+$/, {
    message: 'Username can only contain letters, numbers, and underscores',
  })
  username?: string;

  @ApiPropertyOptional({ description: 'New password (leave empty to keep current)', example: 'NewSecurePass123!' })
  @IsString()
  @IsOptional()
  @MinLength(8)
  @MaxLength(100)
  password?: string;
}
