import { CommonModule } from '@angular/common';
import { CustomerNamePipeModule } from '@app/orders/ui/customer-name.pipe';
import { IsBusyModule } from 'pfshared/is-busy';
import { MomentModule } from 'ngx-moment';
import { NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';
import { NgModule } from '@angular/core';
import { OrdersPendingUploadsPage } from './orders-pending-uploads.page';
import { OrdersPendingUploadsRoutingModule } from './orders-pending-uploads-routing.module';
import { SearchModule } from '@app/shared/ui/search/search.component';
import { TranslateModule } from '@ngx-translate/core';
import { TwinCheckPipeModule } from '@app/orders/ui/twin-check.pipe';

@NgModule({
  imports: [
    CommonModule,
    CustomerNamePipeModule,
    IsBusyModule,
    MomentModule,
    NgbPopoverModule,
    OrdersPendingUploadsRoutingModule,
    SearchModule,
    TranslateModule,
    TwinCheckPipeModule
  ],
  declarations: [OrdersPendingUploadsPage],
})
export class OrdersPendingUploadsModule { }
