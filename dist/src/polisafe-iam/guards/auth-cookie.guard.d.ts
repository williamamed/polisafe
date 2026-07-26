import { CanActivate, ExecutionContext } from '@nestjs/common';
export declare class AuthCookieGuard implements CanActivate {
    private jwtService;
    private keyService;
    private configService;
    canActivate(context: ExecutionContext): Promise<boolean>;
    private extractTokenFromHeader;
}
