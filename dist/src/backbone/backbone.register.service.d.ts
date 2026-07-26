import { OnModuleInit } from '@nestjs/common';
export declare class BackboneRegisterService implements OnModuleInit {
    private httpService;
    onModuleInit(): Promise<void>;
    publish(record: any): Promise<any>;
}
