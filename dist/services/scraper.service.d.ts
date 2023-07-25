import { Repository } from "typeorm";
import { WebsiteEntity } from "src/entities/websites.entity";
import { Website } from "src/dto/create.user.dto";
import { HttpService } from "@nestjs/axios";
export declare class ScraperService {
    private readonly websiteRepository;
    private httpService;
    constructor(websiteRepository: Repository<WebsiteEntity>, httpService: HttpService);
    scrapeAndSaveWebsite(websiteInfo: Website): Promise<void>;
    private scrapeWebsite;
}
