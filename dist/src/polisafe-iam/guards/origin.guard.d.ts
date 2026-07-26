import { CanActivate, ExecutionContext } from '@nestjs/common';
export declare class SameOriginGuard implements CanActivate {
    private readonly allowedDomains;
    constructor(allowedDomains?: string[]);
    canActivate(context: ExecutionContext): boolean;
}
