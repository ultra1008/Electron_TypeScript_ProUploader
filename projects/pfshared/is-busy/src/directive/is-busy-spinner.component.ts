import { Component, ChangeDetectorRef, ElementRef } from '@angular/core';

@Component({
  selector: 'is-busy-spinner',
  template: ``,
  host: { class: 'is-busy-spinner' },
})
export class IsBusySpinnerComponent {
  // don't need change detection for this component
  constructor(private cdr: ChangeDetectorRef, public el: ElementRef) {
    this.cdr.detach();
  }
}
