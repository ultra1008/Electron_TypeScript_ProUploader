import { AppState } from '@app/shared/state/app.state';
import { combineLatest, map, Subject } from 'rxjs';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { deleteOrderUpload, processOrderUpload } from '@app/orders/data-access/order-upload.actions';
import { IsBusyService } from 'pfshared/is-busy';
import { isLoading, selectPendingOrderUploads } from '@app/orders/data-access/order-upload.selectors';
import { OrderUploadEx } from '@app/orders/data-access/order-upload.model';
import { OrderUploadsService } from '@app/orders/data-access/order-uploads.service';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-pending-uploads',
  template: `
    <header>
      <div class="caption d-flex">
        <h3>{{'ORDERS.PENDING_UPLOADS.TITLE' | translate}}</h3>
        <ng-container *ngIf="!(isLoading$ | async)">
          <button type="button" class="btn btn-plain ms-1" (click)="refreshClicked()" title="Refresh">
            <ng-container *ngIf="!(isRefreshingOrderUploads$ | async); else refreshingOrderUploads">
              <span><i class="fa-solid fa-arrows-rotate fa-xl text-primary"></i></span>
            </ng-container>
            <ng-template #refreshingOrderUploads>
              <span><i class="fa-solid fa-arrows-rotate fa-xl fa-spin text-primary"></i></span>
            </ng-template>
          </button>
        </ng-container>
      </div>
      <div class="search">
        <app-search [search]="search$ | async" (searchChanged)="onSearchChanged($event)" placeholder="{{'ORDERS.SEARCH' | translate}}"></app-search>
      </div>
    </header>

    <div class="content">
      <div class="scrollable-table-container">
        <div class="scrollable-table-wrapper">
          <table class="table table-striped table-hover">
            <thead>
              <tr>
                <th scope="col" class="order-number">{{'ORDERS.ORDER_NUMBER' | translate}}</th>
                <th scope="col">{{'ORDERS.BAG_NUMBER' | translate}}</th>
                <th scope="col">{{'ORDERS.TWIN_CHECK' | translate}}</th>
                <th scope="col">{{'ORDERS.TOKEN' | translate}}</th>
                <th scope="col">{{'ORDERS.EMAIL' | translate}}</th>
                <th scope="col">{{'ORDERS.CUSTOMER' | translate}}</th>
                <th scope="col" class="text-center">{{'_.AGE' | translate}}</th>
                <th scope="col" class="upload-actions text-center">&nbsp;</th>
              </tr>
            </thead>
            <tbody>
              <ng-container *ngIf="!(isLoading$ | async); else loading">
                <tr *ngFor="let orderUpload of pendingOrderUploads$ | async" (dblclick)="editOrderUploadClicked(orderUpload)">
                  <td scope="row">{{ orderUpload.idOrder }}</td>
                  <td>{{ orderUpload.BagNumber }}</td>
                  <td class="text-overflow">
                    <div title="{{ orderUpload | twinCheck }}">
                      {{ orderUpload | twinCheck }}
                    </div>
                  </td>
                  <td>{{ orderUpload.ClaimCode }}</td>
                  <td>{{ orderUpload.Email }}</td>
                  <td class="text-nowrap">{{ orderUpload | customerName }}</td>
                  <td class="text-center" title="{{ orderUpload.DateCreatedUtc | amLocal | amDateFormat:'MM/DD/yy hh:mm a' }}">
                    {{ orderUpload.DateCreatedUtc | amLocal | amTimeAgo }}
                  </td>
                  <td class="upload-actions text-center clickable">
                    <!-- OrderUpload Info -->
                    <span [ngbPopover]="popContent" [popoverTitle]="popTitle" [openDelay]="300" [closeDelay]="500" triggers="mouseenter:mouseleave">
                      <i class="fa-solid fa-circle-info fa-xl px-2"></i>
                    </span>
                    <!-- Edit OrderUpload -->
                    <span (click)="editOrderUploadClicked(orderUpload)" title="Edit Order">
                      <i class="fa-solid fa-square-pen fa-xl px-2"></i>
                    </span>
                    <!-- Process OrderUpload -->
                    <span *ngIf="busyService.isBusy({ key: 'process-order-upload-' + orderUpload.Id })">
                      <i class="fa-solid fa-circle-notch fa-spin fa-xl px-2"></i>
                    </span>
                    <span *ngIf="!busyService.isBusy({ key: 'process-order-upload-' + orderUpload.Id })" (click)="processOrderUploadClicked(orderUpload)" [class.disabled]="!canUpload(orderUpload)" title="Start Upload">
                      <i class="fa-solid fa-cloud-arrow-up fa-xl px-2"></i>
                    </span>
                    <!-- Delete OrderUpload -->
                    <span *ngIf="busyService.isBusy({ key: 'delete-order-upload-' + orderUpload.Id })">
                      <i class="fa-solid fa-circle-notch fa-spin fa-xl px-2"></i>
                    </span>
                    <span *ngIf="!busyService.isBusy({ key: 'delete-order-upload-' + orderUpload.Id })" (click)="deleteOrderUploadClicked(orderUpload)" title="Cancel Order">
                      <i class="fa-solid fa-trash-can fa-xl px-2"></i>
                    </span>
                  </td>
                  <ng-template #popTitle>
                    <div class="row">
                      <div class="col-sm-10">{{'_.PRODUCT' | translate}}</div>
                      <div class="col-sm-2 text-end ps-0">{{'_.QTY' | translate}}</div>
                    </div>
                  </ng-template>
                  <ng-template #popContent>
                    <div class="row" *ngFor="let product of orderUpload.Products">
                      <div class="col-sm-10">{{product.Breadcrumb}} > {{product.Description}}</div>
                      <div class="col-sm-2 text-end ps-0 text-success">{{product.Quantity}}</div>
                    </div>
                  </ng-template>
                </tr>
              </ng-container>

              <ng-template #loading>
                <tr *ngFor="let _ of [].constructor(10)">
                  <td class=""><div class="placeholder-glow"><span class="placeholder col-6"></span></div></td>
                  <td class=""><div class="placeholder-glow"><span class="placeholder col-6"></span></div></td>
                  <td class=""><div class="placeholder-glow"><span class="placeholder col-6"></span></div></td>
                  <td class=""><div class="placeholder-glow"><span class="placeholder col-6"></span></div></td>
                  <td class=""><div class="placeholder-glow"><span class="placeholder col-6"></span></div></td>
                  <td class=""><div class="placeholder-glow"><span class="placeholder col-6"></span></div></td>
                  <td class="text-center"><div class="placeholder-glow"><span class="placeholder col-4"></span></div></td>
                  <td class="text-center">
                    <div class="placeholder-glow">
                      <span class="placeholder col-2"></span>
                      <span class="placeholder col-2"></span>
                      <span class="placeholder col-2"></span>
                    </div>
                  </td>
                </tr>
              </ng-template>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <footer></footer>
  `,
  styles: [`
    :host {
      display: grid;
      grid-template-columns: 1fr;
      grid-template-rows: auto 1fr auto;
      height: 100%;

      header {
        padding: 10px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        background-color: gray;

        .caption {
          h3 {
            margin-bottom: 0;
          }
        }

        .search {
          width: 24rem;
        }
      }

      .content {
        td {
          cursor: default;
        }
        
        .order-number {
          width: 200px;
        }

        .upload-actions {
          width: 200px;
        }
      }

      footer {
      }
    }
  `]
})
export class OrdersPendingUploadsPage implements OnInit, OnDestroy {
  constructor(
    public busyService: IsBusyService,
    private orderUploadsService: OrderUploadsService,
    private router: Router,
    private store: Store<AppState>,
  ) { }

