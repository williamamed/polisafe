import { AccessTokenModel } from '../models/access-token.model';
import { AccessToken } from '../interfaces/access-token.interface';
export declare class AccessTokenService {
    accessTokenModel: typeof AccessTokenModel;
    getRefresh(token: string): Promise<AccessTokenModel>;
    geAccessTokenByClient(token: string, clientId: string): Promise<AccessTokenModel>;
    geAccessTokenByUserAndClient(sub: string, clientId: string): Promise<AccessTokenModel>;
    revokeAllUser(userId: number, clientId: string): Promise<[affectedCount: number]>;
    revoke(token: string, clientId: string): Promise<[affectedCount: number]>;
    revokeById(id: string): Promise<[affectedCount: number]>;
    create(refreshToken: AccessToken): Promise<AccessTokenModel>;
}
