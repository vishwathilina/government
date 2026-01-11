import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployeesService } from './employees.service';
import { EmployeesController } from './employees.controller';
import { Employee } from '../database/entities/employee.entity';
import { Customer } from '../database/entities/customer.entity';
import { ServiceConnection } from '../database/entities/service-connection.entity';
import { Bill } from '../database/entities/bill.entity';
import { Payment } from '../database/entities/payment.entity';
import { UtilityType } from '../database/entities/utility-type.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Employee,
      Customer,
      ServiceConnection,
      Bill,
      Payment,
      UtilityType,
    ]),
  ],
  controllers: [EmployeesController],
  providers: [EmployeesService],
  exports: [EmployeesService],
})
export class EmployeesModule {}
