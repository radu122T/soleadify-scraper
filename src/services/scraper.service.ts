import { Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { WebsiteEntity } from "src/entities/websites.entity";
import { Website } from "src/dto/webiste.dto";
import { HttpService } from "@nestjs/axios";
import * as puppeteer from "puppeteer";
import * as cheerio from "cheerio";
import { ClientKafka } from "@nestjs/microservices";

@Injectable()
export class ScraperService {
  constructor(
    @InjectRepository(WebsiteEntity)
    private readonly websiteRepository: Repository<WebsiteEntity>,
    @Inject("scraper")
    private clientKafka: ClientKafka,
    private httpService: HttpService
  ) {}

  async scrapeAndSaveWebsite(websiteInfo: Website) {
    let scrapedInfo = await this.scrapeWebsite(websiteInfo.domain);

    const websiteInfoForEntity = {
      ...scrapedInfo,
      commercial_name: websiteInfo?.company_commercial_name,
      legal_name: websiteInfo?.company_legal_name,
      all_available_names: websiteInfo?.company_all_available_names,
      phone_numbers: websiteInfo?.phone_numbers,
      social_media: websiteInfo?.social_media,
      address: websiteInfo?.address,
    };

    let website = await this.websiteRepository.findOne({
      where: { domain: websiteInfo?.domain },
    });

    if (website) {
      website = this.websiteRepository.merge(website, websiteInfoForEntity);
    }

    await this.websiteRepository.save(website ? website : websiteInfoForEntity);
  }

  private async scrapeWebsite(domain: string): Promise<Website> {
    try {
      const browser = await puppeteer.launch({
        executablePath: "/usr/bin/google-chrome-stable",
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
        headless: "new",
      });
      const page = await browser.newPage();

      await page.goto(`http://${domain}`);
      const content = await page.content();

      // Use cheerio to parse the content
      const $ = cheerio.load(content);

      const phoneRegex = /\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/g;
      const socialMediaLinks = [];
      const addresses = [];

      const text = $("body").text();
      const phoneNumbers = Array.from(text.matchAll(phoneRegex), (m) => m[0]);

      $("a").each((_, element) => {
        const href = $(element).attr("href");
        if (href) {
          if (
            href.includes("facebook.com") ||
            href.includes("twitter.com") ||
            href.includes("instagram.com")
          ) {
            socialMediaLinks.push(href);
          }
        }
      });

      $("h1, h2, h3, h4, h5, h6").each((_, element) => {
        if ($(element).text().toLowerCase().includes("address")) {
          addresses.push($(element).next("p").text());
        }
      });

      await browser.close();

      const websiteInfo: Website = {
        domain: domain,
        phone_numbers: phoneNumbers,
        social_media: socialMediaLinks,
        address: addresses,
      };
      console.log(`Scraped ${domain}`);
      return websiteInfo;
    } catch {
      console.log(`Failed to scrape ${domain}`);
      return { domain: domain };
    }
  }

  async queryAllWebsitesFromDB(): Promise<Website[]> {
    return this.websiteRepository.find();
  }

  async getByDomain(domain: string): Promise<Website> {
    let website = await this.websiteRepository.findOne({
      where: { domain: domain },
    });
    return website;
  }

  async getByPhoneNumber(phoneNumber: string): Promise<Website | undefined> {
    let website = await this.websiteRepository
      .createQueryBuilder("website")
      .where("website.phone_numbers LIKE :phoneNumber", {
        phoneNumber: `%${phoneNumber}%`,
      })
      .getOne();

    if (website) {
      return website;
    } else {
      this.sendToErrorTopic("No domain was found with this number.");
    }
  }

  async create(websiteInfo: Website): Promise<Website> {
    const website = await this.websiteRepository.findOne({
      where: { domain: websiteInfo.domain },
    });

    if (website) {
      this.sendToErrorTopic("Something went wrong.");
      return;
    }

    const createdWebsite = await this.websiteRepository.save(websiteInfo);

    return createdWebsite;
  }

  async updateWebsite(websiteInfo): Promise<any> {
    const domain = websiteInfo.domain;
    const updateInfo = websiteInfo.website;
    const website = await this.websiteRepository.findOne({
      where: { domain: domain },
    });

    if (!website) {
      this.sendToErrorTopic(
        "There is no website with this domain name in database."
      );
      return;
    }

    const updatedWebsite = this.websiteRepository.merge(website, updateInfo);

    await this.websiteRepository.save(updatedWebsite);
  }

  async deleteWebsite(domain: string): Promise<any> {
    const website = await this.websiteRepository.findOne({
      where: { domain: domain },
    });

    if (!website) {
      this.sendToErrorTopic(
        "There is no website with this domain name in database."
      );
      return;
    }

    await this.websiteRepository.remove(website);
  }

  private async sendToErrorTopic(message: string | Error): Promise<void> {
    this.clientKafka.emit(
      "error-topic",
      typeof message === "string" ? message : message.message
    );
  }
}
