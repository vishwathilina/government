"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConnectionsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const connections_controller_1 = require("./connections.controller");
const connections_service_1 = require("./connections.service");
const service_connection_entity_1 = require("../database/entities/service-connection.entity");
const connection_address_entity_1 = require("../database/entities/connection-address.entity");
const meter_entity_1 = require("../database/entities/meter.entity");
const utility_type_entity_1 = require("../database/entities/utility-type.entity");
const tariff_category_entity_1 = require("../database/entities/tariff-category.entity");
const customer_entity_1 = require("../database/entities/customer.entity");
let ConnectionsModule = class ConnectionsModule {
};
exports.ConnectionsModule = ConnectionsModule;
exports.ConnectionsModule = ConnectionsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                service_connection_entity_1.ServiceConnection,
                connection_address_entity_1.ConnectionAddress,
                meter_entity_1.Meter,
                utility_type_entity_1.UtilityType,
                tariff_category_entity_1.TariffCategory,
                customer_entity_1.Customer,
            ]),
        ],
        controllers: [connections_controller_1.ConnectionsController],
        providers: [connections_service_1.ConnectionsService],
        exports: [connections_service_1.ConnectionsService],
    })
], ConnectionsModule);
//# sourceMappingURL=connections.module.js.map