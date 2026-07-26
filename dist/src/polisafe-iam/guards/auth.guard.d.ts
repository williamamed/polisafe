import { CanActivate, ExecutionContext } from '@nestjs/common';
export declare class AuthGuard implements CanActivate {
    private jwtService;
    private keyService;
    private configService;
    canActivate(context: ExecutionContext): Promise<boolean>;
    private extractTokenFromHeader;
    private getActiveTenant;
    validatePayload(payload: any): void;
}
