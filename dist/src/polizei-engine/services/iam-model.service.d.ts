import { IdentityModel } from '../../polisafe-iam/interfaces/identity.model.interface';
import { User } from '../../polisafe-iam/interfaces/user.interface';
import { Tenant } from '../../polisafe-iam/interfaces/tenant.interface';
import { Permission } from '../../polisafe-iam/interfaces/permission.interface';
import { ISettings } from '../../polisafe-iam/interfaces/settings.interface';
export declare class IamModelService implements IdentityModel {
    private userService;
    private authService;
    private scopeService;
    private roleService;
    private traceService;
    private permissionService;
    private cache;
    private get userCacheTtl();
    private get settingsCacheTtl();
    findByEmail(email: string, tid: string): Promise<User>;
    findById(id: string): Promise<User>;
    validateUser(email: string, password: string, tid: string): Promise<User>;
    getTenantsByUserId(userId: string): Promise<Tenant[]>;
    getUserOrRegister(user: User, tid: string): Promise<User>;
    getUser(sub: string, tid: string): Promise<User>;
    getTenantSettings(tenantId: string, app: string, visibility: 'private' | 'public' | 'any'): Promise<ISettings>;
    getPermissionsByTenant(tenant: string): Promise<any[]>;
    getPermissionsByRoles(roles: string[]): Promise<Permission[]>;
    parseFullNameAdvanced(fullname: any): {
        given_name: string;
        family_name: string;
    };
    log(tid: string, logging: string, state: number, username?: string, metadata?: any): Promise<void>;
    private cacheGet;
    private cacheSet;
}
