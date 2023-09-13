import { AppState } from '@app/shared/state/app.state';
import { cancelOrderUpload, markOrderUploadComplete, sendOrderUploadEmail } from '@app/orders/data-access/order-upload.actions';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { combineLatest, map } from 'rxjs';
import { CommonModule } from '@angular/common';
import { CustomerNamePipeModule } from '@app/orders/ui/customer-name.pipe';
import { MomentModule } from 'ngx-moment';
import { NgbDropdownModule, NgbProgressbarModule } from '@ng-bootstrap/ng-bootstrap';
import { NgModule } from '@angular/core';
import { OrderUploadEx } from '@app/orders/data-access/order-upload.model';
import { OrderUploadsService } from '@app/orders/data-access/order-uploads.service';
import { SearchModule } from '@app/shared/ui/search/search.component';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { TwinCheckPipeModule } from '../twin-check.pipe';
import { UploadService } from '@app/uploads/data-access/upload.service';
import { UploadStatus } from 'pfshared/pfapi';

@Component({
  selector: 'app-upload-activity',
  template: `
    <header>
      <div class="caption">
        <h3>{{'ORDERS.UPLOAD_ACTIVITY.TITLE' | translate}}</h3>
      </div>
    </header>

    <div class="content">
      <div class="scrollable-table-container">
        <div class="scrollable-table-wrapper">
          <ng-container *ngIf="
            {
              orderUploads: uploadActivity$ | async,
              activitySummary: uploadActivitySummary$ | async
            } as vm">
            <table class="table table-striped table-hover">
              <thead>
                <tr>
                  <th scope="col" class="order-number">{{'ORDERS.ORDER_NUMBER' | translate}}</th>
                  <th scope="col">{{'ORDERS.BAG_NUMBER' | translate}}</th>
                  <th scope="col">{{'ORDERS.TWIN_CHECK' | translate}}</th>
                  <th scope="col">{{'ORDERS.TOKEN' | translate}}</th>
                  <th scope="col">{{'ORDERS.EMAIL' | translate}}</th>
                  <th scope="col">{{'ORDERS.CUSTOMER' | translate}}</th>
                  <th scope="col" class="text-end">{{'ORDERS.UPLOAD_ACTIVITY.COLLECTIONS' | translate}}</th>
                  <th scope="col" class="text-end">{{'ORDERS.UPLOAD_ACTIVITY.PHOTOS' | translate}}</th>
                  <th scope="col" class="upload-progress text-center">{{'ORDERS.UPLOAD_ACTIVITY.STATUS' | translate}}</th>
                  <th scope="col" class="upload-actions text-center">{{'ORDERS.UPLOAD_ACTIVITY.UPLOADED' | translate}}</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let orderUpload of vm.orderUploads">
                  <td class="clickable">
                    <div (click)="orderNumberClicked(orderUpload)">
                      {{ orderUpload.idOrder }}
                    </div>
                  </td>
                  <td>{{ orderUpload.BagNumber }}</td>
                  <td class="text-overflow">
                    <div title="{{ orderUpload | twinCheck }}">
                      {{ orderUpload | twinCheck }}
                    </div>
                  </td>
                  <td>
                    <div ngbDropdown>
                      <a ngbDropdownToggle class="link-light text-decoration-none">
                        {{ orderUpload.ClaimCode }}
                      </a>
                      <div ngbDropdownMenu>
                        <a ngbDropdownItem (click)="viewOrderUploadOnSiteClicked(orderUpload)">View Upload on Site</a>
                        <a ngbDropdownItem (click)="copyOrderUploadLinkClicked(orderUpload)">Copy Upload Link</a>
                        <a ngbDropdownItem (click)="sendOrderUploadEmailClicked(orderUpload)">Resend Upload Complete Email</a>
                      </div>
                    </div>
                  </td>
                  <td>{{ orderUpload.Email }}</td>
                  <td class="text-nowrap">{{ orderUpload | customerName }}</td>
                  <td class="text-end">{{ orderUpload.Collections.length | number }}</td>
                  <td class="text-end">{{ vm.activitySummary[orderUpload.Id].fileCount | number }}</td>

                  <ng-container *ngIf="orderUpload.status == UploadStatus.Complete">
                    <td class="text-center align-middle">uploaded</td>
                    <td class="upload-actions text-center text-nowrap" title="{{ orderUpload.DateUploadedUtc | amLocal | amTimeAgo }}">
                      {{orderUpload.DateUploadedUtc | amLocal | amDateFormat:'MM/DD/yy hh:mm a'}}
                    </td>
                  </ng-container>

                  <ng-container *ngIf="orderUpload.status != UploadStatus.Complete">
                    <td class="text-center align-middle" *ngIf="vm.activitySummary[orderUpload.Id].progress == 0">
                      pending
                    </td>
                    <td class="text-start align-middle" *ngIf="vm.activitySummary[orderUpload.Id].progress > 0">
                      <span class="upload-progress">
                        <span class="progress-bar-container">
                          <ngb-progressbar 
                            [type]="vm.activitySummary[orderUpload.Id].failedCount ? 'danger' : 'success'" 
                            textType="white" 
                            [value]="vm.activitySummary[orderUpload.Id].progress" 
                            [showValue]="true">
                          </ngb-progressbar>
                        </span>
                        <span class="busy-container" *ngIf="vm.activitySummary[orderUpload.Id].busy"><i class="fa-solid fa-circle-notch fa-spin"></i></span>
                      </span>
                    </td>
                    <td class="upload-actions text-center clickable">
                      <!-- Cancel OrderUpload -->
                      <span (click)="cancelOrderUploadClicked(orderUpload)" title="Cancel Upload">
                        <i class="fa-solid fa-circle-stop fa-xl px-2"></i>
                      </span>
                      <ng-container *ngIf="vm.activitySummary[orderUpload.Id].progress == 100">
                        <!-- Retry OrderUpload -->
                        <span (click)="retryOrderUploadClicked(orderUpload)" title="Retry Upload">
                          <i class="fa-solid fa-repeat fa-xl px-2"></i>
                        </span>
                        <!-- Mark OrderUpload Complete -->
                        <span (click)="completeOrderUploadClicked(orderUpload)" title="Mark Order as Complete">
                          <i class="fa-solid fa-circle-check fa-xl px-2"></i>
                        </span>
                      </ng-container>
                    </td>
                  </ng-container>
                </tr>
              </tbody>
            </table>
          </ng-container>
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
        .order-number {
          width: 200px;
        }

        th.upload-progress {
          width: 200px;
        }

        td {
          cursor: default;
        }

        td > .upload-progress {
          display: flex;
          gap: 5px;
          flex-direction: row;
          align-items: center;

          .progress-bar-container {
            flex-grow: 1;
          }

          .busy-container {
          }
        }

        .upload-actions {
          width: 200px;
        }
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UploadActivityComponent implements OnInit {
  constructor(
    private store: Store<AppState>,
    private uploadService: UploadService,
    private orderUploadsService: OrderUploadsService,
  ) { }

  readonly UploadStatus = UploadStatus;
  readonly search$ = this.orderUploadsService.search$;

  private direction = "desc";

  uploadActivity$ = combineLatest([
    this.uploadService.uploadActivity$,
    this.search$
  ]).pipe(
    map(([orderUploads, search]) => {
      // apply search
      let filtered = this.orderUploadsService.applySearch(search, orderUploads);

      // apply sort
      let filteredAndSorted = filtered.sort((a, b) => {
        const res = this.compare(a.DateUploadedUtc, b.DateUploadedUtc)
        return this.direction === 'asc' ? res : -res;
      });

      return filteredAndSorted;
    })
  );

  uploadActivitySummary$ = this.uploadService.uploadActivitySummary$;

  ngOnInit(): void {
  }

  cancelOrderUploadClicked(orderUpload: OrderUploadEx) {
    this.store.dispatch(cancelOrderUpload({ orderUpload }));
  }

  completeOrderUploadClicked(orderUpload: OrderUploadEx) {
    this.store.dispatch(markOrderUploadComplete({ orderUpload }));
  }

  copyOrderUploadLinkClicked(orderUpload: OrderUploadEx) {
    this.orderUploadsService.copyClaimCode(orderUpload);
  }

  orderNumberClicked(orderUpload: OrderUploadEx) {
    this.orderUploadsService.openOrderNumber(orderUpload);
  }

  retryOrderUploadClicked(orderUpload: OrderUploadEx) {
    this.store.dispatch(cancelOrderUpload({ orderUpload, retry: true }));
  }

  sendOrderUploadEmailClicked(orderUpload: OrderUploadEx) {
    this.store.dispatch(sendOrderUploadEmail({ orderUpload }));
  }

  viewOrderUploadOnSiteClicked(orderUpload: OrderUploadEx) {
    this.orderUploadsService.openClaimCode(orderUpload);
  }

  private compare(v1: string | number | Date, v2: string | number | Date) {
    return v1 < v2 ? -1 : v1 > v2 ? 1 : 0
  }
}

@NgModule({
  imports: [
    CommonModule,
    CustomerNamePipeModule,
    MomentModule,
    NgbDropdownModule,
    NgbProgressbarModule,
    SearchModule,
    TranslateModule,
    TwinCheckPipeModule
  ],
  declarations: [UploadActivityComponent],
  exports: [UploadActivityComponent]
})
export class UploadActivityComponentModule { }
