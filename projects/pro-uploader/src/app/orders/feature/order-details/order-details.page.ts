import { addOrderUpload, deleteOrderUpload, updateOrderUpload } from '@app/orders/data-access/order-upload.actions';
import { AppState } from '@app/shared/state/app.state';
import { combineLatest, map, Observable, take } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IsBusyService } from 'pfshared/is-busy';
import { OrderUploadEx } from '@app/orders/data-access/order-upload.model';
import { Router } from '@angular/router';
import { selectAllOrderUploads } from '@app/orders/data-access/order-upload.selectors';
import { selectCurrentRouterState } from '@app/shared/state/router-state.selectors';
import { Store } from '@ngrx/store';
import { OrderUploadsService } from '@app/orders/data-access/order-uploads.service';

@Component({
  selector: 'app-order-details',
  template: `
    <ng-container *ngIf="orderUpload$ | async as orderUpload">
      <div class="order-upload-details" [formGroup]="orderDetailsForm">
        <app-order-details-form [orderUpload]="orderUpload"></app-order-details-form>
      </div>
      
      <div class="order-upload-files">
        <div class="order-upload-files__drop-zone">
          <app-order-upload-files [orderUpload]="orderUpload"></app-order-upload-files>
        </div>
      
        <div class="order-upload-files__actions">
          <div class="me-auto">
            <!--<button type="button" class="btn btn-secondary" (click)="cancelOrderClicked()" *ngIf="orderUpload.Id" title="Cancel Order"><i class="fa-solid fa-trash-can px-2"></i></button>-->
          </div>
          <div>
            <button type="button" class="btn btn-secondary ms-2" (click)="discardChangesClicked()">Discard Changes</button>
            <button type="button" class="btn btn-secondary ms-2" (click)="saveAndCloseClicked()">Save & Close</button>
            <button type="button" class="btn btn-primary ms-2" (click)="startUploadClicked()" [disabled]="!canUpload">Start Upload</button>
          </div>
        </div>
      </div>
    </ng-container>
    <app-busy *ngIf="isBusy$ | async"></app-busy>
  `,
  styles: [`
    :host {
      display: grid;
      grid-template-columns: 1fr 1fr;
      grid-template-rows: 1fr;
      gap: 10px;
      height: 100%;
      border-top: solid 2px white;
      position: relative;

      .order-upload-details {
        height: 100%;
        padding: 10px;
      }

      .order-upload-files {
        height: 100%;
        padding: 10px;
        display: flex;
        flex-direction: column;
        gap: 10px;

        &__drop-zone {
          flex-grow: 1;

          &.drop-over {
            background-color: lightgray;
          }
        }

        &__actions {
          flex-grow: 0;
          display: flex;
        }
      }
    }
  `]
})
export class OrderDetailsPage implements OnInit {
  constructor(
    private busyService: IsBusyService,
    private fb: FormBuilder,
    private orderUploadsService: OrderUploadsService,
    private router: Router,
    private store: Store<AppState>
  ) {
    this.orderDetailsForm = this.fb.group({
      AllowImport: [true],
      BagNumber: [''],
      Email: ['', [Validators.email, Validators.required]],
      FirstName: [''],
      LastName: [''],
      Product: [null, Validators.required],
      idLocation: [null],
      Quantity: [1, [Validators.required, Validators.min(1), Validators.max(999)]],
      SendEmail: [true],
    });
  }

  private orderUpload: OrderUploadEx;

  isBusy$: Observable<boolean>;
  orderDetailsForm: FormGroup;

  // get selected order upload from router state
  orderUpload$ = combineLatest([
    this.store.select(selectAllOrderUploads),
    this.store.select(selectCurrentRouterState),
  ]).pipe(
    take(1),
    map(([orderUploads, route]) => {
      const id = route.params["id"];
      if (id && id !== '0') {
        const orderUpload = orderUploads.find((o) => o.Id === id)
        if (orderUpload) {
          // create a shallow copy for editing
          this.orderUpload = { ...orderUpload };
        }
      }

      if (!this.orderUpload) {
        this.orderUpload = new OrderUploadEx();
      }

      return this.orderUpload;
    })
  );

  get canUpload(): boolean {
    return this.orderUploadsService.canUpload(this.orderUpload);
  }

  ngOnInit(): void {
    this.isBusy$ = this.busyService.isBusy$();
  }

  cancelOrderClicked(): void {
    this.store.dispatch(deleteOrderUpload({ orderUpload: this.orderUpload }));
    this.router.navigate(["orders"]);
  }

  discardChangesClicked(): void {
    this.router.navigate(["orders"]);
  }

  saveAndCloseClicked(): void {
    this.saveAndClose(false);
  }

  startUploadClicked(): void {
    this.saveAndClose(true);
  }

  private isValid(): boolean {
    if (!this.orderDetailsForm.valid) {
      for (let el in this.orderDetailsForm.controls) {
        this.orderDetailsForm.controls[el].markAsDirty();
      }

      return false;
    }
    return true;
  }

  private saveAndClose(upload: boolean): void {
    if (this.saveEdits()) {
      if (this.orderUpload.idOrder <= 0) {
        this.store.dispatch(addOrderUpload({ orderUpload: this.orderUpload, upload }));
      } else {
        this.store.dispatch(updateOrderUpload({ orderUpload: this.orderUpload, upload }));
      }
    }
  }

  private saveEdits(): boolean {
    if (!this.isValid()) {
      return false;
    }

    var formValues = this.orderDetailsForm.value;
    var updates = { ...formValues, Product: undefined, Products: [{ ...formValues.Product, Quantity: formValues.Quantity }], Quantity: undefined };

    this.orderUpload = { ...this.orderUpload, ...updates };

    return true;
  }
}

