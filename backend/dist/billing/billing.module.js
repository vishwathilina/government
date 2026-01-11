"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BillingModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const billing_controller_1 = require("./billing.controller");
const billing_service_1 = require("./billing.service");
const billing_event_listener_1 = require("./billing-event.listener");
const entities_1 = require("../database/entities");
let BillingModule = class BillingModule {
};
exports.BillingModule = BillingModule;
exports.BillingModule = BillingModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                entities_1.Bill,
                entities_1.BillDetail,
                entities_1.BillTax,
                entities_1.TariffSlab,
                entities_1.TariffCategory,
                entities_1.TaxConfig,
                entities_1.Meter,
                entities_1.MeterReading,
                entities_1.ServiceConnection,
                entities_1.Customer,
            ]),
        ],
        controllers: [billing_controller_1.BillingController],
        providers: [billing_service_1.BillingService, billing_event_listener_1.BillingEventListener],
        exports: [billing_service_1.BillingService],
    })
], BillingModule);
//# sourceMappingURL=billing.module.js.map