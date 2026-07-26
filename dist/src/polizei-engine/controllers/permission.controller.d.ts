import { TokenPayload } from '../../polisafe-sdk/decorators/permission.decorator';
export declare class PermissionController {
    private permissionService;
    private scopeService;
    getPermissions(id: number, tenant: string, user: TokenPayload): Promise<import("../models/security.permission").SecurityPermission[]>;
    create(permissionDto: Record<string, any>, user: TokenPayload): Promise<import("../models/security.permission").SecurityPermission>;
    update(permissionDto: Record<string, any>, tenant: any): Promise<[affectedCount: number]>;
    destroy(permissionDto: Record<string, any>, tenant: any): Promise<number>;
    importData(permissionDto: Record<string, any>, user: TokenPayload): Promise<import("../models/security.permission").SecurityPermission[]>;
}
