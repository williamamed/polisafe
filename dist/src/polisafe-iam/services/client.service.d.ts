import { ClientModel } from '../models/client.model';
export declare class ClientService {
    clientModel: typeof ClientModel;
    private readonly cache;
    private readonly CLIENT_CACHE_TTL;
    verifyClient(client_id: string, secret: string): Promise<any>;
    getClientByIdAndUri(idClient: string, uri: string): Promise<any>;
    getClientById(idClient: string): Promise<any>;
    getClientByInternalId(id: string): Promise<any>;
    getClientByTenant(tenant: string): Promise<ClientModel[]>;
    getDeniedScopes(idClient: string, scopes: string): Promise<any[]>;
    create(client: any): Promise<ClientModel>;
    update(client: any): Promise<ClientModel>;
    destroy(client: any): Promise<number>;
    private getCachedClientByClientId;
    private toPlain;
    private getClientCacheKey;
    private getClientPkCacheKey;
    private invalidateClientCache;
    private cacheGet;
    private cacheSet;
    private cacheDel;
}
