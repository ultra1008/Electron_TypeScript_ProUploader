import { BusyModule } from '@app/shared/ui/busy/busy.component';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgModule } from '@angular/core';
import { OrderDetailsFormComponentModule } from '@app/orders/ui/order-details-form/order-details-form.component';
import { OrderDetailsPage } from './order-details.page';
import { OrderDetailsRoutingModule } from './order-details-routing.module';
import { OrderUploadFilesComponentModule } from '@app/orders/ui/order-upload-files/order-upload-files.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    NgbModule,
    ReactiveFormsModule,

    BusyModule,
    OrderDetailsFormComponentModule,
    OrderDetailsRoutingModule,
    OrderUploadFilesComponentModule,
  ],
  declarations: [
    OrderDetailsPage
  ],
})
export class OrderDetailsModule { }
