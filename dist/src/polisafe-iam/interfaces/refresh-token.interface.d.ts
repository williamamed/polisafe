export interface RefreshToken {
    id?: string;
    token: string;
    userId: number;
    clientId?: string;
    expiresAt: Date;
    isRevoked: boolean;
    scope: string;
    accessTokenId: string;
}
