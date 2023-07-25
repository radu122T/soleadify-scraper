"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_module_1 = require("./app.module");
const microservices_1 = require("@nestjs/microservices");
const core_1 = require("@nestjs/core");
async function bootstrap() {
    const app = await core_1.NestFactory.createMicroservice(app_module_1.AppModule, {
        transport: microservices_1.Transport.KAFKA,
        options: {
            client: {
                brokers: ['kafka:9092'],
            },
        },
    });
    await app.listen();
}
bootstrap().catch((error) => {
    console.error('Failed to start microservice', error);
});
//# sourceMappingURL=main.js.map