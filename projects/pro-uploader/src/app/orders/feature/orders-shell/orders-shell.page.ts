import { AppState } from '@app/shared/state/app.state';
import {
  combineLatest,
  interval,
  map,
  Subject,
  switchMap,
  take,
  takeUntil,
  tap
} from 'rxjs';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { loadOrderUploads, refreshOrderUploads } from '@app/orders/data-access/order-upload.actions';
import { Router } from '@angular/router';
import {
  selectActiveOrderUploads,
  selectOrderUploadsStatus,
  selectPendingOrderUploads,
  selectRecentOrderUploads
} from '@app/orders/data-access/order-upload.selectors';
import { Store } from '@ngrx/store';
import { OrderUploadsService } from '@app/orders/data-access/order-uploads.service';
import { selectCurrentSettings } from '@app/settings/data-access/settings.selectors';

@Component({
  selector: 'app-orders',
  template: `
    <header>
      <div class="actions">
        <button class="btn btn-primary" (click)="newOrderClicked()">{{'ORDERS.NEW_ORDER' | translate}}</button>
      </div>
      <div class="status" *ngIf="vm$ | async as vm">
        <h3 class="text-warning">{{'ORDERS.PENDING' | translate}} {{vm.pendingCount}}</h3>
        <h3 class="text-info">{{'ORDERS.UPLOADING' | translate}} {{vm.activeCount}}</h3>
        <h3 class="text-success">{{'ORDERS.RECENT' | translate}} {{vm.recentCount}}</h3>
      </div>
    </header>

    <section>
      <router-outlet></router-outlet>
    </section>

    <footer>
      <app-upload-activity></app-upload-activity>
    </footer>
  `,
  styles: [`
    :host {
      height: 100vh;
      display: grid;
      grid-template-columns: 1fr;
      grid-template-rows: auto 1fr 1fr;

      header {
          padding: 10px;
          display: flex;
          justify-content: space-between;
          align-items: center;

          .actions {
          }

          .status {
              display: flex;

              h3 {
                  margin: 0 1rem;
              }
          }
      }
    }
  `]
})
export class OrdersShellPage implements OnInit, OnDestroy {
  constructor(
    private orderUploadsService: OrderUploadsService,
    private router: Router,
    private store: Store<AppState>
  ) { }

  private unsubscribe$$ = new Subject<void>();

  vm$ = combineLatest([
    this.store.select(selectPendingOrderUploads),
    this.store.select(selectActiveOrderUploads),
    this.store.select(selectRecentOrderUploads)
  ]).pipe(
    map(([pending, active, recent]) => {
      return {
        pendingCount: pending?.length,
        activeCount: active?.length,
        recentCount: recent?.length
      };
    })
  );

  ngOnDestroy(): void {
    this.unsubscribe$$.next();
    this.unsubscribe$$.complete();
  }

  ngOnInit(): void {
    this.store.select(selectOrderUploadsStatus)
      .pipe(take(1))
      .subscribe(status => {
        if (status == 'pending' || status == 'error') {
          this.orderUploadsService.start();
          this.store.dispatch(loadOrderUploads());
        }
      });

    this.store.select(selectCurrentSettings)
      .pipe(take(1))
      .subscribe(settings => {
        this.orderUploadsService.refreshing$
          .pipe(
            takeUntil(this.unsubscribe$$),
            switchMap(e => interval(settings.general.refreshInterval * 60 * 1000).pipe(
              tap(_ => console.log("refeshing order uploads"))
            ))
          )
          .subscribe(() => {
            this.orderUploadsService.refreshData();
          });
      });
  }

  newOrderClicked() {
    this.router.navigate(["orders", "0"]);
  }
}
