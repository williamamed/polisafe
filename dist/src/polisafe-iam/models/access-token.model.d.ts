import { Model } from 'sequelize-typescript';
import { ClientModel } from './client.model';
import { RefreshTokenModel } from './refresh-token.model';
export declare class AccessTokenModel extends Model<AccessTokenModel> {
    id: string;
    token: string;
    scope: string;
    username: string;
    clientId: string;
    client: ClientModel;
    expiresAt: Date;
    isRevoked: boolean;
    userId: number;
    refreshToken: RefreshTokenModel;
}
