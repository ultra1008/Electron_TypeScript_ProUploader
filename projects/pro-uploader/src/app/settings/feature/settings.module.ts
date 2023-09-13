import { ChecklistModule } from 'angular-checklist';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SettingsPage } from './settings.page';
import { SettingsRoutingModule } from './settings-routing.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    ChecklistModule,
    CommonModule,
    ReactiveFormsModule,
    SettingsRoutingModule,
    TranslateModule
  ],
  declarations: [
    SettingsPage
  ]
})
export class SettingsPageModule { }
