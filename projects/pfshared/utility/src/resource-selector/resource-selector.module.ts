import { Injector, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServiceLocator } from "./resource-selector";

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ]
})
export class ResourceSelectorModule {
  constructor(private injector: Injector) {
    ServiceLocator.injector = injector;
  }
}
