export interface AccessToken {
    id?: string;
    token: string;
    userId: number;
    clientId?: string;
    expiresAt: Date;
    isRevoked: boolean;
    scope: string;
}
