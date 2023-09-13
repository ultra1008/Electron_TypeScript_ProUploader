import { Injectable, TemplateRef } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor() { }

  toasts: any[] = [];

  private defaults = {
    animation: true, 
    autohide: true,
    delay: 5000
  };

  show(textOrTemplate: string | TemplateRef<any>, options: any = {}) {
    this.toasts.push({ textOrTemplate, classname: '', ...this.defaults, ...options });
  }

  showError(textOrTemplate: string | TemplateRef<any>, options: any = {}) {
    this.show(textOrTemplate, { classname: 'bg-danger', ...this.defaults, ...options });
  }

  showSuccess(textOrTemplate: string | TemplateRef<any>, options: any = {}) {
    this.show(textOrTemplate, { classname: 'bg-success', ...this.defaults, ...options });
  }

  showWarning(textOrTemplate: string | TemplateRef<any>, options: any = {}) {
    this.show(textOrTemplate, { classname: 'bg-warning', ...this.defaults, ...options });
  }

  remove(toast) {
    this.toasts = this.toasts.filter(t => t !== toast);
  }

  clear() {
    this.toasts.splice(0, this.toasts.length);
  }
}
