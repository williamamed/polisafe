"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PolisafeIamModule = void 0;
const common_1 = require("@nestjs/common");
const openid_controller_1 = require("./controllers/openid.controller");
const oauth_controller_1 = require("./controllers/oauth.controller");
const jwt_1 = require("@nestjs/jwt");
const auth_service_1 = require("./services/auth.service");
const client_service_1 = require("./services/client.service");
const sequelize_1 = require("@nestjs/sequelize");
const refresh_token_model_1 = require("./models/refresh-token.model");
const key_model_1 = require("./models/key.model");
const client_model_1 = require("./models/client.model");
const auth_code_model_1 = require("./models/auth-code.model");
const error_service_1 = require("./services/error.service");
const refresh_token_service_1 = require("./services/refresh-token.service");
const auth_code_service_1 = require("./services/auth-code.service");
const identity_service_1 = require("./services/identity.service");
const core_1 = require("@nestjs/core");
const openid_service_1 = require("./services/openid.service");
const schedule_1 = require("@nestjs/schedule");
const key_service_1 = require("./services/key.service");
const scopes_model_1 = require("./models/scopes.model");
const scopes_service_1 = require("./services/scopes.service");
const client_scopes_1 = require("./models/client.scopes");
const access_token_model_1 = require("./models/access-token.model");
const access_token_service_1 = require("./services/access-token.service");
const providers_service_1 = require("./services/providers.service");
const axios_1 = require("@nestjs/axios");
const notification_oauth_service_1 = require("./services/notification-oauth.service");
let PolisafeIamModule = class PolisafeIamModule {
};
exports.PolisafeIamModule = PolisafeIamModule;
exports.PolisafeIamModule = PolisafeIamModule = __decorate([
    (0, common_1.Module)({
        controllers: [openid_controller_1.OpenidController, oauth_controller_1.OauthController],
        imports: [
            axios_1.HttpModule,
            schedule_1.ScheduleModule.forRoot(),
            jwt_1.JwtModule.register({
                global: true,
                signOptions: { algorithm: 'RS256' }
            }),
            core_1.DiscoveryModule,
            sequelize_1.SequelizeModule.forFeature([
                scopes_model_1.ScopesModel,
                key_model_1.KeyModel,
                client_model_1.ClientModel,
                auth_code_model_1.AuthorizationCodeModel,
                refresh_token_model_1.RefreshTokenModel,
                client_scopes_1.ClientScopes,
                access_token_model_1.AccessTokenModel
            ]),
        ],
        providers: [
            auth_service_1.AuthService,
            auth_code_service_1.AuthCodeService,
            scopes_service_1.ScopesService,
            client_service_1.ClientService,
            error_service_1.ErrorService,
            refresh_token_service_1.RefreshTokenService,
            identity_service_1.IdentityService,
            openid_service_1.OpenidService,
            key_service_1.KeyService,
            access_token_service_1.AccessTokenService,
            providers_service_1.ProvidersService,
            notification_oauth_service_1.NotificationOauthService
        ],
        exports: [
            client_service_1.ClientService,
            auth_code_service_1.AuthCodeService,
            scopes_service_1.ScopesService
        ]
    })
], PolisafeIamModule);
//# sourceMappingURL=polisafe-iam.module.js.map