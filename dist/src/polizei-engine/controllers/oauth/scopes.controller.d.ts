import { TokenPayload } from '../../../polisafe-sdk/decorators/permission.decorator';
export declare class ScopesController {
    private scopesService;
    getList(user: TokenPayload, scope: string): Promise<import("../../../polisafe-iam/models/scopes.model").ScopesModel[]>;
    create(scopeDto: Record<string, any>, user: TokenPayload, tenant: string): Promise<import("../../../polisafe-iam/models/scopes.model").ScopesModel>;
    update(scopeDto: Record<string, any>, tenant: string): Promise<[affectedCount: number]>;
    destroy(scopeDto: Record<string, any>, tenant: string): Promise<number>;
}
