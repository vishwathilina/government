import { OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
export declare class StripeModule implements OnModuleInit {
    private readonly configService;
    private readonly logger;
    constructor(configService: ConfigService);
    onModuleInit(): void;
}
