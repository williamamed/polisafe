import { Model } from 'sequelize-typescript';
import { ClientModel } from './client.model';
import { AccessTokenModel } from './access-token.model';
export declare class RefreshTokenModel extends Model<RefreshTokenModel> {
    id: string;
    token: string;
    scope: string;
    username: string;
    clientId: string;
    client: ClientModel;
    accessTokenId: string;
    accessToken: AccessTokenModel;
    expiresAt: Date;
    isRevoked: boolean;
    userId: number;
}
