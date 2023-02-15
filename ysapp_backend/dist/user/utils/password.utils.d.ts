export declare class PasswordUtil {
    static hash(password: string): string;
    static compare(savedPassword: string, newPassword: string): boolean;
}
