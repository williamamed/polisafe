import { AuthorizationCodeModel } from '../models/auth-code.model';
import { AuthCodeDto } from '../dto/auth-code.dto';
import { AuthRequestDto } from '../dto/auth-request.dto';
export declare class AuthCodeService {
    authCodeModel: typeof AuthorizationCodeModel;
    findByCode(code: string): Promise<AuthorizationCodeModel>;
    findByValidCode(code: string): Promise<AuthorizationCodeModel>;
    getActiveCodeByCodeClient(code: string, clientId: string, redirectUri: string): Promise<AuthorizationCodeModel>;
    invalidateCode(code: string): Promise<[affectedCount: number]>;
    getLastCodeByUserClient(clientId: string, userId: string, redirectUri: string): Promise<AuthorizationCodeModel>;
    getActiveCodeByUserClient(clientId: string, userId: string, redirectUri: string): Promise<AuthorizationCodeModel>;
    create(data: AuthCodeDto): Promise<AuthorizationCodeModel>;
    getConsentAuthCode(authRequest: AuthRequestDto, userId: string, clientId: string): Promise<AuthorizationCodeModel>;
}
