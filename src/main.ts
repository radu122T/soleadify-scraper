import { AppModule } from "./app.module";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";
import { NestFactory } from "@nestjs/core";

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          brokers: ["kafka:9092"],
        },
      },
    }
  );
  await app.listen();
}

bootstrap().catch((error) => {
  console.error("Failed to start microservice", error);
});
