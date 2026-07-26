import { SecurityScope } from '../models/security.scope';
import { SecurityUser } from '../models/security.user';
import { SecurityRole } from '../models/security.role';
export declare class UserService {
    private userModel;
    private userScopeModel;
    private scopeModel;
    private roleModel;
    getSecurity(): Promise<SecurityScope[]>;
    getUsers(): Promise<SecurityUser[]>;
    getUsersByScope(id: number): Promise<SecurityUser[]>;
    getUsersByScopePage(id: number, offset: number, search: string, limit?: number): Promise<any>;
    findOne(username: string): Promise<SecurityUser>;
    findById(id: number): Promise<SecurityUser>;
    findByUsernameAndTenant(username: string, tenant: number): Promise<SecurityUser>;
    findByEmailAndTenant(email: string, tenant: number): Promise<SecurityUser>;
    findOneByChannel(channel: string): Promise<SecurityUser>;
    getUserData(username: string): Promise<SecurityUser>;
    create(data: any): Promise<SecurityUser>;
    update(data: any): Promise<[affectedCount: number]>;
    destroy(data: any): Promise<number>;
    addRoles(idUser: number, roles: Array<number>, context?: number): Promise<unknown>;
    addRole(idUser: number, role: number): Promise<unknown>;
    addRoleList(idUser: number, roles: Array<number>): Promise<unknown>;
    removeRoles(idUser: number, roles: Array<number>): Promise<any>;
    listRoles(idUser: number): Promise<SecurityRole[]>;
    findUsers(username: any): Promise<SecurityUser[]>;
}
