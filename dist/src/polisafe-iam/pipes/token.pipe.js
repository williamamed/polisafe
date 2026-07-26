"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidationTokenPipe = void 0;
const common_1 = require("@nestjs/common");
const error_token_type_1 = require("../error/error-token.type");
let ValidationTokenPipe = class ValidationTokenPipe {
    transform(value, metadata) {
        this.validateGrantType(value);
        return value;
    }
    validateGrantType(tokenRequest) {
        if (tokenRequest.grant_type != 'authorization_code' &&
            tokenRequest.grant_type != 'password' &&
            tokenRequest.grant_type != 'refresh_token' &&
            tokenRequest.grant_type != 'token' &&
            tokenRequest.grant_type != 'client_credentials') {
            throw new common_1.BadRequestException({
                error: error_token_type_1.ErrorTokenType.unsupported_grant_type,
                error_description: "Invalid grant type"
            });
        }
        if (tokenRequest.grant_type == 'password') {
            if (!tokenRequest.username || !tokenRequest.password)
                throw new common_1.BadRequestException({
                    error: error_token_type_1.ErrorTokenType.invalid_request,
                    error_description: "Username and Password required"
                });
            if (!tokenRequest.credentials_basic) {
                throw new common_1.BadRequestException({
                    error: error_token_type_1.ErrorTokenType.unauthorized_client,
                    error_description: "Invalid client"
                });
            }
        }
        if (tokenRequest.grant_type == 'client_credentials') {
            if (!tokenRequest.credentials_basic) {
                throw new common_1.BadRequestException({
                    error: error_token_type_1.ErrorTokenType.unauthorized_client,
                    error_description: "Invalid client"
                });
            }
        }
        if (tokenRequest.grant_type == 'refresh_token') {
            if (!tokenRequest.credentials_basic && !tokenRequest.client_id) {
                throw new common_1.BadRequestException({
                    error: error_token_type_1.ErrorTokenType.unauthorized_client,
                    error_description: "Invalid client"
                });
            }
        }
        if (tokenRequest.grant_type == 'authorization_code') {
            if (!tokenRequest.code)
                throw new common_1.BadRequestException({
                    error: error_token_type_1.ErrorTokenType.invalid_request,
                    error_description: "Missing code"
                });
            if (!tokenRequest.client_id || !tokenRequest.redirect_uri)
                throw new common_1.BadRequestException({
                    error: error_token_type_1.ErrorTokenType.invalid_client,
                    error_description: "Missing client_id or redirect_uri"
                });
        }
    }
};
exports.ValidationTokenPipe = ValidationTokenPipe;
exports.ValidationTokenPipe = ValidationTokenPipe = __decorate([
    (0, common_1.Injectable)()
], ValidationTokenPipe);
//# sourceMappingURL=token.pipe.js.map