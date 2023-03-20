import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { browserSupportsWebAuthn, browserSupportsWebAuthnAutofill, startAuthentication, startRegistration } from '@simplewebauthn/browser';
import { AuthenticationResponseJSON, PublicKeyCredentialCreationOptionsJSON, PublicKeyCredentialRequestOptionsJSON, RegistrationResponseJSON } from '@simplewebauthn/typescript-types';
import { Observable } from 'rxjs';
import { SimpleWebAuthn } from './core/simplewebauthn';

@Injectable({
  providedIn: 'root'
})
export class SimpleWebAuthnService {
  protected getDelay = 0;
  protected timeout = 0;
  protected saveDelay = 0;
  protected delete404OK: boolean = false;
  protected root: string = '';

  constructor(
    protected http: HttpClient,
    private simpleWebAuthn: SimpleWebAuthn
  ) {
    this.root = this.simpleWebAuthn.settings.swa.url!;
  }

  async browserSupportsAutoFill(): Promise<boolean> {
    return await browserSupportsWebAuthnAutofill().then(
      boo => { return boo; }
    );
  }

  browserSupportsWebAuthn(): boolean {
    return browserSupportsWebAuthn();
  }

  generateAuthenticationOptions(): Observable<PublicKeyCredentialRequestOptionsJSON> {
    return this.http.get<PublicKeyCredentialRequestOptionsJSON>(`${this.root}/generate-authentication-options`,
      {
        withCredentials: true
      });
  }

  generateRegistrationOptions(): Observable<PublicKeyCredentialCreationOptionsJSON> {
    console.log(`${this.root}/generate-registration-options`)
    return this.http.get<PublicKeyCredentialCreationOptionsJSON>(`${this.root}/generate-registration-options`,
      {
        withCredentials: true
      });
  }

  startRegistration(opts: PublicKeyCredentialCreationOptionsJSON) {
    return startRegistration(opts);
  }

  startAuthentication(opts: PublicKeyCredentialRequestOptionsJSON) {
    return startAuthentication(opts);
  }

  verifyRegistration(data: RegistrationResponseJSON) {
    console.log(`${this.root}/verify-registration`)
    return this.http.post<any>(`${this.root}/verify-registration`, data, {
      withCredentials: true,
      headers: new HttpHeaders({
        "Content-Type": "application/json"
      })
    });
  }

  verifyAuthentication(data: AuthenticationResponseJSON) {
    return this.http.post<any>(`${this.root}/verify-authentication`, data, {
      withCredentials: true,
      headers: new HttpHeaders({
        "Content-Type": "application/json"
      })
    });
  }
}
