export declare class RevokeDto {
    token_type_hint: "access_token" | "refresh_token";
    client_id?: string;
    token: string;
    credentials_basic?: {
        client_id: string;
        client_secret: string;
    };
}
