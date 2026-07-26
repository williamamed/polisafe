import { SecurityUserScope } from '../models/security.user.scope';
export declare class ReviewService {
    private userModel;
    private scopeModel;
    private scopeService;
    private traceService;
    userScopeModel: typeof SecurityUserScope;
    getReview(id: any): Promise<{
        pie: any[];
        days: any[];
        totalSemana: number;
        totalMes: number;
        usuarios: number;
        hitTotal: any[];
        hitStates: any[];
        hitLine: any[];
    }>;
    reviewUsuariosTotal(id: number[]): Promise<number>;
    reviewUsuarios(id: number[], rango: any[]): Promise<number>;
    reviewPie(id: number[], rango: any[]): Promise<any[]>;
    reviewDays(id: number[], rango: any[]): Promise<any[]>;
}
