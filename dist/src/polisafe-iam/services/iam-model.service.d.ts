import { IdentityModel } from '../interfaces/identity.model.interface';
import { Client } from '../interfaces/client.interface';
import { User } from '../interfaces/user.interface';
import { Code } from '../interfaces/code.interface';
import { Tenant } from '../interfaces/tenant.interface';
import { Permission } from '../interfaces/permission.interface';
export declare class IamModelService implements IdentityModel {
    log(tid: string, logging: string, state: number, username?: string): Promise<void>;
    getUserOrRegister(user: User, tid: string): Promise<User>;
    getTenantSettings(tenantId: string): Promise<any>;
    getPermissionsByRoles(roles: string[]): Promise<Permission[]>;
    validateUser(email: string, password: string): Promise<any>;
    findByEmail(email: string): Promise<User>;
    findById(id: string): Promise<User>;
    getUser(sub: string): Promise<User>;
    validateClient(client_id: string, secret: string): Promise<Client>;
    getClientByIdAndUri(idClient: string, uri: string): Promise<Client>;
    getActiveCodeByCodeClient(code: string, clientId: string, redirectUri: string): Promise<any>;
    getLastCodeByUserClient(clientId: string, userId: string, redirectUri: string): Promise<any>;
    createCode(data: Code): Promise<any>;
    getTenantsByUserId(userId: string): Promise<Tenant[]>;
    getPermissionsByTenant(tenant: string): Promise<Permission[]>;
}
