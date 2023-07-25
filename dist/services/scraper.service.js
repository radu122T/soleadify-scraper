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
exports.ScraperService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const websites_entity_1 = require("../entities/websites.entity");
const axios_1 = require("@nestjs/axios");
const puppeteer = require("puppeteer");
const cheerio = require("cheerio");
let ScraperService = exports.ScraperService = class ScraperService {
    constructor(websiteRepository, httpService) {
        this.websiteRepository = websiteRepository;
        this.httpService = httpService;
    }
    async scrapeAndSaveWebsite(websiteInfo) {
        let scrapedInfo = this.scrapeWebsite(websiteInfo.domain);
        console.log(scrapedInfo);
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
    async scrapeWebsite(domain) {
        const browser = await puppeteer.launch({
            executablePath: "/usr/bin/google-chrome-stable",
            args: ["--no-sandbox", "--disable-setuid-sandbox"],
        });
        const page = await browser.newPage();
        await page.goto(`http://${domain}`);
        const content = await page.content();
        const $ = cheerio.load(content);
        const phoneRegex = /\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/g;
        const socialMediaLinks = [];
        const addresses = [];
        const text = $("body").text();
        const phoneNumbers = Array.from(text.matchAll(phoneRegex), (m) => m[0]);
        $("a").each((_, element) => {
            const href = $(element).attr("href");
            if (href.includes("facebook.com") ||
                href.includes("twitter.com") ||
                href.includes("instagram.com")) {
                socialMediaLinks.push(href);
            }
        });
        $("h1, h2, h3, h4, h5, h6").each((_, element) => {
            if ($(element).text().toLowerCase().includes("address")) {
                addresses.push($(element).next("p").text());
            }
        });
        await browser.close();
        const websiteInfo = {
            domain,
            phone_numbers: phoneNumbers,
            social_media: socialMediaLinks,
            address: addresses,
        };
        return websiteInfo;
    }
};
exports.ScraperService = ScraperService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(websites_entity_1.WebsiteEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        axios_1.HttpService])
], ScraperService);
//# sourceMappingURL=scraper.service.js.map