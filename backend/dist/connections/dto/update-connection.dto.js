"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateConnectionDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const swagger_2 = require("@nestjs/swagger");
const create_connection_dto_1 = require("./create-connection.dto");
const service_connection_entity_1 = require("../../database/entities/service-connection.entity");
class UpdateConnectionDto extends (0, swagger_1.PartialType)(create_connection_dto_1.CreateConnectionDto) {
}
exports.UpdateConnectionDto = UpdateConnectionDto;
__decorate([
    (0, swagger_2.ApiPropertyOptional)({
        description: 'Connection status',
        enum: service_connection_entity_1.ConnectionStatus,
        example: service_connection_entity_1.ConnectionStatus.ACTIVE,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(service_connection_entity_1.ConnectionStatus, {
        message: `Connection status must be one of: ${Object.values(service_connection_entity_1.ConnectionStatus).join(', ')}`,
    }),
    __metadata("design:type", String)
], UpdateConnectionDto.prototype, "connectionStatus", void 0);
//# sourceMappingURL=update-connection.dto.js.map