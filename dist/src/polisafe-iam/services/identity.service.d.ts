import { OnModuleInit } from '@nestjs/common';
import { IdentityModel } from '../interfaces/identity.model.interface';
import { User } from '../interfaces/user.interface';
import { ISettings } from '../interfaces/settings.interface';
export declare class IdentityService implements OnModuleInit {
    private discoverService;
    private reflector;
    private clientService;
    private model;
    onModuleInit(): Promise<void>;
    getModel(): IdentityModel;
    getAccessTokenClaims(data: {
        user: User;
        roles?: string[];
        tenants?: string[];
        scope: string;
        tid: string;
    }): Promise<any>;
    getSettings(tenantId: string, visibility: 'public' | 'private' | 'any'): Promise<ISettings>;
    getClientSettings(tenantId: string, clientId: string): Promise<ISettings>;
    getPublicClientSettings(tenantId: string, clientId: string): Promise<ISettings>;
    getAppSettings(tenantId: string, app: string): Promise<ISettings>;
    getClaims2(sub: string, scope: string, client_id: string): Promise<{}>;
    getPermissionsMapClient(scope: string, cliendId: string): Promise<any>;
    getPermissionsMap(scope: string, tenant: string): Promise<{
        name: any;
        description: any;
    }[]>;
    private parseScope;
    private parseURIScope;
    generateRandomString(length?: number): string;
}
