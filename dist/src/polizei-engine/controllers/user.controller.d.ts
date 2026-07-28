import { SecurityUser } from '../models/security.user';
import { TokenPayload } from '../../polisafe-sdk/decorators/permission.decorator';
export declare class UserController {
    private userService;
    private scopeService;
    list(id: number, user: TokenPayload, offset: number, search: string, limit: number): Promise<SecurityUser[]>;
    create(userDto: Record<string, any>, user: TokenPayload): Promise<SecurityUser>;
    update(userDto: Record<string, any>, user: TokenPayload): Promise<[affectedCount: number]>;
    destroy(userDto: Record<string, any>, user: TokenPayload): Promise<number>;
    addRoles(id: number, roles: Array<number>, context: boolean, user: TokenPayload): Promise<unknown>;
    addUser(data: Record<string, any>, user: TokenPayload): Promise<any>;
}
