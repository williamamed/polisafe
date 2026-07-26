export interface IdTokenPayload {
    aud: string;
    email: string;
    sub: string;
    exp: number;
    iat: number;
    auth_time: number;
    nonce: string;
    email_verified?: boolean;
    name?: string;
    given_name?: string;
    family_name?: string;
    picture?: string;
}
