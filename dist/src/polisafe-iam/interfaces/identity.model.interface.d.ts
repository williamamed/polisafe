import { Permission } from "./permission.interface";
import { ISettings } from "./settings.interface";
import { Tenant } from "./tenant.interface";
import { User } from "./user.interface";
export interface IdentityModel {
    validateUser(email: string, password: string, tid: string): Promise<any>;
    findByEmail(email: string, tid: string): Promise<User>;
    findById(id: string): Promise<User>;
    getUser(sub: string, tid: string): Promise<User>;
    getUserOrRegister(user: User, tid: string): Promise<User>;
    getTenantsByUserId(userId: string): Promise<Tenant[]>;
    getPermissionsByRoles(roles: string[]): Promise<Permission[]>;
    getTenantSettings(tenantId: string, app: string, visibility: 'private' | 'public' | 'any'): Promise<ISettings>;
    log(tid: string, logging: string, state: number, username?: string, metadata?: any): Promise<void>;
}
