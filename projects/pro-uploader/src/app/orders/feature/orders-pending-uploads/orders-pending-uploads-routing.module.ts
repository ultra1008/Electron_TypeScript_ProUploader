import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OrdersPendingUploadsPage } from './orders-pending-uploads.page';

const routes: Routes = [
  {
    path: '',
    component: OrdersPendingUploadsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrdersPendingUploadsRoutingModule { }
