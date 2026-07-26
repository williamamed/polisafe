import { SecurityPermission } from '../models/security.permission';
export declare class PermissionService {
    private permissionModel;
    private roleModel;
    private userModel;
    getPermissionsTree(): Promise<SecurityPermission[]>;
    getPermissionsFlat(): Promise<SecurityPermission[]>;
    getPermissionsFlatByScope(id: number): Promise<SecurityPermission[]>;
    getPermissionsFlatByScopeArray(id: number[]): Promise<SecurityPermission[]>;
    getPermissionsUserFlat(username: string): Promise<SecurityPermission[]>;
    getPermissionsRolesFlat(roles: number[]): Promise<SecurityPermission[]>;
    isAuthorizedByRoles(rolesId: number[], url: string): Promise<SecurityPermission>;
    isAuthorizedByUser(username: string, url: string, tenant?: number): Promise<SecurityPermission>;
    isAuthorizedBySub(id: number, url: string, method?: string, tenant?: number): Promise<SecurityPermission>;
    create(data: any): Promise<SecurityPermission>;
    createBulk(data: any): Promise<SecurityPermission[]>;
    update(data: any): Promise<[affectedCount: number]>;
    destroy(data: any): Promise<number>;
    destroyGroup(data: any): Promise<number>;
    destroyGroupArray(data: any): Promise<number>;
}
