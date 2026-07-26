import { Model } from 'sequelize-typescript';
import { AuthorizationCodeModel } from './auth-code.model';
import { ScopesModel } from './scopes.model';
export declare class ClientModel extends Model<ClientModel> {
    id: string;
    clientId: string;
    clientSecretHash: string;
    redirectUris: string[];
    postLogoutRedirectUris: string[];
    grants: string[];
    meta: any;
    codes: AuthorizationCodeModel[];
    roles: string[];
    tenant: string;
    name: string;
    type: string;
    scopes: ScopesModel[];
    static hashPassword(client: ClientModel): void;
}
