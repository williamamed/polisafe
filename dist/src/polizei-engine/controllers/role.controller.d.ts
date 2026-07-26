import { RoleService } from '../services/role.service';
import { TokenPayload } from '../../polisafe-sdk/decorators/permission.decorator';
export declare class RoleController {
    roleService: RoleService;
    private scopeService;
    getList(id: number, user: TokenPayload): Promise<import("../models/security.role").SecurityRole[]>;
    getListAssign(id: number, user: TokenPayload): Promise<import("../models/security.role").SecurityRole[]>;
    create(roleDto: Record<string, any>, user: TokenPayload): Promise<import("../models/security.role").SecurityRole>;
    update(roleDto: Record<string, any>): Promise<[affectedCount: number]>;
    destroy(roleDto: Record<string, any>): Promise<number>;
    getPermissions(role: number): Promise<import("../models/security.permission").SecurityPermission[]>;
    addPermissions(id: number, permissions: Array<number>): Promise<unknown>;
}
