import { TokenPayload } from '../../polisafe-sdk/decorators/permission.decorator';
import { UserUpdateDto } from '../dto/user-update.dto';
import { ChangePasswordDto } from '../dto/change-password.dto';
export declare class ProfileController {
    private userService;
    private authService;
    private permissionService;
    private scopeService;
    user(user: TokenPayload, include: boolean, defaultScope: boolean): Promise<any>;
    update(userDto: UserUpdateDto, user: TokenPayload): Promise<{
        ok: boolean;
    }>;
    password(userDto: ChangePasswordDto, user: TokenPayload): Promise<{
        ok: boolean;
    }>;
    permissions(user: TokenPayload): Promise<any>;
    scopes(user: TokenPayload): Promise<any>;
    searchUser(data: any): Promise<any>;
    saveScope(scopeDto: Record<string, any>, user: TokenPayload): Promise<any>;
    deleteScope(scopeDto: Record<string, any>, user: TokenPayload): Promise<any>;
    scopeSettings(data: any, user: TokenPayload): Promise<any>;
    setScopeSettings(data: any, user: TokenPayload): Promise<any>;
}
