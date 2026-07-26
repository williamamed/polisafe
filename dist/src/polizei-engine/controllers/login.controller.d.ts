import { RegisterDto } from '../dto/register.dto';
export declare class LoginController {
    private authService;
    private userService;
    private scopeService;
    private creatorService;
    private jwtService;
    private invitationService;
    signUp(registerDto: RegisterDto): Promise<{
        message: string;
    }>;
    invitation(invitationDto: Record<string, any>): Promise<void>;
    invitationState(query: Record<string, any>): Promise<{
        action: string;
        invitation: import("../models/security.invitation").SecurityInvitation;
        scope: {
            name: string;
            description: string;
            picture: any;
        };
    }>;
    verify(verifyDto: Record<string, any>): Promise<{
        message: string;
    }>;
    recover(verifyDto: Record<string, any>): Promise<{
        message: string;
    }>;
    picture(config: Record<string, any>): Promise<{
        image: any;
    }>;
}
