import { TokenPayload } from '../../polisafe-sdk/decorators/permission.decorator';
export declare class ScopeController {
    private scopeService;
    private reviewService;
    getList(user: TokenPayload, id: number): Promise<import("../models/security.scope").SecurityScope[]>;
    getListAll(user: TokenPayload): Promise<import("../models/security.scope").SecurityScope[]>;
    create(scopeDto: Record<string, any>, user: TokenPayload): Promise<import("../models/security.scope").SecurityScope>;
    update(scopeDto: Record<string, any>): Promise<[affectedCount: number]>;
    destroy(scopeDto: Record<string, any>): Promise<number>;
    getReview(user: TokenPayload): Promise<{
        pie: any[];
        days: any[];
        totalSemana: number;
        totalMes: number;
        usuarios: number;
        hitTotal: any[];
        hitStates: any[];
        hitLine: any[];
    }>;
    addUser(data: Record<string, any>, user: TokenPayload): Promise<any>;
}
