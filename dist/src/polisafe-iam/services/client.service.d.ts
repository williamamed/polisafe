import { ClientModel } from '../models/client.model';
export declare class ClientService {
    clientModel: typeof ClientModel;
    verifyClient(client_id: string, secret: string): Promise<ClientModel>;
    getClientByIdAndUri(idClient: string, uri: string): Promise<ClientModel>;
    getClientById(idClient: string): Promise<ClientModel>;
    getClientByInternalId(id: string): Promise<ClientModel>;
    getClientByTenant(tenant: string): Promise<ClientModel[]>;
    getDeniedScopes(idClient: string, scopes: string): Promise<any[]>;
    create(client: any): Promise<ClientModel>;
    update(client: any): Promise<ClientModel>;
    destroy(client: any): Promise<number>;
}
