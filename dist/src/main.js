"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const swagger_1 = require("@nestjs/swagger");
const path_1 = require("path");
const cookieParser = require("cookie-parser");
const common_1 = require("@nestjs/common");
const creator_service_1 = require("./polizei-engine/services/creator.service");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors();
    app.setGlobalPrefix(process.env.APP_PREFIX, {
        exclude: ['/']
    });
    app.use(cookieParser());
    app.useStaticAssets((0, path_1.join)(__dirname, '..', '..', 'ui/app'), {
        prefix: '/app/',
    });
    app.use((req, res, next) => {
        if (req.path.startsWith('/app') && !req.path.match(/\.(js|css|png|jpg|jpeg|ico|svg|ttf|woff|woff2|eot|json)$/)) {
            return res.sendFile((0, path_1.join)(__dirname, '..', '..', 'ui', 'app', 'index.html'));
        }
        next();
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        transform: true,
        disableErrorMessages: false,
    }));
    app.setBaseViewsDir((0, path_1.join)(__dirname, '..', '..', 'public'));
    app.setViewEngine('hbs');
    const config = new swagger_1.DocumentBuilder()
        .setTitle("Polizei Docs")
        .setDescription("Sistema de gestion de seguridad")
        .setVersion(process.env.npm_package_version)
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    const swaggerDocumentService = app.get(creator_service_1.CreatorService);
    swaggerDocumentService.setDocument(document);
    swagger_1.SwaggerModule.setup(process.env.APP_PREFIX + "/docs", app, document);
    await app.listen(process.env.PORT);
}
bootstrap();
//# sourceMappingURL=main.js.map