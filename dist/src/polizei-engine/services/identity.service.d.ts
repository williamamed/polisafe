import { UserPayload } from '../dto/user.payload';
import { SecurityUser } from '../models/security.user';
export declare class IdentityService {
    private jwtService;
    private userService;
    private configService;
    getToken(payload: any): Promise<{
        token: string;
        refreshToken: string;
    }>;
    getPayloadByUser(user: SecurityUser, workspaceScope?: string): Promise<UserPayload>;
    getPayloadByUserName(username: any, workspaceScope?: string): Promise<UserPayload>;
    createAsyncKey(): void;
}
