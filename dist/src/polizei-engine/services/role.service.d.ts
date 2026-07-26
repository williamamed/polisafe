import { OnModuleInit } from '@nestjs/common';
import { SecurityRole } from '../models/security.role';
import { SecurityPermission } from '../models/security.permission';
import { SecurityUser } from '../models/security.user';
export declare class RoleService implements OnModuleInit {
    onModuleInit(): Promise<void>;
    static USER: string;
    static ROLE: string;
    static ALL: string;
    roleModel: typeof SecurityRole;
    userModel: typeof SecurityUser;
    private permissionModel;
    getRole(name: string): Promise<SecurityRole>;
    getBaseRegisterRole(code: string): Promise<SecurityRole>;
    getRolePermissions(id: number): Promise<SecurityPermission[]>;
    getRoles(): Promise<SecurityRole[]>;
    getRolesByScope(id: number): Promise<SecurityRole[]>;
    getRolesByScopeArray(id: number[]): Promise<SecurityRole[]>;
    getRolesByArray(id: number[]): Promise<SecurityRole[]>;
    create(data: any): Promise<SecurityRole>;
    update(data: any): Promise<[affectedCount: number]>;
    destroy(data: any): Promise<number>;
    addPermissions(idRole: number, permissions: Array<number>): Promise<unknown>;
    addUser(data: any): Promise<unknown>;
}
