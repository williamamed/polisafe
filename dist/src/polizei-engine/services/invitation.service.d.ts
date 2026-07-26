import { SecurityInvitation } from '../models/security.invitation';
import { UserService } from './user.service';
import { AuthService } from './auth.service';
import { ScopeService } from './scope.service';
import { NotificationService } from './notification.service';
import { RoleService } from './role.service';
import { SecurityRole } from '../models/security.role';
export declare class InvitationService {
    invitationModel: typeof SecurityInvitation;
    userService: UserService;
    authService: AuthService;
    scopeService: ScopeService;
    roleService: RoleService;
    notificationService: NotificationService;
    private urlService;
    private configService;
    getByScope(base: number): Promise<SecurityInvitation[]>;
    getById(id: string): Promise<SecurityInvitation>;
    create(data: any): Promise<SecurityInvitation>;
    update(data: Record<string, any>): Promise<[affectedCount: number]>;
    destroy(data: any): Promise<number>;
    getUserCurrentStatus(idInvitation: string): Promise<{
        action: string;
        invitation: SecurityInvitation;
        scope: {
            name: string;
            description: string;
            picture: any;
        };
    }>;
    createUser(invitationDto: Record<string, any>): Promise<void>;
    getRoles(tenant: number): Promise<SecurityRole[]>;
    setRoles(workTenant: number, targetUserId: number, rolesId: number[], tid: number, clientId: string): Promise<unknown>;
}
