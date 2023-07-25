"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const scraper_service_1 = require("./services/scraper.service");
const scraper_controller_1 = require("./controller/scraper.controller");
const microservices_1 = require("@nestjs/microservices");
const typeorm_1 = require("@nestjs/typeorm");
const config_1 = require("@nestjs/config");
const configuration_1 = require("./config/configuration");
const axios_1 = require("@nestjs/axios");
const websites_entity_1 = require("./entities/websites.entity");
let AppModule = exports.AppModule = class AppModule {
};
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            axios_1.HttpModule.register({
                timeout: 30000,
            }),
            config_1.ConfigModule.forRoot({
                load: [configuration_1.default],
            }),
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule],
                useFactory: (configService) => ({
                    type: "postgres",
                    host: configService.get("database.host"),
                    port: configService.get("database.port"),
                    username: configService.get("database.username"),
                    password: configService.get("database.password"),
                    database: configService.get("database.name"),
                    entities: [__dirname + "/entities/**/*.entity{.ts,.js}"],
                    synchronize: true,
                    keepConnectionAlive: true,
                }),
                inject: [config_1.ConfigService],
            }),
            typeorm_1.TypeOrmModule.forFeature([websites_entity_1.WebsiteEntity]),
            microservices_1.ClientsModule.register([
                {
                    name: "csvUploadClient",
                    transport: microservices_1.Transport.KAFKA,
                    options: {
                        client: {
                            clientId: "hero",
                            brokers: ["kafka:9092"],
                        },
                        consumer: {
                            groupId: "hero-consumer",
                        },
                    },
                },
            ]),
        ],
        controllers: [scraper_controller_1.ScraperController],
        providers: [scraper_service_1.ScraperService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map