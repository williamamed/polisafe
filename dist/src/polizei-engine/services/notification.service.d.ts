export declare class NotificationService {
    private httpService;
    email(data: {
        address: string;
        subject: string;
        message: string;
    }): Promise<void>;
    webhook(url: string, data: {
        type: string;
        payload: any;
    }, headers: any): Promise<void>;
}
