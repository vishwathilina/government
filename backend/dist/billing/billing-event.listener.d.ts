import { Repository } from 'typeorm';
import { MeterReadingCreatedEvent } from '../readings/events';
import { BillingService } from './billing.service';
import { Bill, MeterReading, ServiceConnection } from '../database/entities';
export declare class BillingEventListener {
    private readonly billingService;
    private readonly readingRepository;
    private readonly billRepository;
    private readonly connectionRepository;
    private readonly logger;
    constructor(billingService: BillingService, readingRepository: Repository<MeterReading>, billRepository: Repository<Bill>, connectionRepository: Repository<ServiceConnection>);
    handleMeterReadingCreated(event: MeterReadingCreatedEvent): Promise<void>;
}
