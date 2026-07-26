import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Response } from 'express';
export declare class SameOriginCookieGuard implements CanActivate {
    private readonly cookieName;
    private readonly cookieSecret;
    canActivate(context: ExecutionContext): boolean;
    setOriginCookie(res: Response): void;
    private generateCookieValue;
    private validateOriginCookie;
}
