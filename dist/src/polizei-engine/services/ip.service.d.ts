export interface IpLocationResponse {
    status: 'success' | 'fail';
    message?: string;
    query: string;
    country: string;
    countryCode: string;
    region: string;
    regionName: string;
    city: string;
    zip: string;
    lat: number;
    lon: number;
    timezone: string;
    isp: string;
    org: string;
    as: string;
}
export interface IpInfo {
    ip: string;
    isLocal: boolean;
    location?: IpLocationResponse;
    error?: string;
}
export declare class IpService {
    private httpService;
    private isLocalIp;
    private normalizeIp;
    private getPublicTestIp;
    extractIp(): string;
    getLocation(ip?: string): Promise<IpLocationResponse | null>;
    private fetchLocation;
    getIpInfo(): Promise<IpInfo>;
    getIp(): string;
    isCurrentIpLocal(): boolean;
    getLocationSimplified(): Promise<{
        lat: number;
        lon: number;
        city: string;
        country: string;
    } | null>;
}
