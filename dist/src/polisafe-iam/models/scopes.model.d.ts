import { Model } from 'sequelize-typescript';
import { ClientModel } from './client.model';
export declare class ScopesModel extends Model<ScopesModel> {
    id: string;
    name: string;
    displayName: string;
    description: string;
    tenant: string;
    clients: ClientModel[];
}
