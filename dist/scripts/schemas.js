"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const sequelize_typescript_1 = require("sequelize-typescript");
const common_1 = require("@nestjs/common");
const common_2 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const config_1 = require("@nestjs/config");
let SchemaInitializer = class SchemaInitializer {
    constructor(sequelize) {
        this.sequelize = sequelize;
    }
    async initializeSchemas() {
        try {
            await this.sequelize.authenticate();
            console.log('Database connection established');
            const schemas = process.env.SCHEMAS ? process.env.SCHEMAS.split(',') : [];
            for (const schema of schemas) {
                await this.ensureSchema(schema);
            }
            console.log('All schemas verified/created successfully');
            process.exit(0);
        }
        catch (error) {
            console.error('Schema initialization failed:', error);
            process.exit(1);
        }
    }
    async ensureSchema(schemaName) {
        try {
            const [results] = await this.sequelize.query(`SELECT schema_name FROM information_schema.schemata WHERE schema_name = :schema`, {
                replacements: { schema: schemaName },
                type: 'SELECT'
            });
            if (!results || (Array.isArray(results) && results.length === 0)) {
                console.log(`Creating schema: ${schemaName}`);
                await this.sequelize.query(`CREATE SCHEMA IF NOT EXISTS "${schemaName}"`);
            }
            else {
                console.log(`Schema ${schemaName} already exists`);
            }
        }
        catch (error) {
            console.error(`Error ensuring schema ${schemaName}:`, error);
            throw error;
        }
    }
};
SchemaInitializer = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [sequelize_typescript_1.Sequelize])
], SchemaInitializer);
let AppModule = class AppModule {
};
AppModule = __decorate([
    (0, common_2.Global)(),
    (0, common_2.Module)({
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
            })
        ],
        providers: [SchemaInitializer],
        controllers: [],
        exports: [SchemaInitializer]
    })
], AppModule);
async function bootstrap() {
    const app = await core_1.NestFactory.createApplicationContext(AppModule);
    const initializer = app.get(SchemaInitializer);
    await initializer.initializeSchemas();
}
bootstrap();
//# sourceMappingURL=schemas.js.map