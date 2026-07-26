export declare class TokenDto {
    grant_type: 'refresh_token' | 'token' | 'password' | 'client_credentials' | 'authorization_code';
    refresh_token?: string;
    client_id?: string;
    code?: string;
    redirect_uri?: string;
    username?: string;
    password?: string;
    scope?: string;
    code_verifier?: string;
    credentials_basic?: {
        client_id: string;
        client_secret: string;
    };
    resource?: string;
}
