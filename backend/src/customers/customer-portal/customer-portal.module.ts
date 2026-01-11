import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerPortalController } from './customer-portal.controller';
import { CustomerPortalService } from './customer-portal.service';
import { Customer } from '../../database/entities/customer.entity';
import { Bill } from '../../database/entities/bill.entity';
import { Payment } from '../../database/entities/payment.entity';
import { ServiceConnection } from '../../database/entities/service-connection.entity';
import { MeterReading } from '../../database/entities/meter-reading.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Customer,
      Bill,
      Payment,
      ServiceConnection,
      MeterReading,
    ]),
  ],
  controllers: [CustomerPortalController],
  providers: [CustomerPortalService],
  exports: [CustomerPortalService],
})
export class CustomerPortalModule {}
