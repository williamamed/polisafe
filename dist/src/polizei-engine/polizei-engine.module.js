"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PolizeiEngineModule = void 0;
const common_1 = require("@nestjs/common");
const login_controller_1 = require("./controllers/login.controller");
const user_controller_1 = require("./controllers/user.controller");
const role_controller_1 = require("./controllers/role.controller");
const permission_controller_1 = require("./controllers/permission.controller");
const scope_controller_1 = require("./controllers/scope.controller");
const profile_controller_1 = require("./controllers/profile.controller");
const user_service_1 = require("./services/user.service");
const permission_service_1 = require("./services/permission.service");
const role_service_1 = require("./services/role.service");
const auth_service_1 = require("./services/auth.service");
const scope_service_1 = require("./services/scope.service");
const sequelize_1 = require("@nestjs/sequelize");
const jwt_1 = require("@nestjs/jwt");
const security_scope_1 = require("./models/security.scope");
const security_user_1 = require("./models/security.user");
const security_user_scope_1 = require("./models/security.user.scope");
const security_role_1 = require("./models/security.role");
const security_user_role_1 = require("./models/security.user.role");
const security_permission_1 = require("./models/security.permission");
const security_role_permission_1 = require("./models/security.role.permission");
const common_2 = require("@raptorjs/common");
const review_service_1 = require("./services/review.service");
const api_controller_1 = require("./controllers/api.controller");
const trace_service_1 = require("./services/trace.service");
const security_trace_1 = require("./models/security.trace");
const creator_service_1 = require("./services/creator.service");
const security_session_1 = require("./models/security.session");
const session_service_1 = require("./services/session.service");
const identity_service_1 = require("./services/identity.service");
const invitation_service_1 = require("./services/invitation.service");
const invitation_controller_1 = require("./controllers/invitation.controller");
const security_invitation_1 = require("./models/security.invitation");
const axios_1 = require("@nestjs/axios");
const notification_service_1 = require("./services/notification.service");
const clients_controller_1 = require("./controllers/oauth/clients.controller");
const polisafe_iam_module_1 = require("../polisafe-iam/polisafe-iam.module");
const iam_model_service_1 = require("./services/iam-model.service");
const scopes_controller_1 = require("./controllers/oauth/scopes.controller");
const url_service_1 = require("./services/url.service");
const core_1 = require("@nestjs/core");
const upload_controller_1 = require("./controllers/upload/upload.controller");
const upload_service_1 = require("./services/upload/upload.service");
const io_controller_1 = require("./controllers/client-api/io.controller");
const ui_controller_1 = require("./controllers/ui.controller");
let PolizeiEngineModule = class PolizeiEngineModule {
};
exports.PolizeiEngineModule = PolizeiEngineModule;
exports.PolizeiEngineModule = PolizeiEngineModule = __decorate([
    (0, common_1.Module)({
        controllers: [
            login_controller_1.LoginController,
            user_controller_1.UserController,
            role_controller_1.RoleController,
            permission_controller_1.PermissionController,
            scope_controller_1.ScopeController,
            profile_controller_1.ProfileController,
            api_controller_1.ApiController,
            invitation_controller_1.InvitationController,
            clients_controller_1.ClientsController,
            scopes_controller_1.ScopesController,
            upload_controller_1.UploadController,
            io_controller_1.IoController,
            ui_controller_1.UiController
        ],
        providers: [
            user_service_1.UserService,
            permission_service_1.PermissionService,
            role_service_1.RoleService,
            auth_service_1.AuthService,
            scope_service_1.ScopeService,
            review_service_1.ReviewService,
            trace_service_1.TraceService,
            creator_service_1.CreatorService,
            session_service_1.SessionService,
            identity_service_1.IdentityService,
            invitation_service_1.InvitationService,
            notification_service_1.NotificationService,
            iam_model_service_1.IamModelService,
            url_service_1.UrlService,
            upload_service_1.UploadService
        ],
        imports: [
            sequelize_1.SequelizeModule.forFeature([
                security_scope_1.SecurityScope,
                security_user_scope_1.SecurityUserScope,
                security_user_1.SecurityUser,
                security_role_1.SecurityRole,
                security_user_role_1.SecurityUserRole,
                security_permission_1.SecurityPermission,
                security_role_permission_1.SecurityRolePermission,
                security_trace_1.SecurityTrace,
                security_session_1.SecuritySession,
                security_invitation_1.SecurityInvitation
            ]),
            jwt_1.JwtModule.register({
                global: true
            }),
            common_2.CommonModule,
            axios_1.HttpModule,
            core_1.DiscoveryModule,
            polisafe_iam_module_1.PolisafeIamModule
        ],
        exports: [sequelize_1.SequelizeModule]
    })
], PolizeiEngineModule);
//# sourceMappingURL=polizei-engine.module.js.map