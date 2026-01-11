import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomersController } from './customers.controller';
import { CustomersService } from './customers.service';
import { Customer } from '../database/entities/customer.entity';
import { CustomerAddress } from '../database/entities/customer-address.entity';
import { CustomerPhone } from '../database/entities/customer-phone.entity';
import { CustomerPortalModule } from './customer-portal/customer-portal.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Customer, CustomerAddress, CustomerPhone]),
    CustomerPortalModule,
  ],
  controllers: [CustomersController],
  providers: [CustomersService],
  exports: [CustomersService, CustomerPortalModule],
})
export class CustomersModule {}
