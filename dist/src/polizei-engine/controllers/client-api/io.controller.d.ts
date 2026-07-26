import { TokenPayload } from '../../../polisafe-sdk/decorators/permission.decorator';
import { AuthorizeIoDto } from '../../dto/authorize-io.dto';
export declare class IoController {
    private permissionService;
    private authService;
    private scopeService;
    private roleService;
    private traceService;
    private userService;
    verifyAuthorization(data: AuthorizeIoDto, root: TokenPayload): Promise<import("../../models/security.permission").SecurityPermission>;
    getTenants(data: Record<string, any>, root: TokenPayload): Promise<import("../../models/security.scope").SecurityScope[]>;
    getUsersScope(data: Record<string, any>, root: TokenPayload): Promise<import("../../models/security.user").SecurityUser[]>;
    getQueryUsers(data: Record<string, any>): Promise<import("../../models/security.user").SecurityUser[]>;
    getScope(data: Record<string, any>): Promise<import("../../models/security.scope").SecurityScope>;
    authorizeScope(data: Record<string, any>): Promise<import("../../models/security.scope").SecurityScope>;
    getUser(data: Record<string, any>): Promise<any>;
    getUserPayload(data: Record<string, any>): Promise<any>;
    addUserUser(data: Record<string, any>): Promise<any>;
    createUser(data: Record<string, any>): Promise<void>;
    addUserRol(data: Record<string, any>): Promise<unknown>;
    addUserRoles(data: Record<string, any>): Promise<unknown>;
    removeUserRoles(data: Record<string, any>): Promise<any>;
    listUserRoles(data: Record<string, any>): Promise<import("../../models/security.role").SecurityRole[]>;
    removeUserUser(data: Record<string, any>): Promise<any>;
    getScopeOwner(data: Record<string, any>): Promise<import("../../models/security.user").SecurityUser>;
    getScopesData(data: Record<string, any>): Promise<import("../../models/security.scope").SecurityScope[]>;
    addScopeData(data: Record<string, any>): Promise<import("../../models/security.scope").SecurityScope | [affectedCount: number]>;
}
