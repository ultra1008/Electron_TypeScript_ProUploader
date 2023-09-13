import { NgModule } from "@angular/core";
import { IsBusySpinnerComponent } from "./is-busy-spinner.component";
import { IsBusyDirective } from "./is-busy.directive";

@NgModule({
  declarations: [
    IsBusyDirective, 
    IsBusySpinnerComponent
  ],
  entryComponents: [
    IsBusySpinnerComponent
  ],
  exports: [IsBusyDirective],
})
export class IsBusyDirectiveModule {}
