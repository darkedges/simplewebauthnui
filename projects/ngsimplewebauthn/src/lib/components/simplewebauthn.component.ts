import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { SimpleWebAuthnService } from '../../public-api';
import { SimpleWebAuthn } from '../core/simplewebauthn';

@Component({
  selector: 'lib-ngsimplewebauthn',
  templateUrl: 'simplewebauthn.component.html',
  styleUrls: ['simplewebauthn.component.scss']
})
export class SimpleWebAuthnComponent implements OnInit {
  browserSupportsWebAuthn: boolean = false;
  authenticationOptions: any;
  registrationError: string = '';
  registrationDebug: string = '';
  registrationSuccess: string = '';
  authenticationError: string = '';
  authenticationDebug: string = '';
  authenticationSuccess: string = '';
  clearDebug: string = '';

  constructor(
    private simpleWebAuthnService: SimpleWebAuthnService,
    private simpleWebAuthn: SimpleWebAuthn,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.browserSupportsWebAuthn = this.simpleWebAuthnService.browserSupportsWebAuthn();
  }

  clearRegistration() {
    this.registrationError = '';
    this.registrationDebug = '';
    this.registrationSuccess = '';
  }

  clearAuthentication() {
    this.authenticationError = '';
    this.authenticationDebug = '';
    this.authenticationSuccess = '';
  }

  clearDebugMessages() {
    this.clearAuthentication();
    this.clearRegistration();
    this.clearDebug = '';
  }

  clearDevices() {
    this.clearDebugMessages();
    this.http.get(`${this.simpleWebAuthn.settings.swa.url}/cleardevices`).subscribe(data => {
      this.clearDebug = JSON.stringify(data, null, 2);
    });
  }

  authenticationBegin() {
    this.clearAuthentication();
    this.simpleWebAuthnService.generateAuthenticationOptions().subscribe(
      opts => {
        this.authenticationDebug = '// Authentication Options\n' + JSON.stringify(opts, null, 2);
        this.simpleWebAuthnService.startAuthentication(opts).then(
          data => {
            this.authenticationDebug += '\n\n// Authentication Response\n' + JSON.stringify(data, null, 2);
            this.simpleWebAuthnService.verifyAuthentication(data).subscribe(
              verificationJSON => {
                this.authenticationDebug += '\n\n// Server Response\n' + JSON.stringify(verificationJSON, null, 2);
                if (verificationJSON && verificationJSON.verified) {
                  this.authenticationSuccess = `User authenticated!`;
                } else {
                  this.registrationError = `Oh no, something went wrong! Response: <pre>${JSON.stringify(
                    verificationJSON,
                  )}</pre>`;
                }
              },
              error => {
                this.authenticationError = error.error.error
              }
            )
          },
          error => {
            if (error.name === 'InvalidStateError') {
              this.authenticationError = "Error: Authenticator was probably already registered by user";
            } else {
              this.authenticationError = error;
            }
          }
        )
      }
    )
  }

  registrationBegin() {
    this.clearRegistration();
    this.simpleWebAuthnService.generateRegistrationOptions().subscribe(
      opts => {
        opts.authenticatorSelection!.residentKey = 'required';
        opts.authenticatorSelection!.requireResidentKey = true;
        opts.extensions = {
          credProps: true,
        };
        this.registrationDebug = '// Registration Options\n' + JSON.stringify(opts, null, 2);
        this.simpleWebAuthnService.startRegistration(opts).then(
          data => {
            this.registrationDebug += '\n\n// Registration Response\n' + JSON.stringify(data, null, 2);
            this.simpleWebAuthnService.verifyRegistration(data).subscribe(
              verificationJSON => {
                this.registrationDebug += '\n\n// Server Response\n' + JSON.stringify(verificationJSON, null, 2);
                if (verificationJSON && verificationJSON.verified) {
                  this.registrationSuccess = `Authenticator registered!`;
                } else {
                  this.registrationError = `Oh no, something went wrong! Response: <pre>${JSON.stringify(
                    verificationJSON,
                  )}</pre>`;
                }
              },
              error => {
                this.registrationError = error.error.error
              }
            );
          },
          error => {
            if (error.name === 'InvalidStateError') {
              this.registrationError = "Error: Authenticator was probably already registered by user";
            } else {
              this.registrationError = error;
            }
          }
        )
      }
    );
  }

}
