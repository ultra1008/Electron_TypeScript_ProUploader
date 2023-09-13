import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { OrdersShellPage } from './orders-shell.page';
import { OrdersShellRoutingModule } from './orders-shell-routing.module';
import { TranslateModule } from '@ngx-translate/core';
import { UploadActivityComponentModule } from '../../ui/upload-activity/upload-activity.component';

@NgModule({
  imports: [
    CommonModule,
    OrdersShellRoutingModule,
    TranslateModule,
    UploadActivityComponentModule
  ],
  declarations: [
    OrdersShellPage
  ]
})
export class OrdersShellModule { }
