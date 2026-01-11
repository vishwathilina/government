"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const event_emitter_1 = require("@nestjs/event-emitter");
const auth_module_1 = require("./auth/auth.module");
const employees_module_1 = require("./employees/employees.module");
const customers_module_1 = require("./customers/customers.module");
const connections_module_1 = require("./connections/connections.module");
const lookup_module_1 = require("./lookup/lookup.module");
const database_module_1 = require("./database/database.module");
const readings_module_1 = require("./readings/readings.module");
const billing_module_1 = require("./billing/billing.module");
const stripe_module_1 = require("./stripe/stripe.module");
const payments_module_1 = require("./payments/payments.module");
const webhooks_module_1 = require("./webhooks/webhooks.module");
const assets_module_1 = require("./assets/assets.module");
const work_orders_module_1 = require("./work-orders/work-orders.module");
const complaints_module_1 = require("./complaints/complaints.module");
const meters_module_1 = require("./meters/meters.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: '.env',
            }),
            event_emitter_1.EventEmitterModule.forRoot({
                wildcard: false,
                delimiter: '.',
                newListener: false,
                ignoreErrors: false,
            }),
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule],
                useFactory: (configService) => ({
                    type: 'mssql',
                    host: configService.get('DB_HOST', 'localhost'),
                    port: parseInt(configService.get('DB_PORT', '1433'), 10),
                    username: configService.get('DB_USERNAME'),
                    password: configService.get('DB_PASSWORD'),
                    database: configService.get('DB_DATABASE', 'UtilityManagementDB'),
                    entities: [__dirname + '/**/*.entity{.ts,.js}'],
                    synchronize: false,
                    logging: configService.get('NODE_ENV') === 'development',
                    options: {
                        encrypt: false,
                        trustServerCertificate: configService.get('DB_TRUST_SERVER_CERTIFICATE') === 'true',
                    },
                    extra: {
                        trustedConnection: !configService.get('DB_USERNAME'),
                    },
                }),
                inject: [config_1.ConfigService],
            }),
            database_module_1.DatabaseModule,
            auth_module_1.AuthModule,
            employees_module_1.EmployeesModule,
            customers_module_1.CustomersModule,
            connections_module_1.ConnectionsModule,
            lookup_module_1.LookupModule,
            readings_module_1.ReadingsModule,
            billing_module_1.BillingModule,
            stripe_module_1.StripeModule,
            payments_module_1.PaymentsModule,
            webhooks_module_1.WebhooksModule,
            assets_module_1.AssetsModule,
            work_orders_module_1.WorkOrdersModule,
            complaints_module_1.ComplaintsModule,
            meters_module_1.MetersModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map