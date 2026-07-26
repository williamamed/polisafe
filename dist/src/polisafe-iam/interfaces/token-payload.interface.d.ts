export interface TokenPayload {
    aud?: string;
    scope: string;
    client_id: string;
    sub: string;
    resource?: string;
    tid?: string;
}
