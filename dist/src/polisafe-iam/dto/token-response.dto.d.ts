export declare class TokenResponseDto {
    access_token: string;
    token_type: string;
    expires_in: number;
    refresh_token?: string;
    scope: string;
    state?: string;
}
