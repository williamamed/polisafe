import { OnModuleInit } from "@nestjs/common";
export declare class PolizeiSdkService implements OnModuleInit {
    private options;
    private httpService;
    private jwtService;
    onModuleInit(): Promise<void>;
    validateClient(): Promise<{
        valid: boolean;
        reason: string;
    }>;
    authenticate(): Promise<void>;
}
