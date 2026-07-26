export declare const Permission: (name?: string, config?: any) => <TFunction extends Function, Y>(target: object | TFunction, propertyKey?: string | symbol, descriptor?: TypedPropertyDescriptor<Y>) => void;
export declare const Scope: (args: string, token_type?: 'user' | 'client' | 'all') => <TFunction extends Function, Y>(target: object | TFunction, propertyKey?: string | symbol, descriptor?: TypedPropertyDescriptor<Y>) => void;
export declare const UserToken: (...dataOrPipes: (number | import("@nestjs/common").PipeTransform<any, any> | import("@nestjs/common").Type<import("@nestjs/common").PipeTransform<any, any>>)[]) => ParameterDecorator;
export declare const TokenInfo: (...dataOrPipes: (number | import("@nestjs/common").PipeTransform<any, any> | import("@nestjs/common").Type<import("@nestjs/common").PipeTransform<any, any>>)[]) => ParameterDecorator;
export declare const MapTenant: (...dataOrPipes: (string | {
    id: string;
    type: 'query' | 'body';
} | import("@nestjs/common").PipeTransform<any, any> | import("@nestjs/common").Type<import("@nestjs/common").PipeTransform<any, any>>)[]) => ParameterDecorator;
export interface TokenPayload {
    sub: string;
    iss: string;
    aud: string | string[];
    exp: number;
    iat: number;
    jti?: string;
    client_id?: string;
    name?: string;
    given_name?: string;
    family_name?: string;
    middle_name?: string;
    nickname?: string;
    preferred_username?: string;
    picture?: string;
    email?: string;
    email_verified?: boolean;
    roles?: string[];
    permissions?: string[];
    tid?: string;
    tenant?: string;
    tenants?: string[];
    id: number;
    is_client?: boolean;
}
