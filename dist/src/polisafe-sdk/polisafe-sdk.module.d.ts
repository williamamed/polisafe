import { DynamicModule } from '@nestjs/common';
import { ConfigPolizei } from './config.polizei';
export declare class PolisafeSdkModule {
    static register(options: ConfigPolizei): DynamicModule;
}
