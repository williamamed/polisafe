export declare const ModeType: {
    readonly PRODUCTION: "production";
    readonly DEVELOPMENT: "development";
};
export declare class ConfigPolizei {
    serviceUrl: string;
    apiKey?: string;
    client_id?: string;
    client_secret?: string;
    mode: typeof ModeType[keyof typeof ModeType];
    logging?: boolean;
    permissionCheck: boolean;
    checkProviderPermissions: boolean;
    issuer: string;
    audience: string;
    _token?: string;
    scope?: string;
    _expireIn?: number;
}
