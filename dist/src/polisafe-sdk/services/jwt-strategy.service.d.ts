import { Strategy, VerifiedCallback } from 'passport-jwt';
import { ConfigPolizei } from '../config.polizei';
declare const JwtStrategyService_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithRequest] | [opt: import("passport-jwt").StrategyOptionsWithoutRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class JwtStrategyService extends JwtStrategyService_base {
    private options;
    private jwtService;
    private configService;
    constructor(options: ConfigPolizei);
    validate(payload: any, done: VerifiedCallback): void;
}
export {};
