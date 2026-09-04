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
exports.RedisConnectivityService = void 0;
const common_1 = require("@nestjs/common");
const redis_1 = __importDefault(require("@keyv/redis"));
let RedisConnectivityService = class RedisConnectivityService {
    constructor() {
        this.logger = new common_1.Logger('Redis');
    }
    async onModuleInit() {
        const url = process.env.REDIS_URL ?? 'redis://localhost:6379';
        const connectionTimeout = parseInt(process.env.REDIS_CONNECT_TIMEOUT, 10) || 1000;
        const store = new redis_1.default(url, { connectionTimeout });
        const start = Date.now();
        try {
            const client = await store.getClient();
            await client.ping();
            this.logger.log(`Conectado a Redis: ${url} (ping ${Date.now() - start} ms)`);
        }
        catch (error) {
            this.logger.warn(`Redis NO disponible en ${url}: ${error.message}`);
        }
        finally {
            await store.disconnect(true).catch(() => undefined);
        }
    }
};
exports.RedisConnectivityService = RedisConnectivityService;
exports.RedisConnectivityService = RedisConnectivityService = __decorate([
    (0, common_1.Injectable)()
], RedisConnectivityService);
//# sourceMappingURL=redis-connectivity.service.js.map