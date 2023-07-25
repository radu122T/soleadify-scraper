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
exports.WebsiteEntity = void 0;
const typeorm_1 = require("typeorm");
let WebsiteEntity = exports.WebsiteEntity = class WebsiteEntity {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], WebsiteEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)("varchar", { name: "domain", length: 255 }),
    __metadata("design:type", String)
], WebsiteEntity.prototype, "domain", void 0);
__decorate([
    (0, typeorm_1.Column)("varchar", {
        name: "company_commercial_name",
        length: 255,
        nullable: true,
    }),
    __metadata("design:type", String)
], WebsiteEntity.prototype, "commercial_name", void 0);
__decorate([
    (0, typeorm_1.Column)("varchar", {
        name: "company_legal_name",
        length: 255,
        nullable: true,
    }),
    __metadata("design:type", String)
], WebsiteEntity.prototype, "legal_name", void 0);
__decorate([
    (0, typeorm_1.Column)("varchar", {
        name: "company_all_available_names",
        length: 255,
        nullable: true,
    }),
    __metadata("design:type", String)
], WebsiteEntity.prototype, "all_available_names", void 0);
__decorate([
    (0, typeorm_1.Column)("varchar", { name: "phone_numbers", array: true, nullable: true }),
    __metadata("design:type", Array)
], WebsiteEntity.prototype, "phone_numbers", void 0);
__decorate([
    (0, typeorm_1.Column)("varchar", { name: "social_media", array: true, nullable: true }),
    __metadata("design:type", Array)
], WebsiteEntity.prototype, "social_media", void 0);
__decorate([
    (0, typeorm_1.Column)("varchar", { name: "address", array: true, nullable: true }),
    __metadata("design:type", Array)
], WebsiteEntity.prototype, "address", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], WebsiteEntity.prototype, "createdAt", void 0);
exports.WebsiteEntity = WebsiteEntity = __decorate([
    (0, typeorm_1.Entity)("website")
], WebsiteEntity);
//# sourceMappingURL=websites.entity.js.map