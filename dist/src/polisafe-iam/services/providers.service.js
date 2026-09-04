"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProvidersService = void 0;
const common_1 = require("@nestjs/common");
const crypto = __importStar(require("crypto"));
const buffer_1 = require("buffer");
const url_1 = require("url");
const axios_1 = require("@nestjs/axios");
const rxjs_1 = require("rxjs");
let ProvidersService = class ProvidersService {
    constructor() {
        this.PROVIDERS = {
            google: {
                name: 'Google',
                authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
                tokenUrl: 'https://oauth2.googleapis.com/token',
                clientId: 'TU_GOOGLE_CLIENT_ID',
                scope: 'email profile openid',
                responseType: 'code',
                getCodeChallengeMethod: 'S256',
                userinfoUrl: 'https://www.googleapis.com/oauth2/v3/userinfo'
            },
            linkedin: {
                name: 'LinkedIn',
                authUrl: 'https://www.linkedin.com/oauth/v2/authorization',
                tokenUrl: 'https://www.linkedin.com/oauth/v2/accessToken',
                clientId: 'TU_LINKEDIN_CLIENT_ID',
                scope: 'openid email profile',
                responseType: 'code',
                getCodeChallengeMethod: 'S256',
                userinfoUrl: 'https://api.linkedin.com/v2/userinfo'
            },
            github: {
                name: 'GitHub',
                authUrl: 'https://github.com/login/oauth/authorize',
                tokenUrl: 'https://github.com/login/oauth/access_token',
                clientId: 'TU_GITHUB_CLIENT_ID',
                scope: 'read:user user:email',
                responseType: 'code',
                getCodeChallengeMethod: 'plain',
                userinfoUrl: 'https://api.github.com/user'
            },
            facebook: {
                name: 'Facebook',
                authUrl: 'https://www.facebook.com/v18.0/dialog/oauth',
                tokenUrl: 'https://graph.facebook.com/v18.0/oauth/access_token',
                clientId: 'TU_FACEBOOK_APP_ID',
                scope: 'email public_profile',
                responseType: 'code',
                getCodeChallengeMethod: 'plain',
                userinfoUrl: 'https://graph.facebook.com/v18.0/me?fields=id,name,email'
            }
        };
    }
    generateRandomString(length = 43) {
        return crypto.randomBytes(32).toString('hex');
    }
    async generateCodeVerifier() {
        return this.generateRandomString(64);
    }
    async generateCodeChallenge(codeVerifier, method = 'S256') {
        if (method === 'plain') {
            return codeVerifier;
        }
        const hash = crypto.createHash('sha256').update(codeVerifier).digest();
        return hash.toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
    }
    generateState() {
        return this.generateRandomString(32);
    }
    async startAuth(providerName, urlLogin, appSettings) {
        let provider = this.PROVIDERS[providerName];
        if (!provider && !appSettings['login.custom.' + providerName + '.provider']) {
            throw new common_1.BadRequestException("Provider not supported: " + providerName);
        }
        if (appSettings['login.custom.' + providerName + '.provider']) {
            provider = {
                getCodeChallengeMethod: appSettings['login.custom.' + providerName + '.challenge'],
                authUrl: appSettings['login.custom.' + providerName + '.authurl'],
                tokenUrl: appSettings['login.custom.' + providerName + '.tokenurl'],
                clientId: appSettings['login.custom.' + providerName + '.client_id'],
                scope: appSettings['login.custom.' + providerName + '.scope'] || 'email profile openid',
                responseType: appSettings['login.custom.' + providerName + '.response'],
                name: providerName
            };
        }
        else {
            if (!appSettings['login_' + providerName + '_provider']) {
                throw new common_1.BadRequestException("Provider not active");
            }
            provider.clientId = appSettings['login_' + providerName + '_client_id'];
        }
        const codeVerifier = await this.generateCodeVerifier();
        const codeChallenge = await this.generateCodeChallenge(codeVerifier, provider.getCodeChallengeMethod);
        const state = this.generateState();
        const stateLogin = {
            state: state,
            url: urlLogin
        };
        const params = new url_1.URLSearchParams({
            client_id: provider.clientId,
            redirect_uri: `${process.env.PLS_PUBLIC_URL}${process.env.APP_PREFIX}/polisafe/oauth/callback`,
            response_type: provider.responseType,
            scope: provider.scope,
            state: this.encode(stateLogin),
            code_challenge: codeChallenge,
            code_challenge_method: provider.getCodeChallengeMethod === 'S256' ? 'S256' : 'plain'
        });
        if (providerName === 'linkedin') {
            params.append('response_type', 'code');
        }
        const authUrl = `${provider.authUrl}?${params.toString()}`;
        return {
            url: authUrl,
            state: this.encode(stateLogin),
            codeVerifier: codeVerifier
        };
    }
    async handleCallback(query, providerName, savedState, codeVerifier, appSettings) {
        const stateLogin = this.decode(query.state);
        const code = query.code;
        const state = query.state;
        const error = query.error;
        const errorDescription = query.error_description;
        let provider = this.PROVIDERS[providerName];
        if (!provider && !appSettings['login.custom.' + providerName + '.provider']) {
            throw new common_1.BadRequestException("Provider not supported: " + providerName);
        }
        if (appSettings['login.custom.' + providerName + '.provider']) {
            provider = {
                getCodeChallengeMethod: appSettings['login.custom.' + providerName + '.challenge'],
                authUrl: appSettings['login.custom.' + providerName + '.authurl'],
                tokenUrl: appSettings['login.custom.' + providerName + '.tokenurl'],
                clientId: appSettings['login.custom.' + providerName + '.client_id'],
                scope: appSettings['login.custom.' + providerName + '.scope'] || 'email profile openid',
                responseType: appSettings['login.custom.' + providerName + '.response'],
                userinfoUrl: appSettings['login.custom.' + providerName + '.userinfo'],
                name: providerName
            };
        }
        else {
            if (!appSettings['login_' + providerName + '_provider']) {
                throw new common_1.BadRequestException("Provider not active");
            }
            provider.clientId = appSettings['login_' + providerName + '_client_id'];
        }
        if (!state || state !== savedState) {
            throw new Error('Estado inválido - posible ataque CSRF');
        }
        if (error) {
            throw new Error(errorDescription);
        }
        if (!code) {
            throw new Error('No se recibió código de autorización');
        }
        try {
            const tokens = await this.exchangeCodeForTokens(providerName, code, codeVerifier, appSettings);
            const userProfile = await this.getUserProfile(providerName, tokens.access_token, provider.userinfoUrl);
            return {
                userProfile: userProfile,
                url: stateLogin.url
            };
        }
        catch (error) {
            throw error;
        }
    }
    async exchangeCodeForTokens(providerName, code, codeVerifier, appSettings) {
        let provider = this.PROVIDERS[providerName];
        if (appSettings['login.custom.' + providerName + '.provider']) {
            provider = {
                getCodeChallengeMethod: appSettings['login.custom.' + providerName + '.challenge'],
                authUrl: appSettings['login.custom.' + providerName + '.authurl'],
                tokenUrl: appSettings['login.custom.' + providerName + '.tokenurl'],
                clientId: appSettings['login.custom.' + providerName + '.client_id'],
                clientSecret: appSettings['login.custom.' + providerName + '.client_secret'],
                scope: appSettings['login.custom.' + providerName + '.scope'] || 'email profile openid',
                responseType: appSettings['login.custom.' + providerName + '.response'],
                name: providerName
            };
        }
        else {
            if (!appSettings['login_' + providerName + '_provider']) {
                throw new common_1.BadRequestException("Provider not active");
            }
            provider.clientId = appSettings['login_' + providerName + '_client_id'];
            provider.clientSecret = appSettings['login_' + providerName + '_client_secret'];
        }
        const params = new url_1.URLSearchParams({
            client_id: provider.clientId,
            code: code,
            redirect_uri: `${process.env.PLS_PUBLIC_URL}${process.env.APP_PREFIX}/polisafe/oauth/callback`,
            grant_type: 'authorization_code',
            ...provider.clientSecret ? {
                client_secret: provider.clientSecret
            } : {}
        });
        if (provider.getCodeChallengeMethod === 'S256' || provider.getCodeChallengeMethod === 'plain') {
            params.append('code_verifier', codeVerifier);
        }
        if (providerName === 'github') {
            params.append('client_secret', provider.clientSecret);
        }
        try {
            let response = await (0, rxjs_1.firstValueFrom)(this.httpService.post(provider.tokenUrl, params, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Accept': 'application/json'
                }
            }));
            const tokens = response.data;
            if (tokens.error) {
                throw new Error(tokens.error_description || tokens.error);
            }
            return tokens;
        }
        catch (error) {
            throw new Error(`Token exchange failed: ${error.status} - ${error.message} `);
        }
    }
    async getUserProfile(providerName, accessToken, url) {
        try {
            let response = await (0, rxjs_1.firstValueFrom)(this.httpService.get(url, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            }));
            const profile = response.data;
            return this.normalizeUserProfile(providerName, profile);
        }
        catch (error) {
            throw new Error(`User get failed: ${error.status} - ${error.message}`);
        }
    }
    normalizeUserProfile(provider, rawProfile) {
        const normalized = {
            provider: provider,
            id: rawProfile.sub || rawProfile.id,
            email: rawProfile.email,
            name: rawProfile.name,
            firstName: rawProfile.given_name,
            lastName: rawProfile.family_name,
            picture: rawProfile.picture || rawProfile.avatar_url,
            raw: rawProfile,
            emailVerified: true
        };
        switch (provider) {
            case 'google':
                normalized.emailVerified = rawProfile.email_verified;
                break;
            case 'github':
                normalized.name = rawProfile.name || rawProfile.login;
                normalized.picture = rawProfile.avatar_url;
                break;
            case 'facebook':
                normalized.name = rawProfile.name;
                break;
            case 'linkedin':
                normalized.name = rawProfile.name;
                break;
        }
        return normalized;
    }
    showError(message) {
        console.error(message);
        const errorDiv = document.getElementById('oauth-error');
        if (errorDiv) {
            errorDiv.textContent = message;
            errorDiv.style.display = 'block';
        }
    }
    encode(data) {
        return buffer_1.Buffer.from(JSON.stringify(data)).toString('hex');
    }
    decode(text) {
        try {
            return JSON.parse(buffer_1.Buffer.from(text, 'hex').toString());
        }
        catch (error) {
            return null;
        }
    }
};
exports.ProvidersService = ProvidersService;
__decorate([
    (0, common_1.Inject)(),
    __metadata("design:type", axios_1.HttpService)
], ProvidersService.prototype, "httpService", void 0);
exports.ProvidersService = ProvidersService = __decorate([
    (0, common_1.Injectable)()
], ProvidersService);
//# sourceMappingURL=providers.service.js.map