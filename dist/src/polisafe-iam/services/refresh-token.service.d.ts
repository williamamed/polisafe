import { RefreshTokenModel } from '../models/refresh-token.model';
import { RefreshToken } from '../interfaces/refresh-token.interface';
export declare class RefreshTokenService {
    refreshTokenModel: typeof RefreshTokenModel;
    getRefresh(token: string): Promise<RefreshTokenModel>;
    getRefreshByClient(token: string, clientId: string): Promise<RefreshTokenModel>;
    revokeAllUser(userId: string): Promise<[affectedCount: number]>;
    revoke(token: string, clientId: string): Promise<[affectedCount: number]>;
    create(refreshToken: RefreshToken): Promise<RefreshTokenModel>;
}
