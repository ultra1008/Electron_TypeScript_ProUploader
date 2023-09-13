import { CommonModule } from '@angular/common';
import { Component, NgModule, OnInit } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-busy',
  template: `
    <div><i class="fa-solid fa-circle-notch fa-spin fa-7x px-2"></i></div>
  `,
  host: { 
    'class': 'd-flex justify-content-center align-items-center text-info', 
    'style': 'position: absolute; top: 0; left: 0; right: 0; bottom: 0; z-index: 5000; background: rgba(204, 204, 204, 0.25); pointer-events: none' 
  }
})
export class BusyComponent implements OnInit {
  constructor() { }

  ngOnInit(): void { }
}

@NgModule({
  imports: [
    CommonModule,
    NgbModule
  ],
  declarations: [BusyComponent],
  exports: [BusyComponent],
})
export class BusyModule { }

