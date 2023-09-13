import {
  $pf,
  DealerProductsService,
  DealerService,
  Product
} from 'pfshared/pfapi';
import { AppState } from '@app/shared/state/app.state';
import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  NgModule,
  OnChanges,
  OnInit,
  SimpleChanges
} from '@angular/core';
import { deleteOrderUpload } from '@app/orders/data-access/order-upload.actions';
import { FormGroup, FormGroupDirective, ReactiveFormsModule } from '@angular/forms';
import { MomentModule } from 'ngx-moment';
import { OrderUploadEx } from '@app/orders/data-access/order-upload.model';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-order-details-form',
  template: `
    <form [formGroup]="form" ngNativeValidate>
      <div class="row align-items-center mb-3">
        <div class="col-md-6">
          <div class="d-flex">
            <ng-container *ngIf="isNewOrder">
              <h3>{{ "ORDERS.ORDER_DETAILS.NEW_ORDER" | translate }}</h3>
            </ng-container>
            <ng-container *ngIf="orderUpload.idOrder > 0">
              <h3 class="mb-0">{{ "_.ORDER" | translate }}: {{orderUpload.idOrder}}</h3>
              <button type="button" class="btn btn-plain" (click)="cancelOrderClicked()" title="Cancel Order"><i class="fa-solid fa-trash-can fa-xl px-2 text-primary"></i></button>
            </ng-container>
          </div>
        </div>
        <div class="col-md-6">
          <div class="d-flex justify-content-end">
            <div class="w-100 row align-items-center">
              <label for="BagNumber" class="col-sm-3 col-form-label fs-4 text-end">{{ "ORDERS.BAG_NUMBER" | translate }}:</label>
              <div class="col-sm-9">
                <input type="text" class="form-control" formControlName="BagNumber">
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-12" *ngIf="!isNewOrder">
          <h5>{{ "_.DATE" | translate }}: {{orderUpload.DateCreatedUtc | amFromUtc | amDateFormat:"dddd, MMMM Do YYYY, h:mm a"}}</h5>
        </div>
      </div>
      <div class="row g-3">
        <div class="col-md-12">
          <label for="Email" class="form-label">Email</label>
          <input type="email" class="form-control" formControlName="Email" placeholder="name@example.com">
        </div>
        <div class="col-md-6">
          <label for="FirstName" class="form-label">First Name</label>
          <input type="text" class="form-control" formControlName="FirstName" placeholder="First Name">
        </div>
        <div class="col-md-6">
          <label for="LastName" class="form-label">Last Name</label>
          <input type="text" class="form-control" formControlName="LastName" placeholder="Last Name">
        </div>
        <ng-container *ngIf="isNewOrder || orderUpload.Products.length <= 1">
          <div class="col-md-12">
            <label for="idProduct" class="form-label">Product</label>
            <select class="form-select" formControlName="Product" [compareWith]="compareProduct">
              <option *ngFor="let product of products$ | async" [ngValue]="product">
                {{product.Name}}
              </option>
            </select>
          </div>
          <div class="col-md-12">
            <label for="idLocation" class="form-label">Pickup Location</label>
            <select class="form-select" formControlName="idLocation">
              <option [ngValue]="0">&nbsp;</option>
              <option *ngFor="let store of stores$ | async" [ngValue]="store.Id">
                {{store.Name}} <ng-container *ngIf="store.StoreNumber">({{store.StoreNumber}})</ng-container>
              </option>
            </select>
          </div>
          <div class="col-md-3">
            <label for="Quantity" class="form-label">Quantity</label>
            <input type="number" class="form-control" formControlName="Quantity" placeholder="Quantity">
          </div>
        </ng-container>  
        <div class="col-12">
          <div class="form-check">
            <input type="checkbox" class="form-check-input" formControlName="SendEmail">
            <label class="form-check-label" for="SendEmail">Send Email Upon Upload</label>
          </div>
        </div>
        <div class="col-12">
          <div class="form-check">
            <input type="checkbox" class="form-check-input" formControlName="AllowImport">
            <label class="form-check-label" for="AllowImport">Allow Customer to Import Collections</label>
          </div>
        </div>
      </div>
    </form>
  `,
  styles: [
  ]
})
export class OrderDetailsFormComponent implements OnChanges, OnInit {
  constructor(
    private dealerProductsService: DealerProductsService,
    private dealerService: DealerService,
    private rootFormGroup: FormGroupDirective,
    private router: Router,
    private store: Store<AppState>
  ) { }

  @Input() orderUpload: OrderUploadEx;

  form: FormGroup;
  products$ = this.dealerProductsService.getProducts($pf.dealer.code, "digital-upload");
  stores$ = this.dealerService.getDealerStores($pf.dealer.code);

  get isNewOrder(): boolean {
    return this.orderUpload.idOrder <= 0;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['orderUpload']) {
      this.orderUpload = changes['orderUpload'].currentValue as OrderUploadEx;
      this.patchForm();
    }
  }

  ngOnInit(): void {
    this.form = this.rootFormGroup.control;
    this.patchForm();
  }

  cancelOrderClicked(): void {
    this.store.dispatch(deleteOrderUpload({ orderUpload: this.orderUpload }));
    this.router.navigate(["orders"]);
  }

  compareProduct(p1: Product, p2: Product): boolean {
    // if (p1 && p2){
    //   console.log(p1.idProduct + '-' + p2.idProduct);
    // }
    return p1 && p2 ? p1.idProduct === p2.idProduct : p1 === p2;
  }

  private patchForm() {
    if (this.form && this.orderUpload) {
      this.form.patchValue({
        AllowImport: this.orderUpload.AllowImport,
        BagNumber: this.orderUpload.BagNumber,
        Email: this.orderUpload.Email,
        FirstName: this.orderUpload.FirstName,
        idLocation: this.orderUpload.idLocation,
        LastName: this.orderUpload.LastName,
        Product: this.orderUpload.Products.length ? this.orderUpload.Products[0] : null,
        Quantity: this.orderUpload.Products.length ? this.orderUpload.Products[0].Quantity : 1,
        SendEmail: this.orderUpload.SendEmail
      });
    }
  }
}

@NgModule({
  imports: [
    CommonModule,
    MomentModule,
    ReactiveFormsModule,
    TranslateModule
  ],
  declarations: [OrderDetailsFormComponent],
  exports: [OrderDetailsFormComponent]
})
export class OrderDetailsFormComponentModule { }
