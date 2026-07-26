import { Model } from 'sequelize-typescript';
export declare class KeyModel extends Model<KeyModel> {
    id: string;
    kid: string;
    tenant: string;
    privateKeyPem: string;
    publicKeyPem: string;
    active: boolean;
    createdAt: Date;
}
