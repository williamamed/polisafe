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
}
