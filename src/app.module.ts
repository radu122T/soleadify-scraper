import { Module } from "@nestjs/common";
import { ScraperService } from "./services/scraper.service";
import { ScraperController } from "./controller/scraper.controller";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule, ConfigService } from "@nestjs/config";
import configuration from "./config/configuration";
import { HttpModule } from "@nestjs/axios";
import { WebsiteEntity } from "./entities/websites.entity";

@Module({
  imports: [
    HttpModule.register({
      timeout: 30000,
    }),
    ConfigModule.forRoot({
      load: [configuration],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: "postgres",
        host: configService.get<string>("database.host"),
        port: configService.get<number>("database.port"),
        username: configService.get<string>("database.username"),
        password: configService.get<string>("database.password"),
        database: configService.get<string>("database.name"),
        entities: [__dirname + "/entities/**/*.entity{.ts,.js}"],
        synchronize: true,
        keepConnectionAlive: true,
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([WebsiteEntity]),
    ClientsModule.register([
      {
        name: "scraper",
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: "hero",
            brokers: ["kafka:9092"], // Use the service name 'kafka' as the hostname
          },
          consumer: {
            groupId: "hero-consumer",
          },
        },
      },
    ]),
  ],
  controllers: [ScraperController],
  providers: [ScraperService],
})
export class AppModule {}