  private direction = "desc";
  private unsubscribe$$ = new Subject<void>();

  readonly isLoading$ = this.store.select(isLoading);
  readonly isRefreshingOrderUploads$ = this.busyService.isBusy$({ key: 'refreshing-order-uploads' });
  readonly search$ = this.orderUploadsService.search$;

  pendingOrderUploads$ = combineLatest([
    this.store.select(selectPendingOrderUploads),
    this.search$
  ]).pipe(
    map(([orderUploads, search]) => {
      let filtered = this.orderUploadsService.applySearch(search, orderUploads);
      let filteredAndSorted = filtered.sort((a, b) => {
        const res = this.compare(a.DateCreatedUtc, b.DateCreatedUtc)
        return this.direction === 'asc' ? res : -res;
      });

      return filteredAndSorted;
    })
  );

  ngOnDestroy(): void {
    this.unsubscribe$$.next();
    this.unsubscribe$$.complete();
  }

  ngOnInit(): void {
  }

  canUpload(orderUpload: OrderUploadEx): boolean {
    return this.orderUploadsService.canUpload(orderUpload);
  }

  editOrderUploadClicked(orderUpload: OrderUploadEx) {
    this.router.navigate(["orders", orderUpload.Id]);
  }

  deleteOrderUploadClicked(orderUpload: OrderUploadEx) {
    this.store.dispatch(deleteOrderUpload({ orderUpload }));
  }

  onSearchChanged(event) {
    this.orderUploadsService.updateSearch(event.search);
  }

  processOrderUploadClicked(orderUpload: OrderUploadEx) {
    this.store.dispatch(processOrderUpload({ orderUpload }));
  }

  refreshClicked() {
    this.orderUploadsService.refreshData();
  }

  private compare(v1: string | number | Date, v2: string | number | Date) {
    return v1 < v2 ? -1 : v1 > v2 ? 1 : 0
  }
}
