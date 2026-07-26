import { TokenPayload } from '../../../polisafe-sdk/decorators/permission.decorator';
export declare class ClientsController {
    private clientsService;
    private scopesService;
    getList(user: TokenPayload, tenant: string): Promise<import("../../../polisafe-iam/models/client.model").ClientModel[]>;
    create(clientDto: Record<string, any>, user: TokenPayload, tenant: string): Promise<import("../../../polisafe-iam/models/client.model").ClientModel>;
    update(clientDto: Record<string, any>, tenant: string): Promise<import("../../../polisafe-iam/models/client.model").ClientModel>;
    destroy(clientDto: Record<string, any>, tenant: string): Promise<number>;
    getListScopes(user: TokenPayload, scope: any): Promise<import("../../../polisafe-iam/models/scopes.model").ScopesModel[]>;
}
