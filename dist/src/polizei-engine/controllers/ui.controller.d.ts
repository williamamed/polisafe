import { Response } from 'express';
export declare class UiController {
    private configService;
    provide(res: Response): Promise<void | "Landing not found">;
}
