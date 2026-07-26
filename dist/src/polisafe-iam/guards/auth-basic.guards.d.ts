/// <reference types="cookie-parser" />
import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
export declare class AuthBasicGuard implements CanActivate {
    private jwtService;
    private configService;
    canActivate(context: ExecutionContext): Promise<boolean>;
    decodeBasicAuth(request: Request): {
        client_id: string;
        client_secret: string;
    };
}
