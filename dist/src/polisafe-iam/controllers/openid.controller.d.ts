/// <reference types="cookie-parser" />
import { KeyService } from '../services/key.service';
import { Request, Response } from 'express';
import { VerifyDto } from '../dto/verify.dto';
export declare class OpenidController {
    private configService;
    private identityService;
    keyService: KeyService;
    private readonly openidService;
    private readonly clientService;
    userInfo(userToken: any): Promise<any>;
    conf(): Promise<{
        issuer: string;
        authorization_endpoint: string;
        token_endpoint: string;
        userinfo_endpoint: string;
        revocation_endpoint: string;
        introspection_endpoint: string;
        end_session_endpoint: string;
        jwks_uri: string;
        grant_types_supported: string[];
        response_types_supported: string[];
        subject_types_supported: string[];
        id_token_signing_alg_values_supported: string[];
        response_modes_supported: string[];
    }>;
    getKeys(tenant: string): Promise<any>;
    instrospect(): Promise<string>;
    activation(query: VerifyDto, req: Request, response: Response): Promise<void>;
    invitation(query: any, req: Request, response: Response): Promise<void>;
}
