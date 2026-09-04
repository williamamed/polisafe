import { TokenPayload } from '../../polisafe-sdk/decorators/permission.decorator';
export declare class DashboardController {
    private dashboardService;
    getDashboard(user: TokenPayload, query: any): Promise<any>;
}
