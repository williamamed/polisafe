export declare class SessionDto {
    id?: number;
    username: string;
    agent: string;
    active: boolean;
    meta: MetaSession;
    key: string;
    token: string;
}
declare class MetaSession {
    ip: string;
}
export {};
