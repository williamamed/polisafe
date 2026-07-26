import { User } from '../interfaces/user.interface';
import { Client } from '../interfaces/client.interface';
export declare class OpenidService {
    private readonly jwtService;
    private configService;
    private readonly keyService;
    private identityService;
    getOpenIdClaims(data: {
        user: User;
        scope: string;
        format: 'JSON' | 'JWT';
        tenant?: string;
        privateKey?: {
            id: string;
            pem: string;
        };
        expireIn?: string;
        client: Client;
    }): Promise<any>;
    validateIdToken(idToken: string): Promise<any>;
}
