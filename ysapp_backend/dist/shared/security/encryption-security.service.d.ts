import { ConfigService } from "@nestjs/config";
export declare class EncryptionSecurityService {
    private readonly configService;
    private secretKey;
    private algoritm;
    constructor(configService: ConfigService);
    private generateRandomKey;
    cipher(str: string): string;
    decipher(encrypted: any): string;
}
