import { CanActivate, ExecutionContext } from '@nestjs/common';
export declare class PrivilegesGuard implements CanActivate {
    private configService;
    private httpService;
    private reflector;
    private options;
    canActivate(context: ExecutionContext): Promise<boolean>;
}
