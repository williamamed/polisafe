export interface Code {
    code?: string;
    userId: number;
    clientId: string;
    redirectUri: string;
    scopes?: string;
    codeChallenge?: string;
    codeChallengeMethod?: string;
    expiresAt: Date;
}
