"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var PolisafeSdkModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PolisafeSdkModule = void 0;
const common_1 = require("@nestjs/common");
const jwt_strategy_service_1 = require("./services/jwt-strategy.service");
const jwt_cookie_strategy_service_1 = require("./services/jwt-cookie-strategy.service");
const config_polizei_1 = require("./config.polizei");
const jwt_1 = require("@nestjs/jwt");
const axios_1 = require("@nestjs/axios");
const polizei_sdk_service_1 = require("./services/polizei-sdk.service");
const schedule_1 = require("@nestjs/schedule");
let PolisafeSdkModule = PolisafeSdkModule_1 = class PolisafeSdkModule {
    static register(options) {
        options = {
            ...new config_polizei_1.ConfigPolizei(),
            ...options
        };
        if (options.mode == 'development') {
            common_1.Logger.warn(`Polizei SDK mode: ${options.mode}, not checking permission against provider ${options.serviceUrl}`);
        }
        if (!options.permissionCheck) {
            common_1.Logger.warn(`Permission check development disabled`);
        }
        return {
            imports: [
                axios_1.HttpModule,
                jwt_1.JwtModule.register({
                    global: true,
                    signOptions: { algorithm: 'RS256' }
                }),
                schedule_1.ScheduleModule
            ],
            module: PolisafeSdkModule_1,
            providers: [
                {
                    provide: 'POLIZEI_CONFIG_OPTIONS',
                    useValue: options,
                },
                jwt_strategy_service_1.JwtStrategyService,
                jwt_cookie_strategy_service_1.JwtCookieStrategyService,
                polizei_sdk_service_1.PolizeiSdkService
            ],
            exports: [
                jwt_strategy_service_1.JwtStrategyService,
                jwt_cookie_strategy_service_1.JwtCookieStrategyService,
                {
                    provide: 'POLIZEI_CONFIG_OPTIONS',
                    useValue: options,
                }
            ],
        };
    }
};
exports.PolisafeSdkModule = PolisafeSdkModule;
exports.PolisafeSdkModule = PolisafeSdkModule = PolisafeSdkModule_1 = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        providers: [
            jwt_strategy_service_1.JwtStrategyService,
            jwt_cookie_strategy_service_1.JwtCookieStrategyService
        ],
        exports: [
            jwt_strategy_service_1.JwtStrategyService
        ]
    })
], PolisafeSdkModule);
//# sourceMappingURL=polisafe-sdk.module.js.map