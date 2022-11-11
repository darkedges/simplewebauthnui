export interface SWASettings {
    url: string;
}

export interface SimpleWebAuthnSettings {
    swa: Partial<SWASettings>;
}

export class DefaultConfig implements SimpleWebAuthnSettings {
    swa = {
        url: ''
    };
}