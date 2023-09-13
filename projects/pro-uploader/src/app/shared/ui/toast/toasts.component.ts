import { CommonModule } from '@angular/common';
import { Component, NgModule, OnInit, TemplateRef } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from './toast.service';

@Component({
  selector: 'app-toasts',
  template: `
    <ngb-toast
      *ngFor="let toast of toastService.toasts"
      [class]="toast.classname"
      [autohide]="toast.autohide"
      [delay]="toast.delay || 5000"
      (mouseenter)="toast.autohide = false"
      (mouseleave)="toast.autohide = true"
      (hidden)="toastService.remove(toast)"
    >
      <ng-template [ngIf]="isTemplate(toast)" [ngIfElse]="text">
        <ng-template [ngTemplateOutlet]="toast.textOrTemplate"></ng-template>
      </ng-template>

      <ng-template #text><span [innerHtml]="toast.textOrTemplate"></span></ng-template>
    </ngb-toast>
  `,
  host: { 'class': 'toast-container position-fixed bottom-0 end-0 p-3', 'style': 'z-index: 1200' }
})
export class ToastsComponent implements OnInit {

  constructor(public toastService: ToastService) { }

  ngOnInit(): void {
  }

  isTemplate(toast) { return toast.textOrTpl instanceof TemplateRef; }
}

@NgModule({
  imports: [
    CommonModule,
    NgbModule
  ],
  declarations: [ToastsComponent],
  exports: [ToastsComponent],
})
export class ToastsModule { }

