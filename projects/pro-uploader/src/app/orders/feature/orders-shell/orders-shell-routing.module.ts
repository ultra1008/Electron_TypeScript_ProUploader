import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrdersShellPage } from './orders-shell.page';

const routes: Routes = [
  {
    path: '',
    component: OrdersShellPage,
    children: [
      {
        path: '',
        redirectTo: 'pending',
        pathMatch: 'full'
      },
      {
        path: 'pending',
        loadChildren: () =>
          import('../orders-pending-uploads/orders-pending-uploads.module').then(
            (m) => m.OrdersPendingUploadsModule
          )
      },
      {
        path: ':id',
        loadChildren: () =>
          import('../order-details/order-details.module').then(
            (m) => m.OrderDetailsModule
          )
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrdersShellRoutingModule { }
