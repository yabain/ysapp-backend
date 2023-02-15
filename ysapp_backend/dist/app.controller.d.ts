import { ConfigService } from "@nestjs/config";
export declare class AppController {
    private configService;
    constructor(configService: ConfigService);
    get(): string;
}
