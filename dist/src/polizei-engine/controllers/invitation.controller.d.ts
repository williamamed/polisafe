import { InvitationService } from '../services/invitation.service';
import { ScopeService } from '../services/scope.service';
import { TokenPayload } from '../../polisafe-sdk/decorators/permission.decorator';
export declare class InvitationController {
    invitationService: InvitationService;
    private userService;
    scopeService: ScopeService;
    getList(user: TokenPayload): Promise<import("../models/security.invitation").SecurityInvitation[]>;
    create(invitationDto: Record<string, any>, user: TokenPayload): Promise<import("../models/security.invitation").SecurityInvitation>;
    destroy(invitationDto: Record<string, any>, tenant: string): Promise<number>;
    getListRoles(user: TokenPayload): Promise<import("../models/security.role").SecurityRole[]>;
    getListUsers(user: TokenPayload, offset: number, limit: number): Promise<any>;
    rejectUser(invitationDto: Record<string, any>, tenantRoot: string, user: TokenPayload): Promise<any>;
    addRoles(id: number, roles: Array<number>, user: TokenPayload): Promise<unknown>;
}
