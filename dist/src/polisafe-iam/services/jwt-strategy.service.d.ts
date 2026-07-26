import { Strategy, VerifiedCallback } from 'passport-jwt';
declare const JwtStrategyService_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithRequest] | [opt: import("passport-jwt").StrategyOptionsWithoutRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class JwtStrategyService extends JwtStrategyService_base {
    private jwtService;
    private keyService;
    private configService;
    constructor();
    validate(payload: any, done: VerifiedCallback): void;
}
export {};
