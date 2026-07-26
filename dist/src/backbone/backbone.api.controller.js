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
exports.BackboneApiController = void 0;
const common_1 = require("@nestjs/common");
const event_emitter_1 = require("@nestjs/event-emitter");
let BackboneApiController = class BackboneApiController {
    async onData(data) {
        this.eventEmitter.emit(`backbone.${data.key}`, data);
        return "ok";
    }
};
exports.BackboneApiController = BackboneApiController;
__decorate([
    (0, common_1.Inject)(),
    __metadata("design:type", event_emitter_1.EventEmitter2)
], BackboneApiController.prototype, "eventEmitter", void 0);
__decorate([
    (0, common_1.Post)("endpoint"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BackboneApiController.prototype, "onData", null);
exports.BackboneApiController = BackboneApiController = __decorate([
    (0, common_1.Controller)('backbone')
], BackboneApiController);
//# sourceMappingURL=backbone.api.controller.js.map