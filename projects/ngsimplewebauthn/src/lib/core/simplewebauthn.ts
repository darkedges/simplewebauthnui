import { Inject, Injectable } from '@angular/core';
import { DefaultConfig, SimpleWebAuthnSettings } from './simplewebauthn.config';
import { SimpleWebAuthnToken, SIMPLEWEBAUTHN_TOKEN } from './simplewebauthn.token';

@Injectable({ providedIn: 'root' })
export class SimpleWebAuthn {
    settings: SimpleWebAuthnSettings;

    constructor(
        @Inject(SIMPLEWEBAUTHN_TOKEN) setup: SimpleWebAuthnToken,
    ) {
        const defaultConfig = new DefaultConfig();
        this.settings = { ...defaultConfig, ...setup.settings };
        this.settings.swa = {
            ...defaultConfig.swa,
            ...setup.settings.swa,
        };
    }
}
