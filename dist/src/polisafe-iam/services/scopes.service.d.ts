import { ScopesModel } from '../models/scopes.model';
export declare class ScopesService {
    scopesModel: typeof ScopesModel;
    onMod(): Promise<void>;
    getById(id: string): Promise<ScopesModel>;
    create(scope: any): Promise<ScopesModel>;
    getByTenant(tenant: string): Promise<ScopesModel[]>;
    getByTenantAssigment(tenant: string): Promise<ScopesModel[]>;
    update(scope: any): Promise<[affectedCount: number]>;
    destroy(scope: any): Promise<number>;
    bulkCreate(scopes: any[]): Promise<ScopesModel[]>;
}
