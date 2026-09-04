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
exports.CreatorService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const security_scope_1 = require("../models/security.scope");
const security_user_1 = require("../models/security.user");
const security_role_1 = require("../models/security.role");
const security_permission_1 = require("../models/security.permission");
const trace_service_1 = require("./trace.service");
const security_trace_1 = require("../models/security.trace");
const config_polizei_1 = require("../../polisafe-sdk/config.polizei");
const client_service_1 = require("../../polisafe-iam/services/client.service");
const fs_1 = require("fs");
const path_1 = require("path");
const scopes_service_1 = require("../../polisafe-iam/services/scopes.service");
let CreatorService = class CreatorService {
    constructor() {
        this.document = null;
    }
    setDocument(document) {
        this.document = document;
        console.log('✅ Swagger document stored in service!');
    }
    getDocument() {
        return this.document;
    }
    async onModuleInit() {
        try {
            await this.createProject();
        }
        catch (error) {
            common_1.Logger.error("Error instalando datos por defecto: " + error.message);
        }
    }
    async verifyInstalledClient() {
        let trace = await this.traceModel.findOne({
            where: {
                state: 20
            }
        });
        if (trace) {
            const [clientId, clientSecretHash, tid] = trace.description.split(':');
            this.options.client_id = clientId;
            this.options.client_secret = clientSecretHash;
            this.syncUiConfig(this.options.client_id, tid);
        }
        else {
            common_1.Logger.warn("The current-installed-client is missing...we proceed to install", "Creator");
            return false;
        }
        return true;
    }
    async createProject() {
        if (await this.verifyInstalledClient()) {
            throw new common_1.ConflictException("El proyecto ya se encuentra creado.");
        }
        let scope = await this.scopeModel.create({
            name: 'Polizei',
            description: 'Root Scope',
            settings: this.getDefaultSettings()
        });
        let role = await this.roleModel.create({
            name: 'Polizei Admin',
            description: 'Root Admin',
            idScope: scope.id
        });
        let admin = await this.userModel.create({
            username: 'admin',
            fullname: 'Root Admin Polizei',
            state: 1,
            password: 'admin',
            profile: {
                "phone": "",
                "email": "",
                "address": "-"
            }
        });
        admin.$add('roles', [role]);
        admin.$add('scopes', [scope]);
        const permissions = this.getAllEndpoints().filter((endpoint) => {
            return endpoint.security != false;
        });
        let permissionsInstances = await this.permissionModel.bulkCreate(permissions.map((permission) => {
            return {
                name: permission.path,
                description: permission.description,
                idScope: scope.id,
                type: 0,
                settings: { "folder": `Polisafe/${permission.tags.length > 0 ? permission.tags[0] : 'Default'}`, "type": permission.method }
            };
        }));
        role.$set('permissions', permissionsInstances);
        const baseScopes = await this.scopesService.bulkCreate([
            {
                "name": "openid",
                "displayName": "Verificar tu identidad",
                "description": "Permite a la aplicación verificar tu identidad mediante OpenID Connect."
            },
            {
                "name": "profile",
                "displayName": "Ver información básica de tu perfil",
                "description": "Permite a la aplicación acceder a la información pública de tu perfil."
            },
            {
                "name": "email",
                "displayName": "Ver tu dirección de correo electrónico",
                "description": "Permite a la aplicación acceder a tu dirección de correo electrónico (email) y al estado de verificación de la misma (email_verified)."
            },
            {
                "name": "address",
                "displayName": "Ver tu dirección postal",
                "description": "Permite a la aplicación acceder a tu dirección postal completa."
            },
            {
                "name": "phone",
                "displayName": "Ver tu número de teléfono",
                "description": "Permite a la aplicación acceder a tu número de teléfono (phone_number) y al estado de verificación del mismo (phone_number_verified)."
            },
            {
                "name": "offline_access",
                "displayName": "Mantener el acceso incluso cuando no estés conectado",
                "description": "Permite que la aplicación reciba un Refresh Token, que puede ser utilizado para obtener nuevos Access Tokens cuando el actual expire."
            },
            {
                "name": "groups",
                "displayName": "Ver tus grupos de pertenencia",
                "description": "Permite a la aplicación conocer los grupos a los que perteneces dentro del sistema. Esto es útil para implementar lógica de autorización basada en grupos o roles organizacionales."
            },
            {
                "name": "security:io:authorization",
                "displayName": "Verificar permisos del usuario",
                "description": "Permite a la aplicación verificar permisos, solo disponible para client_credentials."
            },
            {
                "name": "security:io:tenants",
                "displayName": "Ver los tenants hijos",
                "description": "Permite a la aplicación listar los tenants hijos."
            }
        ]);
        let client = await this.clientService.create({
            redirectUris: [`${process.env.PLS_PUBLIC_URL}/app/callback`],
            grants: ["authorization_code", "client_credentials", "password", "refresh_token"],
            tenant: `${scope.id}`,
            name: "Default",
            type: "public",
            meta: { "openid_include_permissions": true, "access_token_include_permissions": true },
            postLogoutRedirectUris: [`${process.env.PLS_PUBLIC_URL}/app/logout`],
            scopes: baseScopes.map((scopeOauth) => scopeOauth.id)
        });
        this.options.client_id = client.clientId;
        this.options.client_secret = client.clientSecretHash;
        this.syncUiConfig(this.options.client_id, `${scope.id}`);
        await this.traceService.register(admin.username, scope.id, `${client.clientId}:${client.clientSecretHash}:${scope.id}`, 20);
        return {
            tid: scope.id
        };
    }
    getAllEndpoints() {
        if (!this.document)
            return null;
        const paths = this.document.paths || {};
        const results = [];
        for (const [path, methods] of Object.entries(paths)) {
            for (const [method, details] of Object.entries(methods)) {
                if (['get', 'post', 'put', 'delete', 'patch', 'head', 'options'].includes(method)) {
                    results.push({
                        path,
                        method: method.toUpperCase(),
                        summary: details.summary || '',
                        description: details.description || '',
                        tags: details.tags || [],
                        parameters: details.parameters || [],
                        requestBody: details.requestBody || null,
                        responses: details.responses || {},
                        operationId: details.operationId || '',
                        security: details.security || false,
                        deprecated: details.deprecated || false,
                    });
                }
            }
        }
        return results;
    }
    getEndpointsGroupedByTag() {
        const endpoints = this.getAllEndpoints().filter((endpoint) => {
            return endpoint.security != false;
        });
        const grouped = {};
        for (const endpoint of endpoints) {
            const tags = endpoint.tags && endpoint.tags.length > 0 ? endpoint.tags : ['untagged'];
            for (const tag of tags) {
                if (!grouped[tag]) {
                    grouped[tag] = [];
                }
                grouped[tag].push(endpoint);
            }
        }
        return grouped;
    }
    async syncUiConfig(client_id, tid) {
        try {
            let config = JSON.parse((0, fs_1.readFileSync)((0, path_1.join)(process.cwd(), 'ui', 'app', 'assets', 'config', 'prod.json')).toString());
            if (!config.services)
                config.services = {};
            config.services.security = `${process.env.PLS_PUBLIC_URL}${process.env.APP_PREFIX}`;
            config.iaChat = `${process.env.PLS_UI_IA_CHAT || ''}`;
            config.mode = `${process.env.PLS_UI_MODE || 'production'}`;
            if (!config.oauth)
                config.oauth = {};
            config.oauth.client_id = client_id;
            config.oauth.tid = tid;
            config.oauth.authority = `${process.env.PLS_PUBLIC_URL}${process.env.APP_PREFIX}/polisafe`;
            config.oauth.redirect_uri = `${process.env.PLS_PUBLIC_URL}/app/callback`;
            config.oauth.silent_redirect_uri = `${process.env.PLS_PUBLIC_URL}/app/core/oauth2/silent-refresh-callback.html`;
            config.oauth.scope = `${process.env.PLS_UI_OAUTH_SCOPE || 'openid profile'}`;
            config.oauth.post_logout_redirect_uri = `${process.env.PLS_PUBLIC_URL}/app/logout`;
            if (process.env.PLS_UI_LICENSE) {
                if (!config.licenseApp)
                    config.licenseApp = {};
                config.licenseApp.productId = process.env.PLS_UI_LICENSE;
                config.licenseApp.type = process.env.PLS_UI_LICENSE_TYPE;
                config.licenseApp.purchaseUrl = process.env.PLS_UI_LICENSE_URL;
            }
            else {
                delete config.licenseApp;
            }
            config.configDefaults = this.getDefaultSettings().configApps.polisafe;
            (0, fs_1.writeFileSync)((0, path_1.join)(process.cwd(), 'ui', 'app', 'assets', 'config', 'prod.json'), JSON.stringify(config, null, '    '));
            common_1.Logger.log("UI config updated", "Creator");
        }
        catch (error) {
            common_1.Logger.error(error);
        }
    }
    getDefaultSettings() {
        return {
            "idImage": null,
            "adapters": {},
            "configApps": {
                "global": {},
                "polisafe": [
                    {
                        "label": "País",
                        "name": "country:api",
                        "type": "select",
                        "value": "+53",
                        "description": "Prefijo de configuración telefono",
                        "options": "Cuba:+53,EEUU:+1,Germany:+49",
                        "group": "General"
                    },
                    {
                        "label": "Broadcast de Emails",
                        "name": "mt.email.notification",
                        "type": "input",
                        "value": "",
                        "placeholder": "jhon@gmail.com,elena@gmail.com",
                        "description": "Emails que recibiran las notificaciones importantes del espacios de trabajo",
                        "group": "General"
                    },
                    {
                        "label": "Activar notificaciones Emails",
                        "name": "mt.email.notification.state",
                        "type": "boolean",
                        "value": true,
                        "description": "Activa el envio de emails importantes y notificaciones del espacio de trabajo",
                        "group": "General"
                    },
                    {
                        "label": "Asistente IA",
                        "name": "assistant.ia",
                        "type": "boolean",
                        "value": false,
                        "placeholder": "",
                        "group": "IA",
                        "description": "Activa el agente IA para este espacio de trabajo"
                    },
                    {
                        "label": "Nombre Cabecera",
                        "name": "login.title",
                        "type": "input",
                        "value": "Polisafe Security",
                        "placeholder": "",
                        "group": "Login",
                        "description": "Nombre de la cabecera del login",
                        "visibility": "public"
                    },
                    {
                        "label": "Descripcion Cabecera",
                        "name": "login.description",
                        "type": "input",
                        "value": "Bienvenido !",
                        "placeholder": "",
                        "group": "Login",
                        "description": "Descripcion de la cabecera del login",
                        "visibility": "public"
                    },
                    {
                        "type": "boolean",
                        "name": "login.darkmode",
                        "label": "Modo oscuro",
                        "options": null,
                        "placeholder": null,
                        "group": "Login",
                        "value": false,
                        "description": "Activa el modo oscuro para el login",
                        "visibility": "public"
                    },
                    {
                        "type": "input",
                        "name": "login.button.next.name",
                        "label": "Label boton login",
                        "options": null,
                        "placeholder": "Next",
                        "group": "Login",
                        "value": "Seguir",
                        "description": "Texto personalizado del boton de login",
                        "visibility": "public"
                    },
                    {
                        "type": "input",
                        "name": "login.button.register.name",
                        "label": "Label enlace de registro",
                        "options": null,
                        "placeholder": null,
                        "group": "Login",
                        "value": "Crear",
                        "description": "Texto personalizado del boton de registro",
                        "visibility": "public"
                    },
                    {
                        "type": "input",
                        "name": "login.register.url",
                        "label": "Enlace formulario de registro (Url)",
                        "options": null,
                        "placeholder": null,
                        "group": "Login",
                        "value": "register",
                        "description": "URL personalizada para la pagina de registro, sino se expecifica se muestra la pagina por defecto",
                        "visibility": "public"
                    },
                    {
                        "type": "input",
                        "name": "login.css.url",
                        "label": "Enlace Url de CSS",
                        "options": null,
                        "placeholder": null,
                        "group": "Login",
                        "value": "",
                        "description": "URL del archivo de CSS para personalizar la pagina de login",
                        "visibility": "public"
                    },
                    {
                        "type": "boolean",
                        "name": "login.google.provider",
                        "label": "Google Auth",
                        "options": null,
                        "placeholder": null,
                        "group": "Google",
                        "value": true,
                        "description": "Activar el proveedor de autenticacion de Google",
                        "visibility": "public"
                    },
                    {
                        "type": "input",
                        "name": "login.google.client_id",
                        "label": "Google ClientId",
                        "options": null,
                        "placeholder": "client_id",
                        "group": "Google",
                        "value": "",
                        "description": "Client-id del proveedor de google",
                    },
                    {
                        "type": "input",
                        "name": "login.google.client_secret",
                        "label": "Google ClientSecret",
                        "options": null,
                        "placeholder": "client_secret",
                        "group": "Google",
                        "value": "",
                        "description": "Client-secret del proveedor de google (Google no cumple enteramente la especificacion oauth y hay que especificarlo)",
                    },
                    {
                        "type": "multiselect",
                        "name": "register.auto.tenant",
                        "label": "Auto tenant",
                        "options": null,
                        "placeholder": null,
                        "group": "General",
                        "url": "{{security}}/polizei/admin/scope/list-all",
                        "mapResult": "label:name,value:id",
                        "loading": false,
                        "data": [],
                        "value": null,
                        "description": "Tenants que seran asignados por defecto en el registro de un usuario a traves de la pagina de registro",
                    },
                    {
                        "type": "multiselect",
                        "name": "register.auto.roles",
                        "label": "Auto roles",
                        "options": null,
                        "placeholder": null,
                        "group": "General",
                        "url": "{{security}}/polizei/admin/roles/list-assign",
                        "mapResult": "label:name,value:id",
                        "loading": false,
                        "data": [],
                        "value": null,
                        "description": "Roles que seran asignados por defecto en el registro de un usuario a traves de la pagina de registro",
                    },
                    {
                        "type": "boolean",
                        "name": "login.magiclink",
                        "label": "Magic",
                        "options": null,
                        "placeholder": null,
                        "group": "Login",
                        "url": null,
                        "mapResult": null,
                        "value": false,
                        "description": "Activar la opcion de login MagicLink (Se enviara un codigo de autenticacion a tu email)",
                        "visibility": "public"
                    },
                    {
                        "type": "input",
                        "name": "external.webhook.url",
                        "label": "Webhook",
                        "options": null,
                        "placeholder": null,
                        "group": "General",
                        "url": null,
                        "mapResult": null,
                        "value": "",
                        "description": "Webhook de envio de eventos del sistema, el webhook debe escuchar por el metodo POST",
                    },
                    {
                        "type": "select",
                        "name": "login.language",
                        "label": "Language",
                        "options": null,
                        "placeholder": null,
                        "group": "Login",
                        "url": "https://www.elegantys.net/identity/translations.json",
                        "mapResult": "label:name,value:id",
                        "loading": false,
                        "data": [
                            {
                                "label": "Browser(Preferred Language)",
                                "value": "browser"
                            },
                            {
                                "label": "Español",
                                "value": "es"
                            },
                            {
                                "label": "English",
                                "value": "en"
                            },
                            {
                                "label": "Português",
                                "value": "pt"
                            },
                            {
                                "label": "Français",
                                "value": "fr"
                            },
                            {
                                "label": "Deutsch",
                                "value": "de"
                            },
                            {
                                "label": "Русский",
                                "value": "ru"
                            }
                        ],
                        "value": "browser",
                        "description": "Lenguaje por defecto a utilizar en la pagina de login y registro",
                        "visibility": "public"
                    },
                    {
                        "type": "multiselect",
                        "name": "invitation.roles",
                        "label": "Invitation Roles",
                        "options": null,
                        "placeholder": null,
                        "group": "General",
                        "url": "{{security}}/polizei/admin/roles/list-assign",
                        "mapResult": "label:name,value:id",
                        "loading": false,
                        "data": [],
                        "value": null,
                        "description": "Roles por defecto que seran asignados en una invitacion de usuario",
                    },
                    {
                        "type": "select",
                        "name": "register.hub.tenant",
                        "label": "Tenant de registro",
                        "options": null,
                        "placeholder": null,
                        "group": "General",
                        "url": "{{security}}/polizei/admin/scope/list-all",
                        "mapResult": "label:name,value:id",
                        "loading": false,
                        "data": [],
                        "value": null,
                        "description": "Tenant contenedor de registro de Espacios de trabajo (tenants de registro)",
                    },
                    {
                        "type": "input",
                        "name": "contact.support",
                        "label": "Email Contacto",
                        "options": null,
                        "placeholder": null,
                        "group": "Login",
                        "url": null,
                        "mapResult": null,
                        "value": "",
                        "description": "Email de contacto a mostrar en las pantallas publicas de login, registro e invitacion",
                        "visibility": "public"
                    },
                    {
                        "type": "boolean",
                        "name": "login.github.provider",
                        "label": "Github Auth",
                        "options": null,
                        "placeholder": null,
                        "group": "Github",
                        "value": true,
                        "description": "Activar el proveedor de autenticacion de Github",
                        "visibility": "public"
                    },
                    {
                        "type": "input",
                        "name": "login.github.client_id",
                        "label": "Github ClientId",
                        "options": null,
                        "placeholder": "client_id",
                        "group": "Github",
                        "value": "",
                        "description": "Client-id del proveedor",
                    },
                    {
                        "type": "input",
                        "name": "login.github.client_secret",
                        "label": "Github ClientSecret",
                        "options": null,
                        "placeholder": "client_secret",
                        "group": "Github",
                        "value": "",
                        "description": "Client-secret del proveedor",
                    },
                    {
                        "type": "boolean",
                        "name": "login.custom.test.provider",
                        "label": "Activar Test Provider",
                        "options": null,
                        "placeholder": null,
                        "group": "Provider",
                        "url": null,
                        "visibility": true,
                        "mapResult": null,
                        "value": true
                    }, {
                        "type": "input",
                        "name": "login.custom.test.icon",
                        "label": "Icono",
                        "options": null,
                        "placeholder": null,
                        "group": "Provider",
                        "url": null,
                        "visibility": true,
                        "mapResult": null,
                        "value": ""
                    }, {
                        "type": "input",
                        "name": "login.custom.test.client_id",
                        "label": null,
                        "options": null,
                        "placeholder": "Client id",
                        "group": "Provider",
                        "url": null,
                        "visibility": true,
                        "mapResult": null,
                        "value": ""
                    }, {
                        "type": "input",
                        "name": "login.custom.test.client_secret",
                        "label": "Client Secret",
                        "options": null,
                        "placeholder": "Client secret (Some providers needed)",
                        "group": "Provider",
                        "url": null,
                        "visibility": null,
                        "mapResult": null,
                        "value": ""
                    }, {
                        "type": "input",
                        "name": "login.custom.test.authurl",
                        "label": "Auth Url",
                        "options": null,
                        "placeholder": "url...",
                        "group": "Provider",
                        "url": null,
                        "visibility": null,
                        "mapResult": null,
                        "value": ""
                    }, {
                        "type": "input",
                        "name": "login.custom.test.tokenurl",
                        "label": "Token Url",
                        "options": null,
                        "placeholder": "url...",
                        "group": "Provider",
                        "url": null,
                        "visibility": null,
                        "mapResult": null,
                        "value": ""
                    }, {
                        "type": "input",
                        "name": "login.custom.test.response",
                        "label": "Response Type",
                        "options": null,
                        "placeholder": "",
                        "group": "Provider",
                        "url": null,
                        "visibility": null,
                        "mapResult": null,
                        "value": "code"
                    }, {
                        "type": "input",
                        "name": "login.custom.test.challenge",
                        "label": "Code Chalenge",
                        "options": null,
                        "placeholder": "",
                        "group": "Provider",
                        "url": null,
                        "visibility": null,
                        "mapResult": null,
                        "value": "S256"
                    }, {
                        "type": "input",
                        "name": "login.custom.test.userinfo",
                        "label": "Userinfo Url",
                        "options": null,
                        "placeholder": "url...",
                        "group": "Provider",
                        "url": null,
                        "visibility": null,
                        "mapResult": null,
                        "value": ""
                    }
                ]
            }
        };
    }
};
exports.CreatorService = CreatorService;
__decorate([
    (0, sequelize_1.InjectModel)(security_scope_1.SecurityScope),
    __metadata("design:type", Object)
], CreatorService.prototype, "scopeModel", void 0);
__decorate([
    (0, sequelize_1.InjectModel)(security_user_1.SecurityUser),
    __metadata("design:type", Object)
], CreatorService.prototype, "userModel", void 0);
__decorate([
    (0, sequelize_1.InjectModel)(security_role_1.SecurityRole),
    __metadata("design:type", Object)
], CreatorService.prototype, "roleModel", void 0);
__decorate([
    (0, sequelize_1.InjectModel)(security_permission_1.SecurityPermission),
    __metadata("design:type", Object)
], CreatorService.prototype, "permissionModel", void 0);
__decorate([
    (0, sequelize_1.InjectModel)(security_trace_1.SecurityTrace),
    __metadata("design:type", Object)
], CreatorService.prototype, "traceModel", void 0);
__decorate([
    (0, common_1.Inject)(),
    __metadata("design:type", trace_service_1.TraceService)
], CreatorService.prototype, "traceService", void 0);
__decorate([
    (0, common_1.Inject)(),
    __metadata("design:type", client_service_1.ClientService)
], CreatorService.prototype, "clientService", void 0);
__decorate([
    (0, common_1.Inject)(),
    __metadata("design:type", scopes_service_1.ScopesService)
], CreatorService.prototype, "scopesService", void 0);
__decorate([
    (0, common_1.Inject)('POLIZEI_CONFIG_OPTIONS'),
    __metadata("design:type", config_polizei_1.ConfigPolizei)
], CreatorService.prototype, "options", void 0);
exports.CreatorService = CreatorService = __decorate([
    (0, common_1.Injectable)()
], CreatorService);
//# sourceMappingURL=creator.service.js.map