import { TokenResponseDto } from '../dto/token-response.dto';
import { AuthCodeDto } from '../dto/auth-code.dto';
import { Client } from '../interfaces/client.interface';
import { TokenPayload } from '../interfaces/token-payload.interface';
import { LogoutDto } from '../dto/logout.dto';
export declare class AuthService {
    private readonly jwtService;
    private readonly keyService;
    private readonly indentityService;
    private readonly openidService;
    private readonly refreshTokenService;
    private readonly accessTokenService;
    private readonly authCodeService;
    private readonly clientService;
    private configService;
    login(data: TokenPayload, options: {
        refreshToken: boolean;
        idToken?: any;
        tenant: string;
        client: Client;
    }): Promise<TokenResponseDto>;
    loginClient(client: Client, scope: string): Promise<any>;
    createMagicCode({ clientId, userId }: {
        clientId: any;
        userId: any;
    }): Promise<import("../models/auth-code.model").AuthorizationCodeModel>;
    createAuthorizationCode({ clientId, redirectUri, codeChallenge, method, userId }: {
        clientId: any;
        redirectUri: any;
        codeChallenge: any;
        method: any;
        userId: any;
    }): Promise<{
        code: string;
    }>;
    refreshTokens(refreshToken: string, clientId: string): Promise<TokenResponseDto>;
    revoke(token: string, type: "refresh_token" | "access_token", clientId: string): Promise<void>;
    logout(logoutDto: LogoutDto): Promise<void>;
    private generateAccessToken;
    private generateRefreshToken;
    exchangeAuthorizationCode(authCode: AuthCodeDto, codeVerifier: string, issueRefreshToken: boolean, client: Client): Promise<TokenResponseDto>;
    verifyPkce(codeVerifier: string, codeChallenge: string, method: string): boolean;
}
