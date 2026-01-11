import { CreateConnectionDto } from './create-connection.dto';
import { ConnectionStatus } from '../../database/entities/service-connection.entity';
declare const UpdateConnectionDto_base: import("@nestjs/common").Type<Partial<CreateConnectionDto>>;
export declare class UpdateConnectionDto extends UpdateConnectionDto_base {
    connectionStatus?: ConnectionStatus;
}
export {};
