import { OnModuleInit } from '@nestjs/common';
import { SecurityScope } from '../models/security.scope';
import { SecurityUser } from '../models/security.user';
import { SecurityRole } from '../models/security.role';
import { SecurityPermission } from '../models/security.permission';
import { TraceService } from './trace.service';
import { SecurityTrace } from '../models/security.trace';
import { ClientService } from '../../polisafe-iam/services/client.service';
import { OpenAPIObject } from '@nestjs/swagger';
import { ScopesService } from '../../polisafe-iam/services/scopes.service';
export declare class CreatorService implements OnModuleInit {
    scopeModel: typeof SecurityScope;
    userModel: typeof SecurityUser;
    roleModel: typeof SecurityRole;
    permissionModel: typeof SecurityPermission;
    traceModel: typeof SecurityTrace;
    traceService: TraceService;
    clientService: ClientService;
    scopesService: ScopesService;
    private options;
    private document;
    setDocument(document: OpenAPIObject): void;
    getDocument(): OpenAPIObject | null;
    onModuleInit(): Promise<void>;
    createProject(): Promise<{
        tid: number;
    }>;
    getAllEndpoints(): any[];
    getEndpointsGroupedByTag(): {};
    syncUiConfig(client_id: string, tid: string): Promise<void>;
    getDefaultSettings(): {
        idImage: any;
        adapters: {};
        configApps: {
            global: {};
            polisafe: ({
                label: string;
                name: string;
                type: string;
                value: string;
                description: string;
                options: string;
                group: string;
                placeholder?: undefined;
                url?: undefined;
                mapResult?: undefined;
                loading?: undefined;
                data?: undefined;
            } | {
                label: string;
                name: string;
                type: string;
                value: string;
                placeholder: string;
                description: string;
                group: string;
                options?: undefined;
                url?: undefined;
                mapResult?: undefined;
                loading?: undefined;
                data?: undefined;
            } | {
                label: string;
                name: string;
                type: string;
                value: boolean;
                description: string;
                group: string;
                options?: undefined;
                placeholder?: undefined;
                url?: undefined;
                mapResult?: undefined;
                loading?: undefined;
                data?: undefined;
            } | {
                label: string;
                name: string;
                type: string;
                value: boolean;
                placeholder: string;
                group: string;
                description: string;
                options?: undefined;
                url?: undefined;
                mapResult?: undefined;
                loading?: undefined;
                data?: undefined;
            } | {
                type: string;
                name: string;
                label: string;
                options: any;
                placeholder: any;
                group: string;
                value: boolean;
                description: string;
                url?: undefined;
                mapResult?: undefined;
                loading?: undefined;
                data?: undefined;
            } | {
                type: string;
                name: string;
                label: string;
                options: any;
                placeholder: string;
                group: string;
                value: string;
                description: string;
                url?: undefined;
                mapResult?: undefined;
                loading?: undefined;
                data?: undefined;
            } | {
                type: string;
                name: string;
                label: string;
                options: any;
                placeholder: any;
                group: string;
                url: any;
                mapResult: any;
                value: boolean;
                description: string;
                loading?: undefined;
                data?: undefined;
            } | {
                type: string;
                name: string;
                label: string;
                options: any;
                placeholder: any;
                group: string;
                url: any;
                mapResult: any;
                value: string;
                description: string;
                loading?: undefined;
                data?: undefined;
            } | {
                type: string;
                name: string;
                label: string;
                options: any;
                placeholder: any;
                group: string;
                url: string;
                mapResult: string;
                loading: boolean;
                data: {
                    label: string;
                    value: string;
                }[];
                value: string;
                description: string;
            })[];
        };
    };
}
