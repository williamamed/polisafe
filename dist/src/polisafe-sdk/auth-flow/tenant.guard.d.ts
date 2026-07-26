import { CanActivate, ExecutionContext } from '@nestjs/common';
export declare class TenantGuard implements CanActivate {
    private configService;
    canActivate(context: ExecutionContext): Promise<boolean>;
    private getActiveTenant;
}
