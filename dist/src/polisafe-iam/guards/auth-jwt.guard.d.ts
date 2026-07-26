import { ExecutionContext } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
declare const JwtAuthGuard_base: import("@nestjs/passport").Type<import("@nestjs/passport").IAuthGuard>;
export declare class JwtAuthGuard extends JwtAuthGuard_base {
    configService: ConfigService;
    handleRequest(err: any, user: any, info: any, context: ExecutionContext, status?: any): any;
}
declare const JwtAuthCookieGuard_base: import("@nestjs/passport").Type<import("@nestjs/passport").IAuthGuard>;
export declare class JwtAuthCookieGuard extends JwtAuthCookieGuard_base {
    configService: ConfigService;
    handleRequest(err: any, user: any, info: any, context: ExecutionContext, status?: any): any;
}
export {};
