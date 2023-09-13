import { CommonModule } from '@angular/common';
import { NgbPopoverModule, NgbProgressbarModule } from '@ng-bootstrap/ng-bootstrap';
import { NgModule } from '@angular/core';
import { NgxFilesizeModule } from 'ngx-filesize';
import { SearchModule } from '@app/shared/ui/search/search.component';
import { TranslateModule } from '@ngx-translate/core';
import { UploadsPage } from './uploads.page';
import { UploadsRoutingModule } from './uploads-routing.module';


@NgModule({
  imports: [
    CommonModule,
    UploadsRoutingModule,
    NgbPopoverModule,
    NgbProgressbarModule,
    NgxFilesizeModule,
    SearchModule,
    TranslateModule
  ],
  declarations: [UploadsPage]
})
export class UploadsPageModule { }
