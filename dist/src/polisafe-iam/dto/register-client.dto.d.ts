export declare class RegisterClientDto {
    client_name: string;
    redirect_uris: Array<any>;
    token_endpoint_auth_method: 'none' | 'client_secret_post' | 'client_secret_basic';
    grant_types?: Array<any>;
    response_types?: Array<any>;
    client_uri: string;
    logo_uri: string;
    scope: string;
    contacts: Array<any>;
    tos_uri: Array<any>;
    policy_uri: Array<any>;
    jwks_uri: Array<any>;
    jwks: Array<any>;
    software_id: Array<any>;
    software_version: Array<any>;
}
