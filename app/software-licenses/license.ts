export interface License {
    expiration: Date;
    hasExpired: boolean;
    license: string;
    licenseId: string;
    clientId: string;
}