export interface RequestContextData {
    ip: string;
    userId?: string;
    correlationId?: string;
}
export declare class RequestContext {
    private static asyncLocalStorage;
    static run(data: RequestContextData, callback: () => void): void;
    static get(): RequestContextData | undefined;
    static getIp(): string | undefined;
}
