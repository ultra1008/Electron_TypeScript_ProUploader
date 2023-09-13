import { NgModule } from "@angular/core";
import { IsBusyDirectiveModule } from "./directive/is-busy.directive.module";
import { IsBusyPipeModule } from "./pipe/is-busy.pipe.module";

@NgModule({
  imports: [
    IsBusyDirectiveModule, 
    IsBusyPipeModule
  ],
  providers: [],
  exports: [
    IsBusyDirectiveModule, 
    IsBusyPipeModule
  ],
})
export class IsBusyModule {}
