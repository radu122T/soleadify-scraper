import { KafkaContext } from "@nestjs/microservices";
import { ScraperService } from "src/services/scraper.service";
export declare class ScraperController {
    private scraperService;
    constructor(scraperService: ScraperService);
    handleWebsiteScraping(message: any, context: KafkaContext): Promise<void>;
}
