export declare class NotificationOauthService {
    private httpService;
    webhook(url: string, data: {
        type: string;
        payload: any;
    }, headers: any): Promise<void>;
}
