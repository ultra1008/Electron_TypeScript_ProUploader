import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import {
  PFApiLanguageInterceptor,
  PFApiODataInterceptor,
  PFApiRetryInterceptor,
  PFApiSecurityHMACInterceptor
} from 'pfshared/pfapi';

@NgModule({
  declarations: [],
  imports: [],
  exports: [],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: PFApiLanguageInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: PFApiSecurityHMACInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: PFApiRetryInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: PFApiODataInterceptor, multi: true },
  ]
})
export class PFApiModule {
  constructor() { }
}
