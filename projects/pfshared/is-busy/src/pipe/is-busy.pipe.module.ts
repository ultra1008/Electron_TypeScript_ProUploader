import { NgModule } from '@angular/core';
import { IsBusyPipe } from './is-busy.pipe';

@NgModule({
  declarations: [IsBusyPipe],
  exports: [IsBusyPipe],
})
export class IsBusyPipeModule {}
