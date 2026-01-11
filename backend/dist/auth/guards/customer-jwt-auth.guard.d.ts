import { ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
declare const CustomerJwtAuthGuard_base: import("@nestjs/passport").Type<import("@nestjs/passport").IAuthGuard>;
export declare class CustomerJwtAuthGuard extends CustomerJwtAuthGuard_base {
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean>;
    handleRequest<TUser = any>(err: any, user: any, info: any): TUser;
}
export {};
