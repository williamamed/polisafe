import { HttpService } from '@nestjs/axios';
import { IUser } from '../interfaces/user.interface';
export declare class AuthService {
    private userService;
    private rolService;
    private scopeService;
    private notificationService;
    private jwtService;
    private sessionModel;
    httpService: HttpService;
    private urlService;
    private configService;
    saltOrRounds: number;
    signIn(username: any, pass: any, workspaceScope?: string, meta?: any): Promise<any>;
    getSecretByWorkSpace(workspaceScope?: string): Promise<string>;
    revalidate(user: any, userToken?: any, workspaceScope?: string): Promise<any>;
    getUserPayload(username: any, workspaceScope?: string): Promise<any>;
    getUserToken(username: any, workspaceScope?: string): Promise<any>;
    getUserTokenByChannel(channel: any, workspaceScope?: string): Promise<any>;
    setUserChannel(username: any, channel: any): Promise<void>;
    signExternal(token: string, type: string, workspaceScope?: string, channel?: string): Promise<any>;
    signProvider(token: string, iss: string): Promise<any>;
    signUpLegacy(payload: Record<string, any>, notCheck?: boolean): Promise<void>;
    verifyCode(payload: Record<string, any>): Promise<{
        message: string;
    }>;
    recover(payload: Record<string, any>): Promise<void>;
    signUp(payload: IUser, tid: number, notCheck?: boolean): Promise<import("../models/security.user").SecurityUser>;
    authenticate(username: string, password: string, tid: number): Promise<any>;
    authenticateBySub(subject: number, password: string): Promise<any>;
}
