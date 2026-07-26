import { CanActivate, ExecutionContext } from '@nestjs/common';
export declare class AuthGuard implements CanActivate {
    private jwtService;
    canActivate(context: ExecutionContext): Promise<boolean>;
    private extractTokenFromHeader;
}
