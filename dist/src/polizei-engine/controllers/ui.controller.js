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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UiController = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const fs_1 = require("fs");
const path_1 = require("path");
let UiController = class UiController {
    async provide(res) {
        let landing = this.configService.get('PLS_UI_LANDING', 'none');
        if (landing == 'none')
            return res.redirect('/app');
        if (landing == 'landing' && (0, fs_1.existsSync)((0, path_1.join)(process.cwd(), 'ui', 'landing', 'index.html')))
            return res.sendFile((0, path_1.join)(process.cwd(), 'ui', 'landing', 'index.html'));
        return "Landing not found";
    }
};
exports.UiController = UiController;
__decorate([
    (0, common_1.Inject)(),
    __metadata("design:type", config_1.ConfigService)
], UiController.prototype, "configService", void 0);
__decorate([
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.Get)('/'),
    __param(0, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UiController.prototype, "provide", null);
exports.UiController = UiController = __decorate([
    (0, common_1.Controller)()
], UiController);
//# sourceMappingURL=ui.controller.js.map