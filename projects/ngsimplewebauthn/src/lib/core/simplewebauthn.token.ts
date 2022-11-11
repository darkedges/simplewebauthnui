import { InjectionToken } from '@angular/core';
import { SimpleWebAuthnSettings } from './simplewebauthn.config';

export interface SimpleWebAuthnToken {
    settings: Partial<SimpleWebAuthnSettings>;
}

export const SIMPLEWEBAUTHN_TOKEN = new InjectionToken<SimpleWebAuthnToken>('SIMPLEWEBAUTHN_TOKEN');
