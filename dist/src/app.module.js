"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const config_1 = require("@nestjs/config");
const cache_manager_1 = require("@nestjs/cache-manager");
const keyv_1 = require("keyv");
const cacheable_1 = require("cacheable");
const redis_1 = __importDefault(require("@keyv/redis"));
const polizei_1 = require("@raptorjs/polizei");
const polizei_engine_module_1 = require("./polizei-engine/polizei-engine.module");
const axios_1 = require("@nestjs/axios");
const event_emitter_1 = require("@nestjs/event-emitter");
const polisafe_sdk_module_1 = require("./polisafe-sdk/polisafe-sdk.module");
const redis_connectivity_service_1 = require("./redis-connectivity.service");
const core_1 = require("@nestjs/core");
const request_interceptor_1 = require("./request-interceptor");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: '.env'
            }),
            sequelize_1.SequelizeModule.forRoot({
                dialect: 'postgres',
                host: process.env.DB_HOST || 'localhost',
                port: parseInt(process.env.DB_PORT) || 5432,
                username: process.env.DB_USER,
                password: process.env.DB_PASS,
                database: process.env.DB_NAME,
                autoLoadModels: true,
                synchronize: true,
                logging: false
            }),
            polizei_1.PolizeiModule,
            polizei_engine_module_1.PolizeiEngineModule,
            cache_manager_1.CacheModule.registerAsync({
                isGlobal: true,
                inject: [config_1.ConfigService],
                useFactory: (config) => ({
                    stores: [
                        new keyv_1.Keyv({
                            store: new cacheable_1.CacheableMemory({ ttl: 60000 }),
                        }),
                        new redis_1.default(config.get('REDIS_URL', 'redis://localhost:6379'), {
                            connectionTimeout: parseInt(config.get('REDIS_CONNECT_TIMEOUT', '1000'), 10),
                        }),
                    ],
                }),
            }),
            axios_1.HttpModule,
            event_emitter_1.EventEmitterModule.forRoot(),
            polisafe_sdk_module_1.PolisafeSdkModule.register({
                permissionCheck: process.env.PLS_PERMISSION_CHECK == 'token' || false,
                checkProviderPermissions: process.env.PLS_PERMISSION_CHECK == 'remote' || false,
                serviceUrl: `${process.env.PLS_PUBLIC_URL}${process.env.APP_PREFIX}`,
                mode: process.env.NODE_ENV || 'development',
                issuer: process.env.PLS_PUBLIC_URL,
                audience: '*',
                scope: 'security:io:tenants security:io:authorization'
            })
        ],
        providers: [
            redis_connectivity_service_1.RedisConnectivityService,
            {
                provide: core_1.APP_INTERCEPTOR,
                useClass: request_interceptor_1.RequestContextInterceptor,
            }
        ],
        controllers: [],
        exports: []
    })
], AppModule);
//# sourceMappingURL=app.module.js.map