export declare class AuthCodeDto {
    id?: string;
    code?: string;
    userId: number;
    clientId: string;
    redirectUri: string;
    scopes?: string;
    codeChallenge?: string;
    codeChallengeMethod?: string;
    expiresAt: Date;
}
