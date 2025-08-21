/**
 * Optionen für die CMS-Konfiguration
 */
export interface CMSConfigOptions {
    /** Basis-URL des CMS (z.B. https://api.example.com) */
    baseURL: string;
    /** Optionaler API-Key für Authentifizierung */
    apiKey?: string;
}

/**
 * CMS-Konfiguration für das Node-Package
 */
export class CMSConfig {
    public baseURL: string;
    public apiKey?: string;

    constructor(options: CMSConfigOptions) {
        if (!options.baseURL || typeof options.baseURL !== 'string') {
            throw new Error('baseURL is required and needs to be a string.');
        }
        this.baseURL = options.baseURL;
        this.apiKey = options.apiKey ?? '';
    }
}