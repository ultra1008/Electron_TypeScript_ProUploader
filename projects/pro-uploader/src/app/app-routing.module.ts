import { AuthGuard } from './home/data-access/auth.guard';
import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: () => import('./home/feature/home.module').then(m => m.HomePageModule)
  },
  {
    path: 'orders',
    loadChildren: () => import('./orders/feature/orders-shell/orders-shell.module').then(m => m.OrdersShellModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'settings',
    loadChildren: () => import('./settings/feature/settings.module').then(m => m.SettingsPageModule),
    canActivate: [AuthGuard]
  },
  { 
    path: 'uploads', 
    loadChildren: () => import('./uploads/feature/uploads.module').then(m => m.UploadsPageModule),
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { enableTracing: false, useHash: false, preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
