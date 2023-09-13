import { CommonModule } from '@angular/common';
import { HomePage } from './home.page';
import { HomeRoutingModule } from './home-routing.module';
import { LoginFormModule } from '../ui/login-form/login-form.component';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    HomeRoutingModule,
    LoginFormModule,
    TranslateModule
  ],
  declarations: [HomePage],
})
export class HomePageModule { }
