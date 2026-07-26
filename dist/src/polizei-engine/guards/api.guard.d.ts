import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ScopeService } from '../services/scope.service';
export declare class ApiGuard implements CanActivate {
    private reflector;
    private scopeService;
    constructor(reflector: Reflector, scopeService: ScopeService);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
