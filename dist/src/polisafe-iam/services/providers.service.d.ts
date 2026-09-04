import { HttpService } from "@nestjs/axios";
import { ISettings } from "../interfaces/settings.interface";
export declare class ProvidersService {
    PROVIDERS: {
        google: {
            name: string;
            authUrl: string;
            tokenUrl: string;
            clientId: string;
            scope: string;
            responseType: string;
            getCodeChallengeMethod: string;
            userinfoUrl: string;
        };
        linkedin: {
            name: string;
            authUrl: string;
            tokenUrl: string;
            clientId: string;
            scope: string;
            responseType: string;
            getCodeChallengeMethod: string;
            userinfoUrl: string;
        };
        github: {
            name: string;
            authUrl: string;
            tokenUrl: string;
            clientId: string;
            scope: string;
            responseType: string;
            getCodeChallengeMethod: string;
            userinfoUrl: string;
        };
        facebook: {
            name: string;
            authUrl: string;
            tokenUrl: string;
            clientId: string;
            scope: string;
            responseType: string;
            getCodeChallengeMethod: string;
            userinfoUrl: string;
        };
    };
    httpService: HttpService;
    generateRandomString(length?: number): string;
    generateCodeVerifier(): Promise<string>;
    generateCodeChallenge(codeVerifier: any, method?: string): Promise<any>;
    generateState(): string;
    startAuth(providerName: any, urlLogin: string, appSettings: ISettings): Promise<{
        url: string;
        state: string;
        codeVerifier: string;
    }>;
    handleCallback(query: any, providerName: string, savedState: string, codeVerifier: string, appSettings: ISettings): Promise<{
        userProfile: {
            provider: any;
            id: any;
            email: any;
            name: any;
            firstName: any;
            lastName: any;
            picture: any;
            raw: any;
            emailVerified: boolean;
        };
        url: any;
    }>;
    exchangeCodeForTokens(providerName: any, code: any, codeVerifier: any, appSettings: ISettings): Promise<any>;
    getUserProfile(providerName: any, accessToken: any, url: string): Promise<{
        provider: any;
        id: any;
        email: any;
        name: any;
        firstName: any;
        lastName: any;
        picture: any;
        raw: any;
        emailVerified: boolean;
    }>;
    normalizeUserProfile(provider: any, rawProfile: any): {
        provider: any;
        id: any;
        email: any;
        name: any;
        firstName: any;
        lastName: any;
        picture: any;
        raw: any;
        emailVerified: boolean;
    };
    showError(message: any): void;
    encode(data: any): string;
    decode(text: string): any;
}
