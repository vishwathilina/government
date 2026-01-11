"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerPortalModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const customer_portal_controller_1 = require("./customer-portal.controller");
const customer_portal_service_1 = require("./customer-portal.service");
const customer_entity_1 = require("../../database/entities/customer.entity");
const bill_entity_1 = require("../../database/entities/bill.entity");
const payment_entity_1 = require("../../database/entities/payment.entity");
const service_connection_entity_1 = require("../../database/entities/service-connection.entity");
const meter_reading_entity_1 = require("../../database/entities/meter-reading.entity");
let CustomerPortalModule = class CustomerPortalModule {
};
exports.CustomerPortalModule = CustomerPortalModule;
exports.CustomerPortalModule = CustomerPortalModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                customer_entity_1.Customer,
                bill_entity_1.Bill,
                payment_entity_1.Payment,
                service_connection_entity_1.ServiceConnection,
                meter_reading_entity_1.MeterReading,
            ]),
        ],
        controllers: [customer_portal_controller_1.CustomerPortalController],
        providers: [customer_portal_service_1.CustomerPortalService],
        exports: [customer_portal_service_1.CustomerPortalService],
    })
], CustomerPortalModule);
//# sourceMappingURL=customer-portal.module.js.map