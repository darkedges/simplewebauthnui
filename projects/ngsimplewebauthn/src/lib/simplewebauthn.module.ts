import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { SimpleWebAuthnComponent } from './components/simplewebauthn.component';
import { SimpleWebAuthnSettings } from './core/simplewebauthn.config';
import { SIMPLEWEBAUTHN_TOKEN } from './core/simplewebauthn.token';



@NgModule({
  declarations: [
    SimpleWebAuthnComponent
  ],
  imports: [
    HttpClientModule,
    CommonModule
  ],
  exports: [
    SimpleWebAuthnComponent
  ]
})
export class SimpleWebAuthnModule {
  constructor(@Optional() @SkipSelf() parentModule?: SimpleWebAuthnModule) {
    if (parentModule) {
      throw new Error(
        'NgSimpleWebAuthnModule is already loaded. Import it in the AppModule only');
    }
  }

  static forRoot(
    settings: Partial<SimpleWebAuthnSettings> = {},
  ): ModuleWithProviders<SimpleWebAuthnModule> {
    return {
      ngModule: SimpleWebAuthnModule,
      providers: [
        {
          provide: SIMPLEWEBAUTHN_TOKEN,
          useValue: {
            settings
          }
        }
      ]
    };
  }
}
