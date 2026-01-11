"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkOrdersModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const work_orders_service_1 = require("./work-orders.service");
const work_orders_controller_1 = require("./work-orders.controller");
const work_order_entity_1 = require("../database/entities/work-order.entity");
const work_order_labor_entity_1 = require("../database/entities/work-order-labor.entity");
const work_order_item_usage_entity_1 = require("../database/entities/work-order-item-usage.entity");
let WorkOrdersModule = class WorkOrdersModule {
};
exports.WorkOrdersModule = WorkOrdersModule;
exports.WorkOrdersModule = WorkOrdersModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([work_order_entity_1.WorkOrder, work_order_labor_entity_1.WorkOrderLabor, work_order_item_usage_entity_1.WorkOrderItemUsage])],
        controllers: [work_orders_controller_1.WorkOrdersController],
        providers: [work_orders_service_1.WorkOrdersService],
        exports: [work_orders_service_1.WorkOrdersService],
    })
], WorkOrdersModule);
//# sourceMappingURL=work-orders.module.js.map