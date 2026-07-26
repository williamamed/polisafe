import { Model } from 'sequelize-typescript';
import { ClientModel } from './client.model';
export declare class AuthorizationCodeModel extends Model<AuthorizationCodeModel> {
    id: string;
    code: string;
    username: string;
    userId: number;
    clientId: string;
    client: ClientModel;
    redirectUri: string;
    scopes: string;
    codeChallenge: string;
    codeChallengeMethod: string;
    expiresAt: Date;
}
