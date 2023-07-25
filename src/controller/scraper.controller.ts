import { Controller } from "@nestjs/common";
import {
  Ctx,
  EventPattern,
  KafkaContext,
  MessagePattern,
  Payload,
} from "@nestjs/microservices";
import { Website } from "src/dto/webiste.dto";
import { ScraperService } from "src/services/scraper.service";

@Controller()
export class ScraperController {
  constructor(private scraperService: ScraperService) {}

  @EventPattern("websites-to-scrape")
  async handleWebsiteScraping(
    @Payload() message: any,
    @Ctx() context: KafkaContext
  ) {
    const websiteInfo = { ...message };
    await this.scraperService.scrapeAndSaveWebsite(websiteInfo);
  }

  @MessagePattern("get-all-websites")
  async getAllWebsites(@Ctx() context: KafkaContext): Promise<any> {
    const websites = await this.scraperService.queryAllWebsitesFromDB();
    return websites;
  }

  @MessagePattern("get-by-domain")
  async getByDomain(
    @Payload() domain: string,
    @Ctx() context: KafkaContext
  ): Promise<any> {
    const website = await this.scraperService.getByDomain(domain);
    return JSON.stringify(website);
  }

  @MessagePattern("get-by-phoneNumber")
  async getByPhoneNUmber(
    @Payload() phoneNumber: string,
    @Ctx() context: KafkaContext
  ): Promise<any> {
    const website = await this.scraperService.getByPhoneNumber(phoneNumber);
    return JSON.stringify(website);
  }

  @MessagePattern("create-website")
  async createWebsite(
    @Payload() websiteInfo: Website,
    @Ctx() context: KafkaContext
  ): Promise<any> {
    const website = await this.scraperService.create(websiteInfo);
    return JSON.stringify(website);
  }

  @MessagePattern("update-website")
  async updateWebsite(
    @Payload() WebsiteInfo,
    @Ctx() context: KafkaContext
  ): Promise<any> {
    await this.scraperService.updateWebsite(WebsiteInfo);
  }

  @MessagePattern("delete-website")
  async deleteWebsite(
    @Payload() domain: string,
    @Ctx() context: KafkaContext
  ): Promise<any> {
    await this.scraperService.deleteWebsite(domain);
  }
}
