/// <reference types="cookie-parser" />
import { AuthRequestDto } from '../dto/auth-request.dto';
import { Request, Response } from 'express';
import { ErrorService } from '../services/error.service';
import { TokenDto } from '../dto/token-request.dto';
import { AuthService } from '../services/auth.service';
import { IdentityService } from '../services/identity.service';
import { OpenidService } from '../services/openid.service';
import { KeyService } from '../services/key.service';
import { ClientService } from '../services/client.service';
import { AuthCodeService } from '../services/auth-code.service';
import { RevokeDto } from '../dto/revoke.dto';
import { LogoutDto } from '../dto/logout.dto';
import { ConfigService } from '@nestjs/config';
import { ProvidersService } from '../services/providers.service';
import { RegisterPageDto } from '../dto/register-page.dto';
import { NotificationOauthService } from '../services/notification-oauth.service';
export declare class OauthController {
    identityService: IdentityService;
    keyService: KeyService;
    clientService: ClientService;
    authCodeService: AuthCodeService;
    openidService: OpenidService;
    authService: AuthService;
    errorService: ErrorService;
    configService: ConfigService;
    providersService: ProvidersService;
    notificationService: NotificationOauthService;
    authorize(): Promise<void>;
    authorizeGet(req: Request, authRequest: AuthRequestDto, response: Response): Promise<void>;
    getToken(req: Request, token: TokenDto, response: Response): Promise<import("../dto/token-response.dto").TokenResponseDto>;
    revoke(revokeDto: RevokeDto): Promise<{
        ok: boolean;
    }>;
    submitConsent(req: Request, body: any): Promise<{
        ok: boolean;
    }>;
    login(body: any, req: Request, response: Response): Promise<{
        ok: boolean;
        type: string;
    }>;
    logout(logoutDto: LogoutDto, req: Request, response: Response): Promise<void>;
    callback(query: any, req: Request, response: Response): Promise<void>;
    provider(query: any, req: Request, response: Response): Promise<void>;
    register(query: RegisterPageDto, req: Request, response: Response): Promise<void>;
    callbackMagic(query: any, req: Request, response: Response): Promise<void>;
    recover(query: RegisterPageDto, req: Request, response: Response): Promise<void>;
}
export declare const idToken: {
    iss: string;
    sub: string;
    aud: string;
    exp: number;
    iat: number;
    auth_time: number;
    nonce: string;
    email: string;
    email_verified: boolean;
    name: string;
    given_name: string;
    family_name: string;
    picture: string;
    locale: string;
};
