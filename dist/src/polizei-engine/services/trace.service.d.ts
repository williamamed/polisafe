import { SecurityTrace } from '../models/security.trace';
import { IpService } from './ip.service';
export declare class TraceService {
    private traceModel;
    ipService: IpService;
    create(data: any): Promise<SecurityTrace>;
    register(username: string, idScope: number, description: string, state?: number, meta?: any): Promise<SecurityTrace>;
    reviewHit(id: number[], rango: any[]): Promise<any[]>;
    reviewHitState(id: number[], rango: any[]): Promise<any[]>;
    reviewHitLineTime(id: number[], rango: any[]): Promise<any[]>;
}
