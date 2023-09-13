import { CommonModule } from '@angular/common';
import { Component, Input, NgModule, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-collection-modal',
  template: `
      <form [formGroup]="form" (ngSubmit)="saveChanges()" ngNativeValidate>
    <div class="modal-header">
      <h4 class="modal-title">Collection</h4>
      <button type="button" class="btn-close" aria-label="Close" (click)="cancel()"></button>
    </div>
    <div class="modal-body">
        <div class="form-floating mb-3">
          <input type="text" class="form-control" formControlName="Name" placeholder="Name" autocomplete="off" ngbAutofocus>
          <label for="Name">Name</label>
        </div>
        <div class="form-floating mb-3">
          <input type="text" class="form-control" formControlName="TwinCheck" placeholder="Twin Check" autocomplete="off">
          <label for="Twin Check">Twin Check</label>
        </div>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-secondary" (click)="cancel()">Close</button>
      <button type="submit" class="btn btn-primary" (click)="saveChanges()">Save changes</button>
    </div>
    </form>
  `,
  styles: [
  ]
})
export class CollectionModalComponent implements OnInit {
  constructor(public activeModal: NgbActiveModal, private fb: FormBuilder) { }

  @Input() collection;

  form: FormGroup;

  ngOnInit(): void {
    this.form = this.fb.group({
      Name: [this.collection.Name, Validators.required],
      TwinCheck: [this.collection.TwinCheck]
    });
  }

  cancel() {
    this.activeModal.dismiss('Cancel');
  }

  saveChanges() {
    if (this.isValid()) {
      this.activeModal.close(this.form.value);
    }
  }

  private isValid(): boolean {
    if (!this.form.valid) {
      for (let el in this.form.controls) {
        this.form.controls[el].markAsDirty();
      }

      return false;
    }
    return true;
  }
}

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [CollectionModalComponent],
  exports: [CollectionModalComponent]
})
export class CollectionModalComponentModule { }

