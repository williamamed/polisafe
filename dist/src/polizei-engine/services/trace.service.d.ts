import { SecurityTrace } from '../models/security.trace';
export declare class TraceService {
    private traceModel;
    create(data: any): Promise<SecurityTrace>;
    register(username: string, idScope: number, description: string, state?: number): Promise<SecurityTrace>;
    reviewHit(id: number[], rango: any[]): Promise<any[]>;
    reviewHitState(id: number[], rango: any[]): Promise<any[]>;
    reviewHitLineTime(id: number[], rango: any[]): Promise<any[]>;
}
